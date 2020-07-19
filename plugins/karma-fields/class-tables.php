<?php


Class Karma_Tables {

	public $version = '1';

	public $middlewares = array();
	public $keys = array();

	/**
	 *	constructor
	 */
	public function __construct() {

		// echo '<pre>';
		// print_r(get_option('rewrite_rules'));
		// die();

		require_once dirname(__FILE__) . '/multilanguage.php';

		require_once dirname(__FILE__) . '/class-posts.php';

		require_once dirname(__FILE__) . '/class-posts-fields.php';

		add_action('init', array($this, 'init'));

		add_action('rest_api_init', array($this, 'rest_api_init'));

		// disable check for empty post in wp_insert_post

		// from  v1
		// add_action('wp_ajax_karma_multimedia_get_image_src', array($this, 'ajax_get_image_src'));


		if (is_admin()) {

			add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));

			add_action('karma_field_print_grid', array($this, 'print_grid'));

			add_action('admin_head', array($this, 'print_footer'));

			// add_action('karma_field', array($this, 'print_field'), 10, 4);
			// add_action('karma_field_group', array($this, 'print_field_group'), 10, 3);
			//
			//
			// add_action('wp_ajax_karma_multimedia_get_image_src', array($this, 'ajax_get_image_src'));
			//
			// add_action('wp_ajax_karma_field_get_terms', array($this, 'ajax_get_terms'));
			// // add_action('wp_ajax_karma_field_query_posts', array($this, 'ajax_query_posts'));
			//
			//
			// add_action('karma_fields', array($this, 'print_field'), 10, 4);
			//
			//
			// // add_action('admin_footer', array($this, 'print_footer'));
			// add_action('admin_head', array($this, 'print_footer'));
		}


		// add_action('karma_cache_request', array($this, 'karma_cache_request'), 10, 4);



	}


		/**
		 * Hook for 'admin_enqueue_scripts'
		 */
		public function enqueue_styles() {

			$plugin_url = trim(plugin_dir_url(__FILE__), '/');

			wp_enqueue_style('date-field-styles', $plugin_url . '/css/date-field.css');
			wp_enqueue_style('media-field-styles', $plugin_url . '/css/media-field.css');
			wp_enqueue_style('multimedia-styles', $plugin_url . '/css/multimedia.css');
			wp_enqueue_style('karma-styles-grid', $plugin_url . '/css/grid.css');

			wp_register_script('build', $plugin_url . '/js/build-v4.js', array(), $this->version, false);
			wp_register_script('calendar', $plugin_url . '/js/calendar.js', array(), $this->version, false);
			wp_register_script('ajax', $plugin_url . '/js/ajax-v2.js', array(), $this->version, false);
			wp_register_script('sortable', $plugin_url . '/js/sortable.js', array(), $this->version, false);

			wp_enqueue_script('media-field', $plugin_url . '/js/media.js', array('ajax', 'build'), $this->version, false);
			wp_localize_script('media-field', 'KarmaFieldMedia', array(
				'ajax_url' => admin_url('admin-ajax.php')
			));

			// v1
			// wp_enqueue_script('date-field', KARMA_FIELDS_URL . '/js/date-field-v2.js', array('media-field', 'build', 'calendar'), $this->version, false);

			// v2 fields
			wp_enqueue_script('karma-field-group', $plugin_url . '/js/fields/group.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-field-date', $plugin_url . '/js/fields/date.js', array('media-field', 'build', 'calendar'), $this->version, false);
			wp_enqueue_script('karma-field-textinput', $plugin_url . '/js/fields/textinput.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-field-grid', $plugin_url . '/js/fields/grid.js', array('media-field', 'build'), $this->version, false);

			//filters
			wp_enqueue_script('karma-filter-postdate', $plugin_url . '/js/filters/postdate.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-poststatus', $plugin_url . '/js/filters/poststatus.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-search', $plugin_url . '/js/filters/search.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-posttype', $plugin_url . '/js/filters/posttype.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-node', $plugin_url . '/js/filters/node.js', array('media-field', 'build'), $this->version, false);

			// tables
			wp_enqueue_script('karma-table-grid', $plugin_url . '/js/tables/grid.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-grid-body-cell', $plugin_url . '/js/tables/grid-body-cell.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-table-header-cell', $plugin_url . '/js/tables/table-header-cell.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-table-header', $plugin_url . '/js/tables/table-header.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-pagination', $plugin_url . '/js/tables/pagination.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-footer', $plugin_url . '/js/tables/footer.js', array('media-field', 'build'), $this->version, false);

			// utils
			wp_enqueue_script('karma-select-grid', $plugin_url . '/js/grid-select.js', array('media-field'), $this->version, false);

			// managers
			wp_enqueue_script('karma-manager-pool', $plugin_url . '/js/managers/pool.js', array('media-field'), $this->version, false);
			wp_enqueue_script('karma-manager-history', $plugin_url . '/js/managers/history.js', array('media-field', 'karma-manager-pool'), $this->version, false);

			wp_enqueue_script('table-manager', $plugin_url . '/js/managers/table-manager.js', array('media-field', 'build', 'karma-manager-history'), $this->version, false);
			wp_enqueue_script('field-manager', $plugin_url . '/js/managers/field-manager.js', array('media-field', 'build', 'karma-manager-history'), $this->version, false);
			wp_enqueue_script('filter-manager', $plugin_url . '/js/managers/filter-manager.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('row-manager', $plugin_url . '/js/managers/row-manager.js', array('media-field', 'build'), $this->version, false);




			// compat
			// wp_enqueue_script('multimedia-field', $plugin_url . '/js/multimedia.js', array('build', 'sortable', 'media-field'), $this->version, false);

		}

		/**
		 * @hook admin_footer
		 */
		public function print_footer() {
			// global $karma_cache;

			$karma_fields = array(
				// 'ajax_url' => admin_url('admin-ajax.php'),
				'icons_url' => plugin_dir_url(__FILE__).'dashicons',
				'getURL' => rest_url().'karma-fields/v1/get',
				// 'getURL' => apply_filters('karma_cache_url', rest_url().'karma-fields/v1/get'), // -> apply_filters('karma_fields_get')
				'cacheURL' => apply_filters('karma_cache_url', false),
				'queryURL' => rest_url().'karma-fields/v1/query',
				'saveURL' => rest_url().'karma-fields/v1/update',
				'filterURL' => rest_url().'karma-fields/v1/filters',
				'addURL' => rest_url().'karma-fields/v1/add',
				'removeURL' => rest_url().'karma-fields/v1/remove'
				// 'queryTermsURL' => rest_url().'karma-fields/v1/taxonomy',
			);


			// if (isset($karma_cache)) {
			//
			// 	$karma_fields['getPostURL'] = home_url().'/'.$karma_cache->path;
			//
			// }

			echo '<script>KarmaFields = '.json_encode($karma_fields).';</script>';

		}

	/**
	 * @hook init
	 */
	public function init() {

		do_action('karma_fields_init', $this);

	}


	/**
	 *	@hook 'rest_api_init'
	 */
	public function rest_api_init() {

		// register_rest_route('karma-fields/v1', '/update/posts', array(
		// 	'methods' => 'POST',
		// 	'callback' => function($request) {
		// 		var_dump('yy');
		// 		return 'dd';
		// 	}
		// ));


		register_rest_route('karma-fields/v1', '/query/(?P<middleware>[a-z0-9_-]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_query'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'page' => array(
					'default' => 1
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/get/(?P<path>[^?]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get'),
			'args' => array(
				'path' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/update/(?P<middleware>[a-z0-9_-]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'fields' => array(
					'required' => true
				),
				'page' => array(
					'default' => 1
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/filters/(?P<middleware>[a-z0-9_-]+)/(?P<key>[a-z0-9_.-]+)/?', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_filter'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'key' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/options/(?P<middleware>[a-z0-9_-]+)/(?P<key>[^/]+)/?', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get_field_options'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'key' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/add/(?P<middleware>[a-z0-9_-]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_add'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'filters' => array(
					'default' => array()
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/remove/(?P<middleware>[a-z0-9_-]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_remove'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'uris' => array(
					'required' => true
				)
	    )
		));





	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/query/'
	 */
	public function rest_query($request) {

		$middleware_name = $request->get_param('middleware');

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware) {

			if (isset($middleware['query']) && is_callable($middleware['query'])) {

				$args = $this->parse_args($request, $middleware_name);

				$results = call_user_func($middleware['query'], $args);

				return apply_filters("karma_fields_{$middleware_name}_results", $results, $args);

			} else {

				return 'error middleware query callback not found';

			}

		} else {

			return 'error middleware not found';

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/filter/[object]/[filter]'
	 */
	public function rest_filter($request) {

		$middleware_name = $request->get_param('middleware');
		$middleware = $this->get_middleware($middleware_name);
		$key = $request->get_param('key');



// var_dump($middleware_name, $key);

		// return call_user_func($middleware['fetch'], $key, $request, $middleware);

		// $middlewares = $this->get_middlewares();
		// $middleware = $this->find($middlewares, 'name', $middleware_name);
		//
		// if ($middleware && $filter) {
		//
		// 	$filter = $this->find($middleware['filters'], 'name', $filter_name);



			$filter = $this->get_key_filter($middleware_name, $key);

			if ($filter) {

				if (isset($filter['fetch']) && is_callable($filter['fetch'])) {

					return call_user_func($filter['fetch'], $key, $request, $middleware);

				} else {

					return "rest filter error: fetch callback not found";

				}

			} else {

				return "karma fields rest filter error: filter not found";

			}

		// } else {
		//
		// 	return 'rest filter error: middleware or filter_name not found';
		//
		// }

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get($request) {

		$path = $request->get_param('path');

		// $locator = $this->parse_path($path);

		$parts = explode('/', $path);

		$middleware = array_shift($parts);
		$key = array_pop($parts);
		$uri = implode('/', $parts);


		// $middleware_name = $request->get_param('middleware');
		// // $field_name = $request->get_param('field');
		// $path = $request->get_param('path');

		// $middlewares = $this->get_middlewares();
		// $middleware = $this->find($middlewares, 'name', $locator->middleware);

		// if ($middleware) {

			// if ($middleware && $uri && $key) {

				// $uri = dirname($path);
				// $filename = basename($path);
				// $key = pathinfo($filename, PATHINFO_FILENAME);
				// $extension = pathinfo($filename, PATHINFO_EXTENSION);

				$field = $this->get_key_field($middleware, $key);

				if ($field) {

					if (isset($field['get']) && is_callable($field['get'])) {

						$uri = apply_filters("karma_fields_{$middleware}_uri", $uri);

						return call_user_func($field['get'], $uri, $key);

					} else {

						return "karma fields rest get error: get callback not found";

					}

				} else {

					return "karma fields rest get error: field not found";

				}

			// } else {
			//
			// 	return "karma fields rest get error: incorrect locator";
			//
			// }

		// } else {
		//
		// 	return 'karma fields rest save error: middleware not found';
		//
		// }


		// $path = $request->get_param('path');
		//
		// $post_uri = dirname($path);
		// $filename = basename($path);
		// $key = pathinfo($filename, PATHINFO_FILENAME);
		//
		// $post_id = apply_filters('karma_cache_parse_uri', $post_uri, $post_uri);
		//
		// $post = get_post($post_id);
		//
		// if (!$post) {
		//
		// 	return 'error post not exits';
		//
		// }
		//
		// $sections = $this->get_sections();
		// $sections = $this->filter_fields($sections, 'post_type', $post->post_type, false);
		//
		// $field = $this->find_field($sections, 'key', $key);
		//
		// if (!$field) {
		//
		// 	return 'error field not exits';
		//
		// }
		//
		// // do_action('karma_fields_query', $request, $field, $post);
		//
		// $field = $this->format_field($field, false);
		//
		// $value = $this->get_value($field, $post);
		//
		// return $value;

	}



	/**
	 *	@rest 'wp-json/karma-fields/v1/update/{middleware}'
	 */
	public function rest_update($request) {

		$middleware_name = $request->get_param('middleware');

		$middleware = $this->get_middleware($middleware_name);

		$fields = $request->get_param('fields');
		$params = $request->get_params();

		foreach ($fields as $uri => $item) {

			if (isset($item['action']) && $item['action'] === 'add') {

				$this->add_item($middleware_name, $item, $params);

			} else if (isset($item['action']) && $item['action'] === 'remove') {

				$id = apply_filters("karma_fields_{$middleware_name}_uri", $uri);

				$this->remove_item($middleware_name, $id);

			// } else if (isset($item['action']) && $item['action'] === 'update') {
			} else {

				$id = apply_filters("karma_fields_{$middleware_name}_uri", $uri);

				$this->update_item($middleware_name, $item, $id, $params);

			}

		}

		$args = $this->parse_args($request, $middleware_name);

		return call_user_func($middleware['query'], $args);

	}




	/**
	 *	@rest 'wp-json/karma-fields/v1/add/{middleware}
	 */
	public function rest_add($request) {

		$middleware_name = $request->get_param('middleware');

		$middleware = $this->get_middleware($middleware_name);

		$filters = $request->get_param('filters');

		if ($middleware) {


			// foreach ($filters as $key => $value) {
			//
			// 	$filter = $this->get_key_filter($middleware_name, $key);
			//
			// 	if ($filter && isset($filter['default']) && is_callable($filter['default'])) {
			//
			// 		$args = call_user_func($filter['default'], $args, $value);
			//
			// 	}
			//
			// }

			if (isset($middleware['add']) && is_callable($middleware['add'])) {

				return call_user_func($middleware['add'], $filters);

			} else {

				return "karma fields rest add error: add callback not found";

			}

		} else {

			return "karma fields rest add error: middleware not found";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/remove/{middleware}
	 */
	public function rest_remove($request) {

		$middleware_name = $request->get_param('middleware');

		$middleware = $this->get_middleware($middleware_name);

		$uris = $request->get_param('uris');

		if ($middleware) {

			foreach ($uris as $uri) {

				$id = apply_filters("karma_fields_{$middleware_name}_uri", $uri);

				if (isset($middleware['remove']) && is_callable($middleware['remove'])) {

					return call_user_func($middleware['remove'], $id);

				} else {

					return "karma fields rest add error: add callback not found";

				}

			}

		} else {

			return "karma fields rest add error: middleware not found";

		}

	}


	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get_field_options($request) {

		$middleware_name = $request->get_param('middleware');
		$key = $request->get_param('key');

		$field = $this->get_key_field($middleware_name, $key);

		if ($field) {

			if (isset($field['fetch']) && is_callable($field['fetch'])) {

				return call_user_func($field['fetch'], $request);

			} else {

				return "karma fields rest get error: get callback not found";

			}

		} else {

			return "karma fields rest field option error: field not found";

		}

	}

	/**
	 *	add_item
	 */
	public function add_item($middleware_name, $fields, $params) {

		$middleware = $this->get_middleware($middleware_name);

		if (isset($middleware['add']) && is_callable($middleware['add'])) {

			$id = call_user_func($middleware['add'], $fields, $params);

			foreach ($fields as $key => $value) {

				$field = $this->get_key_field($middleware_name, $key);

				if ($field) {

					if (isset($field['update']) && is_callable($field['update'])) {

						call_user_func($field['update'], $id, $key, $value, $params);

					}

				} else {

					return "karma fields rest add_item error: field not found ($middleware_name, $key)";

				}

			}

		} else {

			return "karma fields rest add_item error: callback not found";

		}

	}


	/**
	 *	update_item
	 */
	public function update_item($middleware_name, $item_fields, $id, $params) {

		$args = array();

		$middleware = $this->get_middleware($middleware_name);

		foreach ($item_fields as $key => $value) {

			$field = $this->get_key_field($middleware_name, $key);

			if ($field) {

				if (isset($field['update']) && is_callable($field['update'])) {

					call_user_func($field['update'], $id, $key, $value, $args);

				} else if (isset($value)) {

					$args[$key] = $value;

				}

			} else {

				return "karma fields rest update error: field not found ($middleware_name, $key)";

			}

		}

		if ($args) {

			if (isset($middleware['update']) && is_callable($middleware['update'])) {

				call_user_func($middleware['update'], $id, $args);

			} else {

				return "karma fields rest update error: update callback not found ($middleware_name)";

			}

		}

	}

	/**
	 *	update_item
	 */
	public function remove_item($middleware_name, $id, $params = null) {

		$middleware = $this->get_middleware($middleware_name);

		if (isset($middleware['remove']) && is_callable($middleware['remove'])) {

			call_user_func($middleware['remove'], $id, $params);

		} else {

			return "karma fields rest remove_item error: callback not found ($middleware_name)";

		}

	}


	/**
	 *	get_middlewares
	 */
	public function get_middlewares() {

		return $this->middlewares;

	}

	/**
	 *	get_middleware
	 */
	public function get_middleware($name) {

		if ($name && isset($this->middlewares[$name])) {

			return $this->middlewares[$name];

		}

	}

	/**
	 *	get_filter
	 */
	public function get_filter($middleware_name, $filter_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware && isset($middleware['filters'][$filter_name])) {

			return $middleware['filters'][$filter_name];

		}

	}

	/**
	 *	get_field
	 */
	public function get_field($middleware_name, $field_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware && isset($middleware['fields'][$field_name])) {

			return $middleware['fields'][$field_name];

		}

	}

	/**
	 *	get_field
	 */
	public function get_type($middleware_name, $type_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware && isset($middleware['types'][$type_name])) {

			return $middleware['types'][$type_name];

		}

	}




	/**
	 *	register_middleware
	 */
	// public function get_column($middleware_name, $column_name) {
	//
	// 	$middleware = $this->get_middleware($middleware_name);
	//
	// 	if ($middleware) {
	//
	// 		return $this->find($middleware['columns'], 'name', $column_name);
	//
	// 	}
	//
	// }

	/**
	 *	register_middleware
	 */
	public function get_key($middleware_name, $key_name) {

		if (isset($this->keys[$middleware_name][$key_name])) {

			return $this->keys[$middleware_name][$key_name];

		}

	}

	/**
	 *	register_middleware
	 */
	public function get_key_field($middleware_name, $key_name) {

		$key = $this->get_key($middleware_name, $key_name);

		if (isset($key['field'])) {

			return $this->get_field($middleware_name, $key['field']);

		}

	}

	/**
	 *	register_middleware
	 */
	public function get_key_filter($middleware_name, $key_name) {

		$key = $this->get_key($middleware_name, $key_name);

		if (isset($key['filter'])) {

			return $this->get_filter($middleware_name, $key['filter']);

		}

	}

	/**
	 *	get_field
	 */
	public function get_key_type($middleware_name, $key_name) {

		$key = $this->get_key($middleware_name, $key_name);

		if (isset($key['type'])) {

			return $this->get_type($middleware_name, $key['type']);

		}

	}

	/**
	 *	register_middleware
	 */
	public function register_middleware($middleware_name, $middleware) {

		$this->middlewares[$middleware_name] = $middleware;

	}

	/**
	 *	unregister_middleware
	 */
	public function unregister_middleware($middleware_name) {

		$middleware = $this->find($this->middlewares, 'name', $middleware_name);

		if ($middleware) {

			$index = array_search($this->middlewares, $middleware);

			if ($index !== false) {

				array_splice($this->middlewares, $index, 1);

			}

		}

	}

	/**
	 * parse_path
	 */
	// public function parse_path($path) {
	//
	// 	$locator = new stdClass();
	//
	// 	$locator->path = $path;
	//
	// 	$parts = explode('/', $path);
	//
	// 	$locator->middleware = array_shift($parts);
	// 	$locator->key = array_pop($parts);
	// 	$locator->uri = implode('/', $parts);
	//
	// 	// $file_parts = explode('.', $locator->filename);
	// 	//
	// 	// $locator->extension = array_pop($file_parts);
	// 	// $locator->key = array_pop($file_parts);
	// 	// $locator->group = array_pop($file_parts);
	//
	// 	return $locator;
	//
	// }

	/**
	 * parse_args
	 */
	public function parse_args($request, $middleware_name) {



		$args = array();

		$middleware = $this->get_middleware($middleware_name);

		if (isset($this->keys[$middleware_name])) {

			foreach ($this->keys[$middleware_name] as $key => $key_options) {

				$filter_key = str_replace('.', '_', $key);

				if ($request->has_param($filter_key)) {

					if (isset($key_options['filter'])) {

						$filter = $this->get_filter($middleware_name, $key_options['filter']);

						if ($filter) {

							$value = $request->get_param($filter_key);

							$args = call_user_func($filter['parse'], $args, $key, $value);

						}

					}

				}

			}

		}

		if ($request->has_param('search') && isset($middleware['search'])) {

			$word = $request->get_param('search');

			$args = call_user_func($middleware['search'], $args, $word);
			// $keys = array();
			//
			// if (isset($this->keys[$middleware_name])) {
			//
			// 	foreach ($this->keys[$middleware_name] as $key => $key_options) {
			//
			// 		if (isset($key_options['type'], $key_options['searchable']) && $key_options['searchable']) {
			//
			// 			$field_name = $key_options['type'];
			//
			// 			$keys[$field_name][] = $key;
			//
			// 		}
			//
			// 	}
			//
			// }
			//
			// $search_args = null;
			//
			// foreach ($keys as $field_name => $field_keys) {
			//
			// 	$field = $this->get_field($middleware_name, $field_name);
			//
			// 	if ($field && isset($field['search1'])) {
			//
			// 		$search_args = call_user_func($field['search1'], $search_args, $word, $field_keys);
			//
			// 	}
			//
			// }
			//
			// if (!$search_args) {
			//
			// 	foreach ($keys as $field_name => $field_keys) {
			//
			// 		$field = $this->get_field($middleware_name, $field_name);
			//
			// 		if ($field && isset($field['search2'])) {
			//
			// 			$search_args = call_user_func($field['search2'], $search_args, $word, $field_keys);
			//
			// 		}
			//
			// 	}
			//
			// }
			//
			// if ($search_args) {
			//
			// 	$args = array_merge($args, $search_args);
			//
			// } else {
			//
			// 	return;
			//
			// }

		}

		if ($request->has_param('orderby')) {

			$order_key = $request->get_param('orderby');

		} else if (isset($this->keys[$middleware_name])) {

			foreach ($this->keys[$middleware_name] as $key => $key_option) {

				if (isset($key_option['default_orderby']) && $key_option['default_orderby']) {

					$order_key = $key;
					break;

				}

			}

		}

		if (isset($order_key, $this->keys[$middleware_name][$order_key])) {

			$key_option = $this->keys[$middleware_name][$order_key];

			if (isset($key_option['field'])) {

				$field = $this->get_field($middleware_name, $key_option['field']);

				if ($field) {

					if ($request->has_param('order')) {

						$order = $request->get_param('order');

					} else if (isset($key_option['default_order'])) {

						$order = $key_option['default_order'];

					} else {

						$order = 'asc';

					}

					if (isset($field['sort'])) {

						$args = call_user_func($field['sort'], $args, $order_key, $order);

					}

				}

			}

		}

		$args['posts_per_page'] = $request->get_param('ppp');
		$args['paged'] = $request->get_param('page');

		return $args;

	}


	/**
	 * @helper find
	 */
	public function find($items, $key, $value) {

		foreach ($items as $item) {

			if (isset($item[$key]) && $item[$key] === $value) {

				return $item;

			}

		}

	}

	/**
	 *	register_middleware
	 */
	public function register_keys($middleware, $keys) {

		// if (isset($this->keys[$middleware])) {
		//
		// 	$this->keys[$middleware] = array_merge($keys, $this->keys[$middleware]);
		//
		// } else {
		//
		// 	$this->keys[$middleware] = $keys;
		//
		// }

		foreach ($keys as $key_name => $key) {

			$this->register_key($middleware, $key_name, $key);

			// $key = isset($key_options['key']) ? $key_options['key'] : $key;
			//
			// $this->keys[$middleware][$key] = $key_options;

		}

	}

	/**
	 *	register_middleware
	 */
	public function register_key($middleware, $key_name, $key) {

		// if (isset($this->keys[$middleware])) {
		//
		// 	$this->keys[$middleware] = array_merge($keys, $this->keys[$middleware]);
		//
		// } else {
		//
		// 	$this->keys[$middleware] = $keys;
		//
		// }


		// $key_name = isset($key['key']) ? $key['key'] : $key_name;

		$this->keys[$middleware][$key_name] = $key;


	}



	/**
	 *	print_table
	 */
	public function print_grid($args) {
		static $id = 0;

		$id++;

		include plugin_dir_path(__FILE__) . 'includes/table.php';

	}



	// /**
	//  * parse_args
	//  */
	// public function wp_query($args) {
	//
	// 	return new WP_Query($args);
	//
	// }




	// POSTS

	public function get_other_filters_sql($request) {

		$sql_parts = array();

		// $filters_before = array();
		// $filters_after = array();

		$wheres = [];
		$joins = [];

		$middleware_name = $request->get_param('middleware');

		foreach ($this->keys[$middleware_name] as $key => $key_options) {

			if ($request->has_param('filter-'.$key) && $key !== $request->get_param('key')) {

				$filter = $this->get_filter($middleware_name, $key_options['filter']);
				$priority = isset($key_options['priority']) ? $key_options['priority'] : 'after';
				$value = $request->get_param('filter-'.$key);

				if (isset($filter['join'])) {

					$joins[$priority][] = call_user_func($filter['join'], $key, $value);

				}

				if (isset($filter['where'])) {

					$wheres[$priority][] = call_user_func($filter['where'], $key, $value);

				}

			}

		}

		foreach ($wheres as $priority => $array) {

			$sql_parts[$priority]['where'] = implode(' AND ', $array);

		}

		foreach ($joins as $priority => $array) {

			$sql_parts[$priority]['join'] = implode(' ', $array);

		}

		return $sql_parts;

	}

	//
	// public function merge_results($key, $results1, $results2) {
	//
	// 	$keyed_counts = array();
	//
	// 	foreach ($results2 as $result) {
	//
	// 		$keyed_counts[$result->$key] = $result->total;
	//
	// 	}
	//
	// 	foreach ($results1 as $result) {
	//
	// 		if (isset($keyed_counts[$result->$key])) {
	//
	// 			$result->count = $keyed_counts[$result->$key];
	//
	// 		}
	//
	// 	}
	//
	// 	return $results1;
	//
	// }






}

global $karma_fields;
$karma_fields = new Karma_Tables;
