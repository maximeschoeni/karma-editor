<?php

/**
 *	Class Karma_Cache
 */
class Karma_Cache {

	var $version = '1';
	var $path = 'wp-content/caches';


	/**
	 *	Constructor
	 */
	public function __construct() {

		add_action('wp_ajax_karma_cache_delete', array($this, 'ajax_delete_cache'));

		add_action('parse_request', array($this, 'parse_request'));

		add_action('save_post', array($this, 'save_post'), 20, 3);
		add_action('karma_cache_save_post', array($this, 'save_post'), 10, 3);

		if (is_admin()) {


			add_action('before_delete_post', array($this, 'delete_post'), 99);
			add_action('admin_bar_menu', array($this, 'add_toolbar_button'), 999);

		}

		add_action('sublanguage_init', array($this, 'sublanguage_init'));
		// add_action('sublanguage_init', array($this, 'sublanguage_admin_init'));


		// add_action('karma_fields_parse_uri', array($this, 'get_post')); // deprecated!

		// Public API
		add_filter('karma_cache_parse_uri', array($this, 'parse_post'), 10, 2);
		add_filter('karma_cache_format_uri', array($this, 'format_uri'), 10, 2);
		add_filter('karma_cache_url', array($this, 'get_url'));

		// karma fields
		add_filter('karma_fields_id', array($this, 'karma_fields_get_id'));
		add_action('karma_fields_save', array($this, 'karma_fields_save'), 10, 4);



	}

	/**
	 * @hook 'parse_request'
	 */
	public function sublanguage_init() {

		require_once plugin_dir_path( __FILE__ ) . 'class-multilanguage.php';

	}

	/**
	 * get post value
	 */
	public function get_value($post, $filename) {

		$value = $this->get($post, $filename);

		if (!$value) {

			do_action('karma_cache_'.$post->post_type, $post, $this);
			do_action('karma_cache', $post, $this);

			$value = $this->get($post, $filename);

		}

		return $value;

	}

	/**
	 * @hook 'parse_request'
	 */
	public function parse_request($wp) {

		if (strpos($wp->request, $this->path) === 0) {

			$path = trim(substr($wp->request, strlen($this->path)), '/');
			$parts = explode('/', $path);
			$filename = array_pop($parts);
			$uri = implode('/', $parts);

			$post = $this->get_post($uri);

			if ($post) {

				do_action('karma_cache_'.$post->post_type, $post, $this);
				do_action('karma_cache', $post, $this);

				$value = $this->get($uri, $filename);

				if (isset($value)) {

					if (is_array($value) || is_object($value)) {

						$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

					}

					echo $value;
					exit;

				} else {

					header('HTTP/1.1 404 Not Found');
					die('karma cache error: value not registered');

				}

			} else {

				header('HTTP/1.1 404 Not Found');
				die('karma cache error: post not found');

			}

		}

	}

	/**
	 * get_path
	 */
	public function get_path($post) {

		return ABSPATH.$this->path.'/'.$this->get_uri($post);

	}


	/**
	 * get_uri
	 */
	public function get_uri($post) {

		if (!is_object($post)) {

			$post = get_post($post);

		}

		if ($post->post_type === 'post') {

			$path = $post->post_name;

			if (!$path) {

				$path = $post->ID;

			}

		} else {

			$path = get_page_uri($post);

			if (!$path) {

				$path = $post->ID;

			}

			if ($post->post_type !== 'page') {

				$post_type_object = get_post_type_object($post->post_type);

				if (isset($post_type_object->rewrite['slug'])) {

					$path = $post_type_object->rewrite['slug'].'/'.$path;

				} else {

					$path = $post->post_type.'/'.$path;

				}

			}

		}

		$path = apply_filters('karma_cache_get_uri', $path, $post);

		$old_uri = get_post_meta($post->ID, 'karma_cache_uri', true);

		if ($path !== $old_uri) {

			if ($old_uri) {

				$file = ABSPATH.$this->path.'/'.$old_uri;

				$this->rrmdir($file);

			}

			update_post_meta($post->ID, 'karma_cache_uri', $path);

		}

		return $path;
	}


	/**
	 * get_post
	 */
	public function find_post_type($lug) {

		$slug = apply_filters('karma_cache_find_post_type', $lug);

		$post_type_obj = get_post_type_object($lug);

		if ($post_type_obj && $post_type_obj->publicly_queryable) {

			return $post_type_obj->name;

		} else {

			$post_type_objects = get_post_types(array(
				'publicly_queryable' => true
			), 'objects');

			foreach ($post_type_objects as $post_type_object) {

				if (isset($post_type_object->rewrite['slug']) && $post_type_object->rewrite['slug'] === $lug) {

					return $post_type_object->name;

				}

			}

		}

	}

	/**
	 * find_post
	 */
	public function find_post($ancestors) {
		global $wpdb;

		$post_name = array_pop($ancestors);

		// to do:
		// -> handle date, category, etc.

		if ($post_name) {

			$post = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->posts WHERE post_type = 'post' AND post_name = %s", $post_name));

			return apply_filters('karma_cache_find_post', $post, $post_name);

		}

	}

	/**
	 * find_page
	 */
	public function find_page($ancestors, $post_type = 'page') {
		global $wpdb;

		$post_name = array_pop($ancestors);
		$joins = array();

		$parent = 'p';

		foreach (array_reverse($ancestors) as $i => $ancestor) {

			$joins[] = $wpdb->prepare("INNER JOIN $wpdb->posts as p$i ON (p$i.ID = $parent.post_parent AND p$i.post_name = %s)", $ancestor);

			$parent = "p$i";

		}

		$join_sql = implode(' ', $joins);

		$post = $wpdb->get_row($wpdb->prepare("SELECT p.* FROM $wpdb->posts AS p $join_sql WHERE p.post_type = %s AND p.post_name = %s", $post_type, $post_name));

		return apply_filters('karma_cache_find_page', $post, $ancestors, $post_type);

	}

	/**
	 * get_post
	 */
	public function get_post($uri) {
		global $wpdb;

		$post = apply_filters('karma_cache_get_post', null, $uri);

		if ($post) {

			return $post;

		}

		$parts = explode('/', $uri);

		if ($parts) {

			$post = $this->find_post($parts);

			if (!$post) {

				$post = $this->find_page($parts);

			}

			if (!$post) {

				$post_type_slug = array_shift($parts);

				$post_type = $this->find_post_type($post_type_slug);

				if ($post_type) {

					$post = $this->find_page($parts, $post_type);

				}

			}

			if ($post) {

				return get_post($post);

			}

		}

	}

	/**
	 * get
	 */
	public function get($post_uri, $key, $type = null) {

		if (is_object($post_uri)) {

			$post_uri = $this->get_uri($post_uri);

		}

		if (!$post_uri || !is_string($post_uri)) {

			trigger_error('Karma Cache Error: undefined or wrong type uri');

		}

		$file = ABSPATH.$this->path.'/'.$post_uri.'/'.$key;

		if (file_exists($file)) {

			$value = file_get_contents($file);

			if (pathinfo($key, PATHINFO_EXTENSION) === 'json') {

				$value = json_decode($value);

			}

		} else {

			// if (pathinfo($key, PATHINFO_EXTENSION) === 'json') {
			//
			// 	$value = array();
			//
			// } else {
			//
			// 	$value = '';
			//
			// }

			$value = '';

		}

		return $value;

	}

	/**
	 * delete
	 */
	public function delete($post_uri, $key) {

		if (is_object($post_uri)) {

			$post_uri = $this->get_uri($post_uri);

		}

		if (!$post_uri || !is_string($post_uri)) {

			trigger_error('Karma Cache Error: undefined or wrong type uri');

		}

		$file = ABSPATH.$this->path.'/'.$post_uri.'/'.$key;

		if (file_exists($file)) {

			unlink($file);

		}

	}

	/**
	 * update
	 */
	public function update($post, $key, $value, $type = null) {

		if (is_object($post)) {

			$post_uri = $this->get_uri($post);

		} else {

			$post_uri = $post;

		}

		if (!$post_uri || !is_string($post_uri)) {

			trigger_error('Karma Cache Error: undefined post uri');

		}

		if (pathinfo($key, PATHINFO_EXTENSION) === 'json') {

			$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

		}

		$file = ABSPATH.$this->path.'/'.$post_uri.'/'.$key;

		if (!file_exists(dirname($file))) {

			mkdir(dirname($file), 0777, true);

		}

		file_put_contents($file, $value);

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
	 * @hook "save_post"
	 */
	public function save_post($post_id, $post, $update = null) {

		do_action('karma_cache_'.$post->post_type, $post, $this);
		do_action('karma_cache', $post, $this);

	}

	/**
	 * @hook 'before_delete_post'
	 */
	public function delete_post($post_id) {

		$post = get_post($post_id);

		$file = ABSPATH.$this->path.'/'.$this->get_uri($post);

		$this->rrmdir($file);

	}

	/**
	 * @ajax 'karma_cache_delete'
	 */
	public function ajax_delete_cache() {

		$this->rrmdir(ABSPATH.$this->path);

		echo json_encode('ok');
		exit;

	}

	/**
	 * @callbak 'admin_bar_menu'
	 */
	public function add_toolbar_button( $wp_admin_bar ) {

		if (current_user_can('manage_options')) {

			$wp_admin_bar->add_node(array(
				'id'    => 'delete-clusters',
				// 'parent' => 'clusters-group',
				'title' => 'Delete Cache',
				'href'  => '#',
				'meta'  => array(
					'onclick' => 'fetch("'.admin_url('admin-ajax.php').'", {method: "post", headers: {"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"}, body: "action=karma_cache_delete", credentials: "same-origin"}).then(function(response) {console.log(response.json())});'
				)
			));

		}

	}

	/**
	 * Public API
	 * @filter 'karma_cache_parse_uri'
	 */
	public function parse_uri($post, $uri) {

		return $this->get_post($uri);

	}

	/**
	 * Public API
	 * @filter 'karma_cache_format_uri'
	 */
	public function format_uri($uri, $post) {

		return $this->get_uri($post);

	}

	/**
	 * Public API
	 * @filter 'karma_cache_url'
	 */
	public function get_url($dir) {

		return home_url($this->path);

	}

	/**
	 * Karma Fields
	 * @filter 'karma_field_id'
	 */
	public function karma_fields_get_id($uri) {

		$post = $this->get_post($uri);

		if ($post) {

			 $uri = $post->ID;

		}

		return $uri;
	}

	/**
	 * Karma Fields
	 * @filter 'karma_fields_save'
	 */
	public function karma_fields_save($value, $uri, $key, $extension) {

		$this->update($uri, $key.$extension, $value);

	}














	public static function test() {
		global $karma_values;


		// Thumb Image
		add_action('karma_value_register', 'post', 'image', function($post_id, $key, $post_type, $karma_values) {
			$thumb_id = get_post_thumbnail_id();
			if ($thumb_id) {
				$image_object = $karma->get_image_source($thumb_id);
			} else {
				$image_object = array();
			}
			return $image_object;
		});


		$args = array(
			'post_type' => 'post',
			'key' => 'image',
			// 'dependencies' => array(
			// 	'meta_key' => array('_thumbnail_id')
			// ),
			'update' => function($post_id, $key, $post_type, $karma_values) {
				$thumb_id = get_post_thumbnail_id();
				// $dependencies->add_meta_key('_thumbnail_id');
				if ($thumb_id) {
					$image_object = $karma->get_image_source($thumb_id);
					// $dependencies->add_post($thumb_id);
				} else {
					$image_object = array();
				}

				return $image_object;
			}
		);
		$karma_values->register_value($args);

		do_action('karma_value_register', 'post', function($post_id, $karma_cache) {
			$thumb_id = get_post_thumbnail_id($post_id);
			$image = $karma_cache->get_image_source($thumb_id);
			$karma_cache->update($post_id, 'image', $image);
		});

		add_action('karma_cache_post', function($post, $cache) {
			global $karma;

			$thumb_id = get_post_thumbnail_id($post->ID);
			$image = $karma->get_image_source($thumb_id);

			$cache->update($post, 'image', $image, '.json');
		});

		add_action('karma_cache_post', function($post, $cache) {
			$post_title = get_the_title($post);
			$cache->update($post, 'title', $post_title);
		});






		// NEXT / PREV post
		// $args = array(
		// 	'post_type' => 'post',
		// 	'key' => 'next',
		// 	'dependencies' => array(
		// 		'post' => array('post')
		// 	),
		// 	'update' => function($post_id, $key, $post_type, $karma_values) {
		// 		global $wpdb;
		// 		$next_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
		// 			WHERE post_type = %s AND post_status = 'publish' AND menu_order > %d
		// 			LIMIT 1
		// 			ORDER BY menu_order, ASC",
		// 			$post_type,
		// 			$karma_values->get_post_field($post_id, 'menu_order')
		// 		));
		//
		// 		$next = $karma_values->get_post($next_id, $post_type);
		// 		if ($next) {
		// 			$karma_values->add_dependency($post_type, $next_id);
		// 			return 'Next: <a href="'.get_permalink($next).'">'.$next->post_title.'</a>';
		// 		} else {
		// 			$karma_values->add_dependency($post_type);
		// 			return '';
		// 		}
		// 	}
		// );
		//
		//
		// $args = array(
		// 	'post_type' => 'post',
		// 	'key' => 'next',
		// 	'dependencies' => array(
		// 		'posts' => array(
		// 			'next' => function($post) {
		// 				global $wpdb;
		// 				$next_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
		// 					WHERE post_type = %s AND post_status = 'publish' AND menu_order > %d
		// 					LIMIT 1
		// 					ORDER BY menu_order, ASC",
		// 					'post',
		// 					$post->menu_order
		// 				));
		// 				return get_post($next_id);
		// 			}
		// 		)
		// 	),
		// 	'update' => function($post_id, $dependencies) {
		//
		// 		$next = $dependencies->next;
		// 		if ($next) {
		// 			return 'Next: <a href="'.get_permalink($next).'">'.$next->post_title.'</a>';
		// 		} else {
		// 			return '';
		// 		}
		// 	}
		// );
		// $karma_values->register_value($args);



		add_action('karma_value_post', function($post, $karma_cache) {
			global $wpdb;

			$post_uri = $karma_cache->get_uri($post);

			$next_uri = $karma_cache->get($post, 'next');
			$prev_uri = $karma_cache->get($post, 'prev');

			if ($next_uri) {

				$karma_cache->remove($next_uri, 'prev');

			}

			if ($prev_uri) {

				$karma_cache->remove($prev_uri, 'next');

			}

			$karma_cache->remove($post, 'prev');
			$karma_cache->remove($post, 'next');

			$next_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
				WHERE post_type = %s AND post_status = 'publish' AND menu_order > %d
				LIMIT 1
				ORDER BY menu_order, ASC",
				'post',
				$post->menu_order
			));

			$prev_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
				WHERE post_type = %s AND post_parent = %d AND post_status = %s AND menu_order < %d
				LIMIT 1
				ORDER BY menu_order, DESC",
				$post->post_type,
				$post->post_parent,
				$post->post_status,
				$post->menu_order
			));

			if ($next_id) {

				$next = get_post($next_id);
				$next_uri = $karma_cache->get_uri($next);

				$karma_cache->update($next, 'prev', $post_uri);
				$karma_cache->update($post, 'next', $next_uri);

			} else {

				$karma_cache->update($post, 'next', '');

			}

			if ($prev_id) {

				$prev = get_post($next_id);
				$prev_uri = $karma_cache->get_uri($prev);

				$karma_cache->update($prev, 'next', $post_uri);
				$karma_cache->update($post, 'prev', $prev_uri);

			} else {

				$karma_cache->update($post, 'prev', '');

			}

			// $karma_cache->update_cache($prev_id, 'next_arrow', $next_arrow);
			// $karma_cache->update_cache($next_id, 'prev_arrow', $prev_arrow);

		});

		// do_action('karma_value_register', 'post', null, function($key, $action, $karma_cache) {
		//
		// 	$next_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
		// 		WHERE post_type = %s AND post_status = 'publish' AND menu_order > %d
		// 		LIMIT 1
		// 		ORDER BY menu_order, ASC",
		// 		'post',
		// 		$post->menu_order
		// 	));
		//
		// 	$prev_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
		// 		WHERE post_type = %s AND post_status = 'publish' AND menu_order < %d
		// 		LIMIT 1
		// 		ORDER BY menu_order, DESC",
		// 		'post',
		// 		$post->menu_order
		// 	));
		//
		//
		// })








		// post meta key
		$args = array(
			'post_type' => 'post',
			'key' => 'start_date',
			'update' => function($post_id, $key, $post_type, $karma_values) {
				return get_post_meta($post_id, $key, true);
			}
		);
		$karma_values->register_value($args);


		add_action('karma_value_register', 'post', 'duration', function($post_id, $key, $post_type, $karma_values) {
			$start_date = get_post_meta($post_id, 'start_date', true);
			$end_date = get_post_meta($post_id, 'end_date', true);
			return strtotime($end_date) - strtotime($start_date);
		});






		// artist -> exhibition

		add_action('karma_cache_exhibition', function($post, $cache) {
			$artist_uris = $cache->get($post, 'artist', 'array');
			foreach ($artist_uris as $artist_uri) {
				$cache->remove($artist_uri, 'exhibition');
			}
			$artist_ids = get_post_meta($post->ID, 'artist');
			$artist_uris = array_map(array($cache, 'get_uri'), $artist_ids);
			$cache->update($post, 'artist', $artist_uris);
		});
		add_action('karma_cache_artist', function($post, $cache) {
			global $wpdb;
			$artist_uri = $cache->get_uri($post);
			$exhibition_ids = $wpdb->get_col($wpdb->update(
				"SELECT post_id FROM $wpdb->postmeta WHERE meta_key = %s AND meta_value = %d",
				'artist',
				$post->ID
			));
			$exhibition_uris = array_map(array($cache, 'get_uri'), $exhibition_ids);
			$cache->update($artist_uri, 'exhibition', $exhibition_uris, 'array');
		});




		// do_action('karma_value_register', array(
		// 	'post_type' => 'post',
		// 	'key' => 'post_title',
		// 	'path' => function($post_id, $post_type, $path) {
		// 		return apply_filters('sublanguage_translate_path', $path, $post_type, $post_id);
		// 	}
		//
		//
		//
		//
		// ));


	}




}

global $karma_cache;
$karma_cache = new Karma_Cache;
