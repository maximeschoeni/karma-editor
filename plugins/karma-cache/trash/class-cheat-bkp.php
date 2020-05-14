<?php

// require_once KARMA_CHEAT_PATH . '/classes/options.php';

/**
 *	Class Karma_Values
 */
class Karma_Cheat {

	var $version = '1';
	// var $value_table = 'karma_cheat';
	// var $dependency_table = 'karma_cheat_dependencies';
	var $path = 'wp-content/cheats';


	/**
	 *	Constructor
	 */
	public function __construct() {

// echo '<pre>';
// 		print_r($_SERVER);
// 		die();

		add_action('wp_ajax_karma_cache_delete', array($this, 'ajax_delete_cache'));

		add_action('parse_request', array($this, 'parse_request'));

		if (is_admin()) {
		//
		//
		// 	// require_once KARMA_CLUSTER_PATH . '/classes/dependencies.php';
		// 	// require_once KARMA_CLUSTER_PATH . '/classes/task-manager.php';
		//
		//
		//
		// 	// add_action('wp_ajax_karma_update_clusters', array($this, 'ajax_update_clusters'));
		// 	// add_action('wp_ajax_karma_create_clusters', array($this, 'ajax_create_clusters'));
		// 	// add_action('wp_ajax_karma_delete_clusters', array($this, 'ajax_delete_clusters'));
		// 	// add_action('wp_ajax_karma_toggle_clusters', array($this, 'ajax_toggle_clusters'));
		// 	//
		// 	// add_action('wp_ajax_get_cluster', array($this, 'ajax_get_cluster'));
		// 	// add_action('wp_ajax_nopriv_get_cluster', array($this, 'ajax_get_cluster'));
		// 	//
		// 	// add_filter('karma_task', array($this, 'add_task'));
		// 	// add_action('karma_cache_cluster_dependency_updated', array($this, 'dependency_updated'));
		// 	//
			add_action('save_post', array($this, 'save_post'), 10, 3);
			add_action('before_delete_post', array($this, 'delete_post'), 99);
		// 	//
		// 	// add_action('init', array($this, 'create_tables'));
		// 	// add_action('karma_task_notice', array($this, 'task_notice'));
			add_action('admin_bar_menu', array($this, 'add_toolbar_button'), 999);
		// 	//
		// 	// add_action('registered_post_type', array($this, 'registered_post_type'), 10, 2);

		}


	}



	public function parse_request($wp) {

		// $content_dir = basename(ABSPATH);


		// WP_CONTENT_DIR.


				// print_r(ABSPATH);

	// var_dump(strpos($wp->request, $this->path));

		if (strpos($wp->request, $this->path) === 0) {

			$path = trim(substr($wp->request, strlen($this->path)), '/');
			$parts = explode('/', $path);
			$filename = array_pop($parts);
			$uri = implode('/', $parts);

			$post = $this->get_post($uri);

			if ($post) {

				do_action('karma_cheat_'.$post->post_type, $post, $this);

				$file_parts = explode('.',$filename);
				$key = array_shift($file_parts);

				$value = $this->get($uri, $key);

				if (isset($value)) {

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






			// 	echo '<pre>';
			// var_dump($post);
			//
			// die();
		}





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

		do_action('karma_value_register', 'post', function($post_id, $karma_cheat) {
			$thumb_id = get_post_thumbnail_id($post_id);
			$image = $karma_cheat->get_image_source($thumb_id);
			$karma_cheat->update_cheat($post_id, 'image', $image);
		});

		add_action('karma_cheat_post', function($post, $cheat) {
			global $karma;

			$thumb_id = get_post_thumbnail_id($post->ID);
			$image = $karma->get_image_source($thumb_id);

			$cheat->update($post, 'image', $image, '.json');
		});

		add_action('karma_cheat_post', function($post, $cheat) {
			$post_title = get_the_title($post);
			$cheat->update($post, 'title', $post_title);
		});






		// NEXT / PREV post
		$args = array(
			'post_type' => 'post',
			'key' => 'next',
			'dependencies' => array(
				'post' => array('post')
			),
			'update' => function($post_id, $key, $post_type, $karma_values) {
				global $wpdb;
				$next_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
					WHERE post_type = %s AND post_status = 'publish' AND menu_order > %d
					LIMIT 1
					ORDER BY menu_order, ASC",
					$post_type,
					$karma_values->get_post_field($post_id, 'menu_order')
				));

				$next = $karma_values->get_post($next_id, $post_type);
				if ($next) {
					$karma_values->add_dependency($post_type, $next_id);
					return 'Next: <a href="'.get_permalink($next).'">'.$next->post_title.'</a>';
				} else {
					$karma_values->add_dependency($post_type);
					return '';
				}
			}
		);


		$args = array(
			'post_type' => 'post',
			'key' => 'next',
			'dependencies' => array(
				'posts' => array(
					'next' => function($post) {
						global $wpdb;
						$next_id = $wpdb->get_var($wpdb->get_row("SELECT id FROM $wpdb->posts
							WHERE post_type = %s AND post_status = 'publish' AND menu_order > %d
							LIMIT 1
							ORDER BY menu_order, ASC",
							'post',
							$post->menu_order
						));
						return get_post($next_id);
					}
				)
			),
			'update' => function($post_id, $dependencies) {

				$next = $dependencies->next;
				if ($next) {
					return 'Next: <a href="'.get_permalink($next).'">'.$next->post_title.'</a>';
				} else {
					return '';
				}
			}
		);
		$karma_values->register_value($args);



		do_action('karma_value_register', 'post', function($post, $karma_cheat) {

			global $wpdb;


			$post_uri = $karma_cheat->get_uri($post);

			$next_uri = $karma_cheat->get_cheat($post, 'next');
			$prev_uri = $karma_cheat->get_cheat($post, 'prev');

			if ($next_uri) {

				$karma_cheat->remove_cheat($next_uri, 'prev');

			}

			if ($prev_uri) {

				$karma_cheat->remove_cheat($prev_uri, 'next');

			}

			$karma_cheat->remove_cheat($post, 'prev');
			$karma_cheat->remove_cheat($post, 'next');

			// $karma_cheat->remove_cheat('prev_arrow', $next_id);
			// $karma_cheat->remove_cheat('next_arrow', $prev_id);



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
				$next_uri = $karma_cheat->get_uri($next);

				$karma_cheat->update_cheat($next, 'prev', $post_uri);
				$karma_cheat->update_cheat($post, 'next', $next_uri);

			}

			if ($prev_id) {

				$karma_cheat->update_cheat($prev_id, 'next', $post_uri);
				$karma_cheat->update_cheat($post_id, 'prev', $prev_id);

			}

			// $karma_cheat->update_cheat($prev_id, 'next_arrow', $next_arrow);
			// $karma_cheat->update_cheat($next_id, 'prev_arrow', $prev_arrow);

		});

		// do_action('karma_value_register', 'post', null, function($key, $action, $karma_cheat) {
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


		add_action('karma_value_register', 'post', '_fr_post_title', function($post_id, $key, $post_type, $karma_values) {
			$fr_title = get_post_meta($post_id, $key, true);
			if ($fr_title) {
				return $fr_title;
			} else {
				return $karma_values->get_post_field($post_type, $post_id, 'post_title');
			}
		});


		add_action('karma_value_register', 'post', 'post_title', function($post_id, $value, $karma_values) {

			// $value->path = apply_filters('sublanguage_translate_path', $value->path, $value->post_type, $value->post_id);

			$fr_title = get_post_meta($post_id, $key, true);

			if ($fr_title) {

				return $fr_title;

			} else {

				return $karma_values->get_post_field($post_type, $post_id, 'post_title');

			}

		});

		add_filter('karma_value_update_post__fr_post_title', function($key, $post_id, $post_type, $karma_cheat) {

			$fr_title = get_post_meta($post_id, $key, true);

			if ($fr_title) {

				return $fr_title;

			} else {

				return $karma_cheat->get_post_field($post_type, $post_id, 'post_title');

			}
		});

		add_filter('karma_value_update_file_post__fr_post_title', function($path, $post_id, $post_type, $key, $ext) {
			return apply_filters('sublanguage_translate_path', $path, $post_type, $post_id) . '/post_title' . $ext;
		});

		do_action('karma_value_register', 'post', function($post, $karma_cheat) {
			$post_title = get_the_title($post);
			$karma_cheat->update_cheat($post, 'title', $post_title);
		});




		// artist -> exhibition

		do_action('karma_value_register', 'exhibition', function($post, $cheat) {
			$artist_uris = json_decode($cheat->get($post, 'artists'));
			foreach ($artist_uris as $artist_uri) {
				$cheat->remove($artist_uri, 'exhibitions');
			}
			$artists = get_post_meta($post->ID, 'artist');
			$cheat->update($post, 'artists', json_encode($artist_uris));
		});
		do_action('karma_value_register', 'artist', function($post, $cheat) {
			$artist_uri = $cheat->get_uri($post);
			$exhibition_ids = $wpdb->get_col($wpdb->update(
				"SELECT post_id FROM $wpdb->postmeta WHERE meta_key = %s AND meta_value = %d",
				'artists',
				$post_uri
			));
			$exhibition_uris = array_map(array($cheat, 'get_uri'), $exhibition_ids);
			$cheat->update($artist_uri, 'exhibitions', $exhibition_uris);
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





	/**
	 * @hook 'init'
	 */
	// function create_dependency_tables() {
	//
	// 	if (is_admin()) {
	//
	// 		require_once KARMA_CLUSTER_PATH . '/classes/table.php';
	//
	// 		// Karma_Table::create($this->table_name, "
	// 		// 	id bigint(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	// 		// 	request varchar(255) NOT NULL,
	// 		// 	path varchar(255) NOT NULL,
	// 		// 	post_type varchar(255) NOT NULL,
	// 		// 	status smallint(1) NOT NULL
	// 		// ", '002');
	//
	// 		// Karma_Table::create($this->table_name, "
	// 		// 	id bigint(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	// 		// 	post_type varchar(255) NOT NULL,
	// 		// 	post_id bigint(11) NOT NULL,
	// 		// 	name varchar(255) NOT NULL,
	// 		// 	path varchar(255) NOT NULL,
	// 		// 	ext varchar(255) NOT NULL,
	// 		// 	status smallint(1) NOT NULL
	// 		// ", '001');
	//
	//
	//
	// 	}
	//
	// }

	/**
	 * @hook 'karma_value_register'
	 */
	// public function register_value($key, $post_type, $callback, $type = 'text/plain', $extension = '.txt') {
	//
	// 	$this->values[$post_type][] = array(
	// 		'key' => $key,
	// 		'callback' => $callback,
	// 		'type' => $type,
	// 		'extension' => $extension
	// 	);
	//
	//
	// 	// if (isset($args['post_type'], $args['key'], $args['callback'])) {
	// 	//
	// 	// 	$value = array(
	// 	// 		'key' => $key,
	// 	// 		'callback' => $callback;
	// 	// 	);
	// 	//
	// 	// 	$value['extension'] = isset($value['extension'])
	// 	//
	// 	//
	// 	// 	$this->values[$args['post_type']][] = $value;
	// 	//
	// 	//
	// 	//
	// 	//
	// 	// }
	//
	//
	//
	//
	//
	// 	// $this->post_types[$post_type] = $callback;
	//
	// 	// add_action('karma_clusters_update_'.$post_type, $callback, 10, 5);
	//
	// }
	//
	//
	// /**
	//  * register cluster for post type
	//  */
	// public function register($post_type, $callback) {
	//
	// 	// $this->post_types[$post_type] = $callback;
	//
	// 	add_action('karma_clusters_update_'.$post_type, $callback, 10, 5);
	//
	// }

	/**
	 * @hook 'registered_post_type'
	 */
	// public function registered_post_type($post_type, $post_type_object) {
	//
	// 	if (isset($post_type_object->clusters)) {
	//
	// 		$this->register($post_type, $post_type_object->clusters);
	//
	// 	}
	//
	// }


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
	public function get_uri($post) {

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

		return apply_filters('karma_cheat_path', $path, $post);
	}

	/**
	 * get_post
	 */
	public function get_post($uri) {
		global $wpdb;

		// $uri = trim($uri, '/');

		$parts = explode('/', $uri);

		if (count($parts) > 1) {

			$post_type = array_shift($parts);
			$post_name = array_pop($parts);

			$post_type_obj = get_post_type_object($post_type);

			if ($post_type_obj && $post_type_obj->publicly_queryable) {

				$post = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->posts WHERE post_name = %s", $post_name));

				return get_post($post);

			}

		}





		// $post_type_objs = get_post_types(array(
		// 	'publicly_queryable' => true
		// ));
		//
		// $post_type;
		//
		// foreach ($post_type_objs as $post_type_obj) {
		//
		// 	$post_type_slug = isset($post_type_obj->rewrite['slug']) ? $post_type_obj->rewrite['slug'] : $post_type_obj->name;
		//
		// 	if (isset($parts[0]) && $post_type_slug === $parts[0]) {
		//
		// 		$post_type = $post_type_obj
		//
		// 	} else {
		//
		// 		$path = $post->post_type.'/'.$path;
		//
		// 	}
		//
		// }


	}

	/**
	 * get
	 */
	public function get($post_uri, $key) {

		if (is_object($post_uri)) {

			$post_uri = $this->get_uri($post_uri);

		}

		foreach (glob($this->path.'/'.$post_uri.'/'.$key.'.*') as $filename) {

			$mime_content_type = mime_content_type($filename);

			$content = file_get_contents($filename);

			if ($mime_content_type === 'application/json') {

				return json_decode($content);

			} else {

				return $content;

			}

		}

	}

	/**
	 * delete
	 */
	public function delete($post_uri, $key) {

		if (is_object($post_uri)) {

			$post_uri = $this->get_uri($post_uri);

		}

		foreach (glob($this->path.'/'.$post_uri.'/'.$key.'.*') as $filename) {

			if (is_file($filename)) {

				unlink($filename);

			}

		}

	}

	/**
	 * update
	 */
	public function update($post_uri, $key, $value) {

		if (is_object($post_uri)) {

			$post_uri = $this->get_uri($post_uri);

		}

		$this->delete($post_uri, $key);

		if (is_object($value) || is_array($value)) {

			$extension = 'json';
			$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

		} else {

			$extension = 'txt';

		}

		$file = $this->path . '/' . $post_uri . '/' . $key . '.' . $extension;

		if (!file_exists(dirname($file))) {

			mkdir(dirname($file), 0777, true);

		}

		file_put_contents($file, $value);

	}



	/**
	 * create_cluster
	 */
	// public function create_cheat($key, $post, $datatype = 'text/plain', $extension = '.txt', $private = 0) {
	//
	// 	$item = new stdClass();
	// 	$item->key = $key,
	// 	$item->post_id = $post->ID;
	// 	$item->path = $this->get_path($post);
	// 	$item->datatype = $datatype;
	// 	$item->extension = $extension;
	// 	$item->status = 100;
	//
	// 	return $item;
	// }
	//
	// /**
	//  * create_cluster
	//  */
	// public function add_cheat($item) {
	// 	global $wpdb;
	//
	// 	$table = $wpdb->prefix.$this->cheat_table;
	//
	// 	$wpdb->insert($table, array(
	// 		'path' => $item->path,
	// 		'key' => $item->key,
	// 		'post_id' => $item->post_id,
	// 		'datatype' => $item->datatype,
	// 		'extension' => $item->datatype,
	// 		'status' => $item->status
	// 	), array(
	// 		'%s',
	// 		'%s',
	// 		'%d',
	// 		'%s',
	// 		'%s',
	// 		'%d'
	// 	));
	//
	// 	$item->id = $wpdb->insert_id;
	//
	// }



	/**
	 * update_cheat
	 */
	// public function update_cheat($item) {
	// 	global $wpdb;
	//
	// 	$post = get_post($item->post_id);
	//
	// 	$path = $this->get_path($post);
	//
	// 	if ($path !== $item->path) {
	//
	// 		$this->delete_file($path, $item->key, $extension);
	//
	// 	}
	//
	// 	$this->dependencies = array();
	//
	// 	if ($post && has_filter('karma_cheat_update_'.$post->post_type.'_'.$item->key)) {
	//
	// 		$this->add_update_filters();
	//
	// 		$value = apply_filters('karma_cheat_update_'.$post->post_type.'_'.$item->key, '', $item->key, $post->ID, $post->post_type, $this);
	//
	// 		$this->remove_update_filters();
	//
	// 	}
	//
	// 	$this->update_dependencies($item->id);
	//
	// 	if ($item->type === 'application/json') {
	//
	// 		$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	//
	// 		$extension = '.json';
	//
	// 	} else if ($item->type === 'text/html') {
	//
	// 		$extension = '.html';
	//
	// 	} else {
	//
	// 		$extension = '.txt';
	//
	// 	}
	//
	// 	$extension = apply_filters('karma_cheat_extension', $extension, $item, $post, $this);
	//
	// 	$this->update_file($path, $item->key, $extension, $value);
	//
	// }

	/**
	 * add filters before updating value
	 */
	// public function add_update_filters() {
	//
	// 	add_filter('get_post_metadata', array($this, 'get_post_metadata'), 10, 4);
	// 	add_filter('get_term_metadata', array($this, 'get_term_metadata'), 10, 4);
	//
	// 	add_filter('the_posts', array($this, 'the_posts'), 10, 2);
	// 	add_filter('get_terms', array($this, 'get_terms'), 10, 4);
	//
	// 	add_action('karma_value_post_dependency', array($this, 'add_post_dependency'));
	// 	add_action('karma_value_post_type_dependency', array($this, 'add_post_type_dependency'));
	// 	add_action('karma_value_taxonomy_dependency', array($this, 'add_taxonomx_dependency'));
	//
	// }
	//
	// /**
	//  * remove filters after updating value
	//  */
	// public function remove_update_filters() {
	//
	// 	remove_filter('get_post_metadata', array($this, 'get_post_metadata'), 10, 4);
	// 	remove_filter('get_term_metadata', array($this, 'get_term_metadata'), 10, 4);
	//
	// 	remove_filter('the_posts', array($this, 'the_posts'), 10, 2);
	// 	remove_filter('get_terms', array($this, 'get_terms'), 10, 4);
	//
	// 	remove_action('karma_value_post_dependency', array($this, 'add_post_dependency'));
	// 	remove_action('karma_value_post_type_dependency', array($this, 'add_post_type_dependency'));
	// 	remove_action('karma_value_taxonomy_dependency', array($this, 'add_taxonomx_dependency'));
	//
	// }

	/**
	 * @filter 'get_post_metadata'
	 */
	// public function get_post_metadata($null, $object_id, $meta_key, $single) {
	//
	// 	// $this->dependencies['post_meta'][] = array(
	// 	// 	'post_id' => $object_id,
	// 	// 	'key' => $meta_key
	// 	// );
	//
	// 	$this->dependencies[] = array(
	// 		'object' => 'postmeta',
	// 		'object_id' => $object_id,
	// 		'object_key' => $meta_key
	// 	);
	//
	// 	return $null;
	//
	// }
	//
	// /**
	//  * @filter 'the_posts'
	//  */
	// public function the_posts($posts, $wp_query) {
	//
	// 	foreach ($posts as $post) {
	//
	// 		// $this->dependencies['posts'][] = $post->ID;
	//
	// 		$this->dependencies[] = array(
	// 			'object' => 'post',
	// 			'object_id' => $post->ID,
	// 			'object_key' => ''
	// 		);
	//
	// 	}
	//
	// 	return $posts;
	//
	// }
	//
	// /**
	//  * @hook 'karma_cheat_post_dependency'
	//  */
	// public function add_post_dependency($post_id) {
	//
	// 	// $this->dependencies['posts'][] = $post_id;
	//
	// 	$this->dependencies[] = array(
	// 		'object' => 'post',
	// 		'object_id' => $post_id,
	// 		'object_key' => ''
	// 	);
	//
	// }
	//
	// /**
	//  * @hook 'karma_cheat_post_type_dependency'
	//  */
	// public function add_post_type_dependency($post_type) {
	//
	// 	// $this->dependencies['post_type'][] = $post_type;
	//
	// 	$this->dependencies[] = array(
	// 		'object' => 'posttype',
	// 		'object_id' => 0,
	// 		'object_key' => $post_type
	// 	);
	//
	// }
	//
	// /**
	//  * @hook 'karma_cheat_taxonomy_dependency'
	//  */
	// public function add_taxonomy_dependency($post_type) {
	//
	// 	// $this->dependencies['taxonomy'][] = $post_type;
	//
	// 	$this->dependencies[] = array(
	// 		'object' => 'taxonomy',
	// 		'object_id' => 0,
	// 		'object_key' => $post_type
	// 	);
	//
	// }
	//
	// /**
	//  * @filter 'get_terms'
	//  */
	// public function get_terms($terms, $taxonomy, $query_vars, $term_query) {
	//
	// 	foreach ($terms as $term) {
	//
	// 		$this->dependencies[] = array(
	// 			'object' => 'term',
	// 			'object_id' => $term->term_id,
	// 			'object_key' => ''
	// 		);
	//
	// 	}
	//
	// 	return $terms;
	// }
	//
	// /**
	//  * @filter 'get_term_metadata'
	//  */
	// public function get_term_metadata($null, $object_id, $meta_key, $single) {
	//
	// 	// $this->dependencies['term_meta'][] = array(
	// 	// 	'term_id' => $object_id,
	// 	// 	'key' => $meta_key
	// 	// );
	//
	// 	$this->dependencies[] = array(
	// 		'object' => 'termmeta',
	// 		'object_id' => $object_id,
	// 		'object_key' => $meta_key
	// 	);
	//
	// 	return $null;
	//
	// }
	//
	// public function update_dependencies($target_id) {
	// 	global $wpdb;
	//
	// 	$dependency_table = $wpdb->prefix.$this->dependency_table;
	//
	// 	$dependencies = $wpdb->get_results($wpdb->prepare(
	// 		"SELECT * FROM $dependency_table WHERE target_id = %d",
	// 		$target_id
	// 	), ARRAY_A);
	//
	// 	$dead_deps = array_udiff($dependencies, $this->dependencies, array($this, 'compare_deps'));
	//
	// 	if ($dead_deps) {
	//
	// 		$dep_ids = array();
	//
	// 		foreach ($dead_deps as $dead_dep) {
	//
	// 			$dep_ids[] = intval($dead_dep->id);
	//
	// 		}
	//
	// 		$dep_ids_sql = implode(',', $dep_ids);
	//
	// 		$wpdb->query($wpdb->prepare(
	// 			"DELETE FROM $dependency_table WHERE target_id IN ($dep_ids_sql)",
	// 			$this->target
	// 		));
	//
	// 	}
	//
	// 	$extra_deps = array_udiff($this->dependencies, $dependencies, array($this, 'compare_deps'));
	//
	// 	if ($extra_deps) {
	//
	// 		foreach ($extra_deps as $extra_dep) {
	//
	// 			$wpdb->insert($dependency_table, array(
	// 				'target_id' => $target_id,
	// 				'object' => $extra_dep['object'],
	// 				'object_id' => isset($extra_dep['object_id']) ? $extra_dep['object_id'] : 0,
	// 				'object_key' => isset($extra_dep['object_key']) ? $extra_dep['object_key'] : ''
	// 			), array(
	// 				'%d',
	// 				'%s',
	// 				'%d',
	// 				'%s'
	// 			));
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	//
	// /**
	//  * compare_arrays
	//  */
	// public function compare_arrays($a, $b, $keys) {
	//
	// 	foreach ($keys as $key) {
	//
	// 		if ($a[$key] < $b[$key]) return -1;
	// 		else if ($a[$key] > $b[$key]) return 1;
	//
	// 	}
	//
	// 	return 0;
	// }
	//
	// /**
	//  * @compare array_udiff
	//  */
	// public function compare_deps($a, $b) {
	//
	// 	return $this->compare_arrays($a, $b, ['object', 'object_id', 'object_key']);
	//
	// 	// if ($object = strcmp($a['object'], $b['object'])) {
	// 	//
	// 	// 	return $object;
	// 	//
	// 	// } else if ($object_id = intval($b['object_id']) - intval($a['object_id'])) {
	// 	//
	// 	// 	return $object_id;
	// 	//
	// 	// } else if ($object_key = strcmp($a['object_key'], $b['object_key'])) {
	// 	//
	// 	// 	return $object_key;
	// 	//
	// 	// } else {
	// 	//
	// 	// 	return 0;
	// 	//
	// 	// }
	//
	// }
	//
	//
	//
	//
	//
	//
	// /**
	//  * update cache
	//  */
	// public function update_file($path, $key, $extension, $value) {
	//
	// 	$file = $this->path . '/' . $path.'/'.$key.'.'.$extension;
	//
	// 	if (!file_exists(dirname($file))) {
	//
	// 		mkdir(dirname($file), 0777, true);
	//
	// 	}
	//
	// 	file_put_contents($file, $value);
	// }
	//
	// /**
	//  * delete cache
	//  */
	// public function delete_file($path, $key, $extension) {
	//
	// 	$file = $this->path . '/' . $path.'/'.$key.'.'.$$extension;
	//
	// 	unlink($file);
	//
	// }
	//
	// /**
	//  * update cache
	//  */
	// public function read_file($path, $key, $extension) {
	//
	// 	$file = $this->path . '/' . $path.'/'.$key.'.'.$extension;
	//
	// 	if (file_exists($file)) {
	//
	// 		// if ($extension === '.json') {
	// 		//
	// 		// 	return json_decode(file_get_contents($file));
	// 		//
	// 		// }
	//
	// 		return $file;
	//
	// 	}
	//
	// }
	//
	//
	//
	// //
	// // /**
	// //  * update cache
	// //  */
	// // public function update_cache($item, $value) {
	// //
	// // 	$file = $this->path . '/' . $item->path.'/'.$item->name.'.'.$item->ext;
	// //
	// // 	if (!file_exists(dirname($file))) {
	// //
	// // 		mkdir(dirname($file), 0777, true);
	// //
	// // 	}
	// //
	// // 	// if ($cluster_row->ext === '.json') {
	// // 	//
	// // 	// 	$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	// // 	//
	// // 	// }
	// //
	// // 	file_put_contents($file, $value); // json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
	// //
	// // }
	// //
	// //
	// //
	// // /**
	// //  * delete cache
	// //  */
	// // public function delete_cache($cluster_row) {
	// //
	// // 	$file = $this->cluster_path . '/' . $cluster_row->path.'/'.$cluster_row->name.'.'.$cluster_row->ext;
	// //
	// // 	unlink($file);
	// //
	// // 	// $this->rrmdir($this->cluster_path.'/'.$path.'.json');
	// //
	// // }

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

	//
	//
	// // /**
	// //  * update cache
	// //  */
	// // public function get_cache($cluster_row) {
	// //
	// // 	$file = $this->cluster_path . '/' . $cluster_row->path.'/'.$cluster_row->name.'.'.$cluster_row->ext;
	// //
	// // 	if (file_exists($file)) {
	// //
	// // 		if ($cluster_row->ext === '.json') {
	// //
	// // 			return json_decode(file_get_contents($file));
	// //
	// // 		}
	// //
	// // 		return $file;
	// //
	// // 	}
	// //
	// // }
	//
	// /**
	//  * @filter 'karma_task'
	//  */
	// public function add_task($task) {
	// 	global $wpdb;
	//
	// 	if (empty($task) && $this->get_option('active')) {
	//
	// 		$table = $wpdb->prefix.$this->value_table;
	//
	// 		$expired_item = $wpdb->get_row("SELECT * FROM $table WHERE status > 0 ORDER BY status DESC LIMIT 1");
	//
	// 		if ($expired_item) {
	//
	// 			$this->update_cluster($expired_item);
	//
	// 			$task['action'] = 'cluster updated';
	// 			$task['item'] = $expired_item;
	// 			$task['value'] = $this->read_file($expired_item->path, $expired_item->key, $expired_item->extension);
	// 			$task['notice'] = 'updating...';
	// 			$task['query'] = $query;
	//
	// 			$wpdb->query($wpdb->prepare(
	// 				"UPDATE $table SET status = 0 WHERE id = %d",
	// 				$expired_item->id
	// 			));
	//
	// 		}
	//
	// 	}
	//
	// 	return $task;
	// }
	//
	// /**
	//  * @hook "karma_cheat_{$dependency->target}_dependency_updated"
	//  */
	// public function dependency_updated($dependency) {
	// 	global $wpdb;
	//
	// 	if ($this->get_option('active')) {
	//
	// 		$table = $wpdb->prefix.$this->value_table;
	//
	// 		$wpdb->query($wpdb->prepare(
	// 			"UPDATE $table SET status = GREATEST(status, %d) WHERE id = %d",
	// 			$dependency->priority,
	// 			$dependency->target_id
	// 		));
	//
	// 	}
	//
	// }
	//
	// // update_metadata( string $meta_type, int $object_id, string $meta_key, mixed $meta_value, mixed $prev_value = '' )
	// //
	// // do_action( "updated_{$meta_type}_meta", $meta_id, $object_id, $meta_key, $_meta_value );
	//
	//
	// /**
	//  * @hook "updated_{$meta_type}_meta"
	//  */
	// public function updated_post_meta($meta_id, $object_id, $meta_key, $_meta_value) {
	//
	// 	// add cheat if registered and not exist (or delete it if no more registered)
	//
	// 	// $item = $wpdb->get_results($wpdb->prepare(
	// 	// 	"SELECT * FROM $cheat_table
	// 	// 	WHERE post_id = %d AND key = %s",
	// 	// 	$post_id,
	// 	// 	$cheat['key']
	// 	// ));
	//
	//
	//
	//
	//
	//
	//
	// 	$table = $wpdb->prefix.$this->dependency_table;
	//
	// 	$dependency_ids = $wpdb->get_col($wpdb->prepare(
	// 		"SELECT target_id FROM $table
	// 		WHERE object = %s AND object_key = %s AND object_id = %d
	// 		ORDER BY priority DESC",
	// 		'postmeta',
	// 		$meta_key,
	// 		$object_id
	// 	));
	//
	// 	foreach ($dependency_ids as $dependency_id) {
	//
	// 		do_action("karma_cheat_dependency_updated", $dependency_id);
	//
	// 	}
	//
	// }

	/**
	 * @hook "save_post"
	 */
	public function save_post($post_id, $post, $update) {

		do_action('karma_cheat_'.$post->post_type, $post, $this);


	// add cheat if registered (and not exist) or delete it if no more registered

		// $cheat_table = $wpdb->prefix.$this->cheat_table;
		//
		// $cheats = $wpdb->get_results($wpdb->prepare(
		// 	"SELECT * FROM $cheat_table
		// 	WHERE post_id = %d AND key = %s",
		// 	$post_id,
		// 	$cheat['key']
		// ));
		//
		//
		//
		// foreach ($this->cheats['post_type'] as $post_type => $cheat) {
		//
		// 	$item = $wpdb->get_results($wpdb->prepare(
		// 		"SELECT * FROM $cheat_table
		// 		WHERE post_id = %d AND key = %s",
		// 		$post_id,
		// 		$cheat['key']
		// 	));
		//
		// 	if (!$item) {
		//
		// 		$item = $this->create_value($cheat['key'], $post, $cheat['datatype'], $cheat['extension']);
		// 		$this->add_value($item);
		//
		// 	}
		//
		// }
		//
		//
		//
		// // update dependencies
		//
		// $dependency_table = $wpdb->prefix.$this->dependency_table;
		//
		// $dependency_ids = $wpdb->get_col($wpdb->prepare(
		// 	"SELECT target_id FROM $dependency_table
		// 	WHERE (object = 'post' AND object_id = %d) OR (object = 'posttype' AND object_key = %s)
		// 	ORDER BY priority DESC",
		// 	'post',
		// 	$post_id,
		// 	$post->post_type
		// ));
		//
		// foreach ($dependency_ids as $dependency_id) {
		//
		// 	do_action("karma_value_dependency_updated", $dependency_id);
		//
		// }

	}


	/**
	 * @compare array_udiff
	 */
	// public function compare_deps($a, $b) {
	//
	// 	return $this->compare_arrays($a, $b, ['object', 'object_id', 'object_key']);
	//
	// }
	//
	//
	//
	// /**
	//  * @hook 'karma_cache_update_object'
	//  */
	// // function update_object($object, $type, $id = 0) {
	// // 	global $wpdb;
	// //
	// // 	$dependency_table = $wpdb->prefix.$this->table_name;
	// //
	// // 	$dependencies = $wpdb->get_results($wpdb->prepare(
	// // 		"SELECT target, target_id, priority FROM $dependency_table
	// // 		WHERE object = %s AND type = %s AND (object_id = 0 OR object_id = %d)
	// // 		ORDER BY priority DESC",
	// // 		// ORDER BY field(target, 'cluster', 'patch', 'html') ASC, priority DESC
	// // 		$object,
	// // 		$type,
	// // 		$id
	// // 	));
	// //
	// // 	foreach ($dependencies as $dependency) {
	// //
	// // 		do_action("karma_cache_{$dependency->target}_dependency_updated", $dependency);
	// //
	// // 	}
	// //
	// // }
	//
	//
	//
	//
	//
	//
	// /**
	//  * @hook 'save_post'
	//  */
	// function save_post($post_id, $post, $update) {
	// 	global $wpdb, $karma_clusters_options;
	//
	// 	if ($karma_clusters_options->get_option('clusters_active')) {
	//
	// 		$cluster_table = $wpdb->prefix.$this->table_name;
	//
	// 		$cluster_rows = $wpdb->get_results($wpdb->prepare(
	// 			"SELECT * FROM $cluster_table WHERE post_id = %d",
	// 			$post_id
	// 		));
	//
	// 		$path = $this->get_path($post);
	//
	// 		foreach ($cluster_rows as $cluster_row) {
	//
	// 			if ($path !== $cluster_row->path) {
	//
	// 				$wpdb->query($wpdb->prepare(
	// 					"UPDATE $cluster_table SET status = 100, path = %s WHERE id = %d",
	// 					$path,
	// 					$cluster_row->id
	// 				));
	//
	// 				$this->delete_cache($cluster_row);
	//
	// 			} else {
	//
	// 				$wpdb->query($wpdb->prepare(
	// 					"UPDATE $cluster_table SET status = 100 WHERE id = %d",
	// 					$cluster_row->id
	// 				));
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// }

	/**
	 * @hook 'before_delete_post'
	 *
	 * Must trigger after dependencies!
	 */
	public function delete_post($post_id) {

		$post = get_post($post_id);

		do_action('karma_cheat_'.$post->post_type, $post, $this);

		// global $wpdb, $karma_clusters_options;
		//
		// if ($karma_clusters_options->get_option('clusters_active')) {
		//
		// 	$table = $wpdb->prefix.$this->table_name;
		//
		// 	$post = get_post($post_id);
		// 	$path = $this->get_path($post);
		//
		// 	$cluster_row = $wpdb->get_row($wpdb->prepare(
		// 		"SELECT * FROM $table WHERE path = %s",
		// 		$path
		// 	));
		//
		// 	if ($cluster_row) {
		//
		// 		do_action('karma_delete_cluster', $cluster_row, $post_id, $cluster_row->post_type, $this);
		//
		// 		$this->delete_cache($cluster_row->path);
		//
		// 		$wpdb->query($wpdb->prepare(
		// 			"DELETE FROM $table WHERE id = %d",
		// 			$cluster_row->id
		// 		));
		//
		// 	}
		//
		// }

	}

	// /**
	//  *
	//  */
	// public function delete_all_clusters() {
	// 	global $wpdb;
	//
	// 	$cluster_table = $wpdb->prefix.$this->table_name;
	//
	// 	$wpdb->query("truncate $cluster_table");
	//
	// 	$this->rrmdir($this->cluster_path);
	//
	// }
	//
	// /**
	//  *
	//  */
	// public function create_all_clusters() {
	// 	global $wpdb;
	//
	// 	$post_types = get_post_types();
	// 	$registered_post_types = array();
	//
	// 	foreach ($post_types as $post_type) {
	//
	// 		if (has_action('karma_clusters_update_'.$post_type)) {
	//
	// 			$registered_post_types[] = $post_type;
	//
	// 		}
	//
	// 	}
	//
	// 	// if ($this->post_types) {
	// 	if ($registered_post_types) {
	//
	// 		// $sql = implode("', '", array_map('esc_sql', array_keys($this->post_types)));
	// 		$sql = implode("', '", array_map('esc_sql', $registered_post_types));
	//
	// 		$posts = $wpdb->get_results(
	// 			"SELECT ID, post_type, post_name, post_parent FROM $wpdb->posts WHERE post_type IN ('$sql')"
	// 		);
	//
	//
	// 		foreach ($posts as $post) {
	//
	// 			$path = $this->get_path($post);
	// 			$request = "p={$post->ID}&post_type={$post->post_type}";
	// 			$cluster_row = $this->create_cluster($post, $request, $path);
	//
	// 			do_action('karma_save_cluster', $cluster_row, $post, $this);
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// /**
	//  * @ajax 'karma_update_clusters'
	//  */
	// public function ajax_update_clusters() {
	// 	global $wpdb;
	//
	// 	$table = $wpdb->prefix.$this->table_name;
	//
	// 	$wpdb->query($wpdb->prepare(
	// 		"UPDATE $table SET status = %d",
	// 		1
	// 	));
	//
	// 	$num_task = $wpdb->get_var("SELECT count(id) AS num FROM $table");
	//
	// 	$output['notice'] = "Updating $num_task clusters";
	//
	// 	echo json_encode($output);
	// 	exit;
	//
	// }
	//
	// /**
	//  * @ajax 'karma_create_clusters'
	//  */
	// public function ajax_create_clusters() {
	// 	global $wpdb;
	//
	// 	$this->delete_all_clusters();
	// 	$this->create_all_clusters();
	//
	// 	$cluster_table = $wpdb->prefix.$this->table_name;
	//
	// 	$num_task = $wpdb->get_var("SELECT count(id) AS num FROM $cluster_table WHERE status > 0");
	//
	// 	$output['notice'] = "Creating $num_task clusters";
	//
	// 	echo json_encode($output);
	// 	exit;
	//
	// }

	/**
	 * @ajax 'karma_cache_delete'
	 */
	public function ajax_delete_cache() {

		$this->rrmdir(ABSPATH.'/'.$this->path);

		echo json_encode('ok');
		exit;

	}

	// /**
	//  * @ajax 'karma_toggle_clusters'
	//  */
	// public function ajax_toggle_clusters() {
	// 	global $wpdb, $karma_clusters_options;
	//
	// 	$output = array();
	//
	// 	if ($karma_clusters_options->get_option('clusters_active')) {
	//
	// 		$karma_clusters_options->update_option('clusters_active', '');
	//
	// 		$output['title'] = 'Clusters (disabled)';
	// 		$output['label'] = 'Activate Clusters';
	// 		$output['notice'] = "Deactivate Clusters. ";
	// 		$output['action'] = 'deactivate clusters';
	//
	// 	} else {
	//
	// 		$karma_clusters_options->update_option('clusters_active', '1');
	//
	// 		// $table = $wpdb->prefix.$this->table_name;
	// 		// $num_task = $wpdb->get_var("SELECT count(id) AS num FROM $table");
	//
	// 		$output['title'] = 'Clusters (enabled)';
	// 		$output['label'] = 'Deactivate Clusters';
	// 		$output['notice'] = "Activating Clusters ($num_task). ";
	// 		$output['action'] = 'rebuild clusters';
	//
	// 	}
	//
	// 	echo json_encode($output);
	// 	exit;
	// }

	/**
	 * @callbak 'admin_bar_menu'
	 */
	public function add_toolbar_button( $wp_admin_bar ) {
		// global $karma_clusters_options;

		if (current_user_can('manage_options')) {

			// $clusters_active = $karma_clusters_options->get_option('clusters_active');

			// $wp_admin_bar->add_node(array(
			// 	'id'    => 'clusters-group',
			// 	'title' => 'Clusters ('.($clusters_active ? 'enabled' : 'disabled').')'
			// ));
			//
			// $wp_admin_bar->add_node(array(
			// 	'id'    => 'update-clusters',
			// 	'parent' => 'clusters-group',
			// 	'title' => 'Update Clusters',
			// 	'href'  => '#',
			// 	'meta'  => array(
			// 		// 'onclick' => 'ajaxPost("'.admin_url('admin-ajax.php').'", {action: "karma_update_clusters"}, function(results) {KarmaTaskManager.update(results.notice);});event.preventDefault();'
			// 		'onclick' => 'KarmaTaskManager&&KarmaTaskManager.addTask("karma_update_clusters",this);event.preventDefault()'
			// 	)
			// ));
			//
			// $wp_admin_bar->add_node(array(
			// 	'id'    => 'create-clusters',
			// 	'parent' => 'clusters-group',
			// 	'title' => 'Create Clusters',
			// 	'href'  => '#',
			// 	'meta'  => array(
			// 		'onclick' => 'KarmaTaskManager&&KarmaTaskManager.addTask("karma_create_clusters",this);event.preventDefault()'
			// 	)
			// ));




			$wp_admin_bar->add_node(array(
				'id'    => 'delete-clusters',
				// 'parent' => 'clusters-group',
				'title' => 'Delete Cache',
				'href'  => '#',
				'meta'  => array(
					'onclick' => 'fetch("'.admin_url('admin-ajax.php').'", {method: "post", headers: {"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"}, body: "action=karma_cache_delete", credentials: "same-origin"}).then(function(response) {console.log(response.json())});'
				)
			));

			// $wp_admin_bar->add_node(array(
			// 	'id'    => 'toggle-clusters',
			// 	'title' => $clusters_active ? 'Deactivate Clusters' : 'Activate Clusters',
			// 	'parent' => 'clusters-group',
			// 	'href'  => '#',
			// 	'meta'  => array(
			// 		'onclick' => 'KarmaTaskManager&&KarmaTaskManager.addTask("karma_toggle_clusters",this,function(results){this.innerHTML=results.label;this.parentNode.parentNode.parentNode.previousSibling.innerHTML=results.title});event.preventDefault()'
			// 	)
			// ));

		}

	}


	// 	/**
	// 	 * @hook 'init'
	// 	 */
	// 	function create_tables() {
	//
	// 		if (is_admin()) {
	//
	// 			$this->create_table($this->$value_table, "
	// 				id BIGINT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	// 				key VARCHAR(255) NOT NULL,
	// 				post_id BIGINT(11) NOT NULL,
	// 				path VARCHAR(255) NOT NULL,
	// 				datatype VARCHAR(255) NOT NULL,
	// 				extension VARCHAR(255) NOT NULL,
	// 				status SMALLINT(1) NOT NULL
	// 			", '001');
	//
	// 			$this->create_table($this->dependency_table, "
	// 				id BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	// 				target_id BIGINT(20) NOT NULL,
	// 				object VARCHAR(255) NOT NULL,
	// 				object_id BIGINT(20) NOT NULL,
	// 				object_key VARCHAR(255) NOT NULL,
	// 				priority SMALLINT(3) NOT NULL
	// 			", '001');
	//
	// 		}
	//
	// 	}
	//
	// 	/**
	// 	 *	create table
	// 	 */
	// 	public function create_table($name, $mysql, $version = '000') {
	// 		global $wpdb;
	//
	// 		if ($version !== $this->get_option('karma_table_'.$name.'_version')) {
	//
	// 			$table = $wpdb->prefix.$name;
	//
	// 			$charset_collate = '';
	//
	// 			if (!empty($wpdb->charset)){
	// 				$charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
	// 			}
	//
	// 			if (!empty($wpdb->collate)){
	// 				$charset_collate .= " COLLATE $wpdb->collate";
	// 			}
	//
	// 			$mysql = "CREATE TABLE $table (
	// 				$mysql
	// 			) $charset_collate;";
	//
	// 			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	// 			dbDelta($mysql);
	//
	// 			$this->update_option('karma_table_'.$name.'_version', $version);
	// 		}
	//
	// 	}
	//
	// }
	//
	//
	//
	// /**
	//  * @filter 'karma_task_notice'
	//  */
	// public function task_notice($tasks) {
	// 	global $wpdb;
	//
	// 	$cluster_table = $wpdb->prefix.$this->table_name;
	//
	// 	$num_task = $wpdb->get_var("SELECT count(id) AS num FROM $cluster_table WHERE status > 0");
	//
	// 	if ($num_task) {
	//
	// 		$tasks[] = "Updating $num_task clusters. ";
	//
	// 	}
	//
	// 	return $tasks;
	// }
	//
	//
	// /**
	//  * public API
	//  */
	// public function get_post_cluster($post) {
	//
	// 	return $this->get_cache($this->get_path($post));
	//
	// }
	//
	// /**
	//  * public API
	//  */
	// public function get_cluster_url($post) {
	//
	// 	return $this->cluster_url.'/'.$this->get_path($post).'.json';
	//
	// }




}
