<?php


require_once KARMA_CLUSTER_PATH . '/classes/options.php';

/**
 *	Class Karma_Clusters
 */
class Karma_Clusters extends Karma_Clusters_Options {

	var $version = '1';
	var $table_name = 'cache_clusters';
	var $cluster_path = WP_CONTENT_DIR.'/clusters';
	var $cluster_url = WP_CONTENT_URL.'/clusters';

	/**
	 *	Constructor
	 */
	public function __construct() {
		global $karma_clusters_options;


		if (is_admin()) {

			// require_once KARMA_CLUSTER_PATH . '/classes/options.php';
			// $karma_clusters_options = new Karma_Clusters_Options;

			require_once KARMA_CLUSTER_PATH . '/classes/dependencies.php';
			require_once KARMA_CLUSTER_PATH . '/classes/task-manager.php';



			add_action('wp_ajax_karma_update_clusters', array($this, 'ajax_update_clusters'));
			add_action('wp_ajax_karma_create_clusters', array($this, 'ajax_create_clusters'));
			add_action('wp_ajax_karma_delete_clusters', array($this, 'ajax_delete_clusters'));
			add_action('wp_ajax_karma_toggle_clusters', array($this, 'ajax_toggle_clusters'));

			add_action('wp_ajax_get_cluster', array($this, 'ajax_get_cluster'));
			add_action('wp_ajax_nopriv_get_cluster', array($this, 'ajax_get_cluster'));

			add_filter('karma_task', array($this, 'add_task'));
			add_action('karma_cache_cluster_dependency_updated', array($this, 'dependency_updated'));

			add_action('save_post', array($this, 'save_post'), 10, 3);
			add_action('before_delete_post', array($this, 'delete_post'), 99);

			add_action('init', array($this, 'create_dependency_tables'));
			add_action('karma_task_notice', array($this, 'task_notice'));
			add_action('admin_bar_menu', array($this, 'add_toolbar_button'), 999);

			add_action('registered_post_type', array($this, 'registered_post_type'), 10, 2);

		}

	}



	/**
	 * @hook 'init'
	 */
	function create_dependency_tables() {

		if (is_admin()) {

			require_once KARMA_CLUSTER_PATH . '/classes/table.php';

			// Karma_Table::create($this->table_name, "
			// 	id bigint(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
			// 	request varchar(255) NOT NULL,
			// 	path varchar(255) NOT NULL,
			// 	post_type varchar(255) NOT NULL,
			// 	status smallint(1) NOT NULL
			// ", '002');

			Karma_Table::create($this->table_name, "
				id bigint(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
				post_type varchar(255) NOT NULL,
				post_id bigint(11) NOT NULL,
				name varchar(255) NOT NULL,
				path varchar(255) NOT NULL,
				ext varchar(255) NOT NULL,
				status smallint(1) NOT NULL
			", '001');

		}

	}


	/**
	 * register cluster for post type
	 */
	public function register($post_type, $callback) {

		// $this->post_types[$post_type] = $callback;

		add_action('karma_clusters_update_'.$post_type, $callback, 10, 5);

	}

	/**
	 * @hook 'registered_post_type'
	 */
	public function registered_post_type($post_type, $post_type_object) {

		if (isset($post_type_object->clusters)) {

			$this->register($post_type, $post_type_object->clusters);

		}

	}


	/**
	 * @hook 'register_post_type'
	 */
	// public function register_post_type($post_type, $post_type_object) {
	//
	// 	$this->post_types[$post_type] = $callback;
	//
	// 	do_action( 'karma_cluster_register_'.$post_type, $post_type, $post_type_object );
	//
	//
	// }

	/**
	 * get_path
	 */
	public function get_path($post) {

		if ($post->post_type === 'post') {

			$path = $post->post_name;

			if (!$path) {

				$path = $post->ID;

			}

		} else if ($post->post_type === 'page') {

			$path = get_page_uri($post);

			if (!$path) {

				$path = $post->ID;

			}

		} else {

			$path = get_page_uri($post);

			if (!$path) {

				$path = $post->ID;

			}

			$post_type_object = get_post_type_object($post->post_type);

			if (isset($post_type_object->rewrite['slug'])) {

				$path = $post_type_object->rewrite['slug'].'/'.$path;

			} else {

				$path = $post->post_type.'/'.$path;

			}

		}

		return $path; // apply_filters('karma_cluster_uri', $path, $post);
	}

	/**
	 * create_cluster
	 */
	public function create_value($name, $post, $post_type, $ext = '.txt') {
		global $wpdb;

		$path = $this->get_path($post);

		$cluster_table = $wpdb->prefix.$this->table_name;

		$wpdb->insert($cluster_table, array(
			'path' => $path,
			'post_id' => $post->id,
			'post_type' => $post->post_type,
			'name' => $name,
			'ext' => $ext,
			'status' => 100
		), array(
			'%s',
			'%d',
			'%s',
			'%s',
			'%s',
			'%d'
		));

		$cluster_row = new stdClass();
		$cluster_row->id = $wpdb->insert_id;
		$cluster_row->path = $path;
		$cluster_row->post_id = $post->id;
		$cluster_row->post_type = $post->post_type;
		$cluster_row->name = $name;
		return $cluster_row;
	}



	/**
	 * update_cluster
	 */
	public function update_cluster($cluster_row) {
		global $karma_dependencies, $wpdb;

		$post = get_post($cluster_row->post_id);

		if ($post && has_filter('karma_clusters_update_'.$post->post_type.'_'.$cluster_row->name)) {

			$dependency_instance = $karma_dependencies->create_instance('cluster', $cluster_row->id);

			$value = apply_filters('karma_clusters_update_'.$post->post_type.'_'.$cluster_row->name, null, $post, $dependency_instance, $cluster_row);

			$dependency_instance->save();

		}

		if (isset($value)) {

			$this->update_cache($cluster_row, $value);

		} else {

			$this->delete_cache($cluster_row->path);

			$cluster_table = $wpdb->prefix.$this->table_name;

			$wpdb->query($wpdb->prepare("DELETE FROM $cluster_table WHERE id = %d", $cluster_row->id));

		}

	}

	/**
	 * update cache
	 */
	public function update_cache($cluster_row, $value) {

		$file = $this->cluster_path . '/' . $cluster_row->path.'/'.$cluster_row->name.'.'.$cluster_row->ext;

		if (!file_exists(dirname($file))) {

			mkdir(dirname($file), 0777, true);

		}

		if ($cluster_row->ext === '.json') {

			$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

		}

		file_put_contents($file, $value); // json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

	}

	/**
	 * delete cache
	 */
	public function delete_cache($cluster_row) {

		$file = $this->cluster_path . '/' . $cluster_row->path.'/'.$cluster_row->name.'.'.$cluster_row->ext;

		unlink($file);

		// $this->rrmdir($this->cluster_path.'/'.$path.'.json');

	}

	/**
	 * Remove directory and all content
	 */
	private function rrmdir($dir) {

		if (is_dir($dir)) {

			$objects = scandir($dir);

			foreach ($objects as $object) {

				if ($object != "." && $object != "..") {

					$this->rrmdir($dir."/".$object);

				}

			}

			rmdir($dir);

		} else if (is_file($dir)) {

			unlink($dir);

		}

	}

	/**
	 * update cache
	 */
	public function get_cache($cluster_row) {

		$file = $this->cluster_path . '/' . $cluster_row->path.'/'.$cluster_row->name.'.'.$cluster_row->ext;

		if (file_exists($file)) {

			if ($cluster_row->ext === '.json') {

				return json_decode(file_get_contents($file));

			}

			return $file;

		}

	}

	/**
	 * @filter 'karma_task'
	 */
	public function add_task($task) {
		global $wpdb, $karma_clusters_options;

		if (empty($task) && $karma_clusters_options->get_option('clusters_active')) {

			$cluster_table = $wpdb->prefix.$this->table_name;

			$outdated_cluster = $wpdb->get_row("SELECT * FROM $cluster_table WHERE status > 0 ORDER BY status DESC LIMIT 1");

			if ($outdated_cluster) {

				$query = $this->update_cluster($outdated_cluster);

				$task['action'] = 'cluster updated';
				$task['cluster_row'] = $outdated_cluster;
				$task['cluster'] = $this->get_cache($outdated_cluster->path);
				$task['notice'] = 'updating...';
				$task['query'] = $query;

				$wpdb->query($wpdb->prepare(
					"UPDATE $cluster_table SET status = 0 WHERE id = %d",
					$outdated_cluster->id
				));

			}

		}

		return $task;
	}

	/**
	 * @hook "karma_cache_{$dependency->target}_dependency_updated"
	 */
	public function dependency_updated($dependency) {
		global $wpdb, $karma_clusters_options;

		if ($karma_clusters_options->get_option('clusters_active')) {

			$cluster_table = $wpdb->prefix.$this->table_name;

			$wpdb->query($wpdb->prepare(
				"UPDATE $cluster_table SET status = GREATEST(status, %d) WHERE id = %d",
				$dependency->priority,
				$dependency->target_id
			));

		}

	}


	do_action( 'post_updated', $post_ID, $post_after, $post_before );
	add_action('post_updated' array($this, 'post_updated'), 10, 3);

	/**
	 * @hook 'post_updated'
	 */
	public function post_updated($post_id, $post_after, $post_before) {


	}



	/**
	 * @hook 'save_post'
	 */
	function save_post($post_id, $post, $update) {
		global $wpdb, $karma_clusters_options;

		if ($karma_clusters_options->get_option('clusters_active')) {

			$cluster_table = $wpdb->prefix.$this->table_name;

			$cluster_rows = $wpdb->get_results($wpdb->prepare(
				"SELECT * FROM $cluster_table WHERE post_id = %d",
				$post_id
			));

			$path = $this->get_path($post);

			foreach ($cluster_rows as $cluster_row) {

				if ($path !== $cluster_row->path) {

					$wpdb->query($wpdb->prepare(
						"UPDATE $cluster_table SET status = 100, path = %s WHERE id = %d",
						$path,
						$cluster_row->id
					));

					$this->delete_cache($cluster_row);

				} else {

					$wpdb->query($wpdb->prepare(
						"UPDATE $cluster_table SET status = 100 WHERE id = %d",
						$cluster_row->id
					));

				}

			}

		}

	}

	/**
	 * @hook 'before_delete_post'
	 *
	 * Must trigger after dependencies!
	 */
	public function delete_post($post_id) {
		global $wpdb, $karma_clusters_options;

		if ($karma_clusters_options->get_option('clusters_active')) {

			$table = $wpdb->prefix.$this->table_name;

			$post = get_post($post_id);
			$path = $this->get_path($post);

			$cluster_row = $wpdb->get_row($wpdb->prepare(
				"SELECT * FROM $table WHERE path = %s",
				$path
			));

			if ($cluster_row) {

				do_action('karma_delete_cluster', $cluster_row, $post_id, $cluster_row->post_type, $this);

				$this->delete_cache($cluster_row->path);

				$wpdb->query($wpdb->prepare(
					"DELETE FROM $table WHERE id = %d",
					$cluster_row->id
				));

			}

		}

	}

	/**
	 *
	 */
	public function delete_all_clusters() {
		global $wpdb;

		$cluster_table = $wpdb->prefix.$this->table_name;

		$wpdb->query("truncate $cluster_table");

		do_action('karma_dependency_delete_target', 'cluster');

		$this->rrmdir($this->cluster_path);

	}

	/**
	 *
	 */
	public function create_all_clusters() {
		global $wpdb;

		$post_types = get_post_types();
		$registered_post_types = array();

		foreach ($post_types as $post_type) {

			if (has_action('karma_clusters_update_'.$post_type)) {

				$registered_post_types[] = $post_type;

			}

		}

		// if ($this->post_types) {
		if ($registered_post_types) {

			// $sql = implode("', '", array_map('esc_sql', array_keys($this->post_types)));
			$sql = implode("', '", array_map('esc_sql', $registered_post_types));

			$posts = $wpdb->get_results(
				"SELECT ID, post_type, post_name, post_parent FROM $wpdb->posts WHERE post_type IN ('$sql')"
			);


			foreach ($posts as $post) {

				$path = $this->get_path($post);
				$request = "p={$post->ID}&post_type={$post->post_type}";
				$cluster_row = $this->create_cluster($post, $request, $path);

				do_action('karma_save_cluster', $cluster_row, $post, $this);

			}

		}

	}

	/**
	 * @ajax 'karma_update_clusters'
	 */
	public function ajax_update_clusters() {
		global $wpdb;

		$table = $wpdb->prefix.$this->table_name;

		$wpdb->query($wpdb->prepare(
			"UPDATE $table SET status = %d",
			1
		));

		$num_task = $wpdb->get_var("SELECT count(id) AS num FROM $table");

		$output['notice'] = "Updating $num_task clusters";

		echo json_encode($output);
		exit;

	}

	/**
	 * @ajax 'karma_create_clusters'
	 */
	public function ajax_create_clusters() {
		global $wpdb;

		$this->delete_all_clusters();
		$this->create_all_clusters();

		$cluster_table = $wpdb->prefix.$this->table_name;

		$num_task = $wpdb->get_var("SELECT count(id) AS num FROM $cluster_table WHERE status > 0");

		$output['notice'] = "Creating $num_task clusters";

		echo json_encode($output);
		exit;

	}

	/**
	 * @ajax 'karma_delete_clusters'
	 */
	public function ajax_delete_clusters() {

		$this->delete_all_clusters();

		$output['action'] = 'delete all';

		echo json_encode($output);
		exit;

	}

	/**
	 * @ajax 'karma_toggle_clusters'
	 */
	public function ajax_toggle_clusters() {
		global $wpdb, $karma_clusters_options;

		$output = array();

		if ($karma_clusters_options->get_option('clusters_active')) {

			$karma_clusters_options->update_option('clusters_active', '');

			$output['title'] = 'Clusters (disabled)';
			$output['label'] = 'Activate Clusters';
			$output['notice'] = "Deactivate Clusters. ";
			$output['action'] = 'deactivate clusters';

		} else {

			$karma_clusters_options->update_option('clusters_active', '1');

			// $table = $wpdb->prefix.$this->table_name;
			// $num_task = $wpdb->get_var("SELECT count(id) AS num FROM $table");

			$output['title'] = 'Clusters (enabled)';
			$output['label'] = 'Deactivate Clusters';
			$output['notice'] = "Activating Clusters ($num_task). ";
			$output['action'] = 'rebuild clusters';

		}

		echo json_encode($output);
		exit;
	}

	/**
	 * @callbak 'admin_bar_menu'
	 */
	public function add_toolbar_button( $wp_admin_bar ) {
		global $karma_clusters_options;

		if (current_user_can('manage_options')) {

			$clusters_active = $karma_clusters_options->get_option('clusters_active');

			$wp_admin_bar->add_node(array(
				'id'    => 'clusters-group',
				'title' => 'Clusters ('.($clusters_active ? 'enabled' : 'disabled').')'
			));

			$wp_admin_bar->add_node(array(
				'id'    => 'update-clusters',
				'parent' => 'clusters-group',
				'title' => 'Update Clusters',
				'href'  => '#',
				'meta'  => array(
					// 'onclick' => 'ajaxPost("'.admin_url('admin-ajax.php').'", {action: "karma_update_clusters"}, function(results) {KarmaTaskManager.update(results.notice);});event.preventDefault();'
					'onclick' => 'KarmaTaskManager&&KarmaTaskManager.addTask("karma_update_clusters",this);event.preventDefault()'
				)
			));

			$wp_admin_bar->add_node(array(
				'id'    => 'create-clusters',
				'parent' => 'clusters-group',
				'title' => 'Create Clusters',
				'href'  => '#',
				'meta'  => array(
					'onclick' => 'KarmaTaskManager&&KarmaTaskManager.addTask("karma_create_clusters",this);event.preventDefault()'
				)
			));

			$wp_admin_bar->add_node(array(
				'id'    => 'delete-clusters',
				'parent' => 'clusters-group',
				'title' => 'Delete Clusters',
				'href'  => '#',
				'meta'  => array(
					'onclick' => 'KarmaTaskManager&&KarmaTaskManager.addTask("karma_delete_clusters",this);event.preventDefault()'
				)
			));

			$wp_admin_bar->add_node(array(
				'id'    => 'toggle-clusters',
				'title' => $clusters_active ? 'Deactivate Clusters' : 'Activate Clusters',
				'parent' => 'clusters-group',
				'href'  => '#',
				'meta'  => array(
					'onclick' => 'KarmaTaskManager&&KarmaTaskManager.addTask("karma_toggle_clusters",this,function(results){this.innerHTML=results.label;this.parentNode.parentNode.parentNode.previousSibling.innerHTML=results.title});event.preventDefault()'
				)
			));

		}

	}



	/**
	 * @filter 'karma_task_notice'
	 */
	public function task_notice($tasks) {
		global $wpdb;

		$cluster_table = $wpdb->prefix.$this->table_name;

		$num_task = $wpdb->get_var("SELECT count(id) AS num FROM $cluster_table WHERE status > 0");

		if ($num_task) {

			$tasks[] = "Updating $num_task clusters. ";

		}

		return $tasks;
	}


	/**
	 * public API
	 */
	public function get_post_cluster($post) {

		return $this->get_cache($this->get_path($post));

	}

	/**
	 * public API
	 */
	public function get_cluster_url($post) {

		return $this->cluster_url.'/'.$this->get_path($post).'.json';

	}




}
