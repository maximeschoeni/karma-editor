<?php



Class Karma_Tables {

	public $version = '1';

	public $middlewares = array();
	public $drivers = array();
	public $keys = array();

	/**
	 *	constructor
	 */
	public function __construct() {

		// echo '<pre>';
		// print_r(get_option('rewrite_rules'));
		// die();

		// spl_autoload_register(function ($class) {
		//
		// 	if (strpos($class, 'Karma_Fields_Driver_') === 0) {
		//
		// 		$class = str_replace('Karma_Fields_Driver_', '', $class);
		// 		include dirname(__FILE__) . "/drivers/$class.php";
		//
		// 	}
		//
		// });



		// require_once dirname(__FILE__) . '/multilanguage.php';

		// require_once dirname(__FILE__) . '/class-posts.php';

		require_once dirname(__FILE__) . '/middlewares/query.php';
		require_once dirname(__FILE__) . '/drivers/driver.php';


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


    $this->register_middleware('posts', KARMA_FIELDS_PATH.'/middlewares/posts.php', 'Karma_Fields_Middleware_Posts');

    $this->register_driver('posts', 'postfield', KARMA_FIELDS_PATH.'/drivers/postfield.php', 'Karma_Fields_Driver_Postfield');
		$this->register_driver('posts', 'postfile', KARMA_FIELDS_PATH.'/drivers/postfile.php', 'Karma_Fields_Driver_Postfile');
		$this->register_driver('posts', 'postfiles', KARMA_FIELDS_PATH.'/drivers/postfiles.php', 'Karma_Fields_Driver_Postfiles');
		$this->register_driver('posts', 'postmeta', KARMA_FIELDS_PATH.'/drivers/postmeta.php', 'Karma_Fields_Driver_Postmeta');
		$this->register_driver('posts', 'metadate', KARMA_FIELDS_PATH.'/drivers/metadate.php', 'Karma_Fields_Driver_Metadate');
		$this->register_driver('posts', 'postdate', KARMA_FIELDS_PATH.'/drivers/postdate.php', 'Karma_Fields_Driver_Postdate');
		$this->register_driver('posts', 'poststatus', KARMA_FIELDS_PATH.'/drivers/poststatus.php', 'Karma_Fields_Driver_Poststatus');
		$this->register_driver('posts', 'posttype', KARMA_FIELDS_PATH.'/drivers/posttype.php', 'Karma_Fields_Driver_Posttype');





	}


		/**
		 * Hook for 'admin_enqueue_scripts'
		 */
		public function enqueue_styles() {

			$plugin_url = trim(plugin_dir_url(__FILE__), '/');

			wp_enqueue_style('date-field-styles', $plugin_url . '/css/date-field.css');
			// wp_enqueue_style('media-field-styles', $plugin_url . '/css/media-field.css');
			wp_enqueue_style('multimedia-styles', $plugin_url . '/css/multimedia.css');
			wp_enqueue_style('karma-styles-grid', $plugin_url . '/css/grid.css');


			wp_register_script('karma-calendar', $plugin_url . '/js/calendar.js', array(), $this->version, true);
			// wp_register_script('ajax', $plugin_url . '/js/ajax-v2.js', array(), $this->version, true);
			// wp_register_script('sortable', $plugin_url . '/js/sortable.js', array(), $this->version, true);
			wp_register_script('karma-build', $plugin_url . '/js/build-v4.js', array(), $this->version, true);

			wp_enqueue_script('karma-fields-media', $plugin_url . '/js/media.js', array('ajax', 'karma-build'), $this->version, true);
			// wp_localize_script('media-field', 'KarmaFieldMedia', array(
			// 	'ajax_url' => admin_url('admin-ajax.php')
			// ));



			// v1
			// wp_enqueue_script('date-field', KARMA_FIELDS_URL . '/js/date-field-v2.js', array('media-field', 'build', 'calendar'), $this->version, true);

			// v2 fields
			wp_enqueue_script('karma-field-group', $plugin_url . '/js/fields/group.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-date', $plugin_url . '/js/fields/date.js', array('karma-fields-media', 'karma-build', 'karma-calendar'), $this->version, true);
			wp_enqueue_script('karma-field-textinput', $plugin_url . '/js/fields/textinput.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-grid', $plugin_url . '/js/fields/grid.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-file', $plugin_url . '/js/fields/file.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-files', $plugin_url . '/js/fields/files.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-dropdown', $plugin_url . '/js/fields/dropdown.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-checkbox', $plugin_url . '/js/fields/checkbox.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-checkboxes', $plugin_url . '/js/fields/checkboxes.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-textarea', $plugin_url . '/js/fields/textarea.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-tinymce', $plugin_url . '/js/fields/tinymce.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			wp_enqueue_script('karma-field-checkboxtest', $plugin_url . '/js/fields/checkbox-test.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-index', $plugin_url . '/js/fields/index.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-option-buttons', $plugin_url . '/js/fields/option-buttons.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-submit', $plugin_url . '/js/fields/submit.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-filterlink', $plugin_url . '/js/fields/filterlink.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			//filters

			// deprecated: use dropdown
			wp_enqueue_script('karma-filter-postdate', $plugin_url . '/js/filters/postdate.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			wp_enqueue_script('karma-filter-poststatus', $plugin_url . '/js/filters/poststatus.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-filter-search', $plugin_url . '/js/filters/search.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-filter-posttype', $plugin_url . '/js/filters/posttype.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-filter-node', $plugin_url . '/js/filters/node.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-filter-dropdown', $plugin_url . '/js/filters/dropdown.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			// tables
			wp_enqueue_script('karma-table-grid', $plugin_url . '/js/tables/grid.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-grid-body-cell', $plugin_url . '/js/tables/grid-body-cell.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-table-header-cell', $plugin_url . '/js/tables/table-header-cell.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-table-header', $plugin_url . '/js/tables/table-header.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-pagination', $plugin_url . '/js/tables/pagination.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-footer', $plugin_url . '/js/tables/footer.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			// utils
			wp_enqueue_script('karma-select-grid', $plugin_url . '/js/grid-select.js', array('karma-fields-media'), $this->version, true);
			wp_enqueue_script('karma-utils-rect', $plugin_url . '/js/utils/rect.js', array('karma-fields-media'), $this->version, true);

			// includes
			wp_enqueue_script('karma-includes-icon', $plugin_url . '/js/includes/icon.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			// managers
			wp_enqueue_script('karma-manager-pool', $plugin_url . '/js/managers/pool.js', array('karma-fields-media'), $this->version, true);
			wp_enqueue_script('karma-manager-history', $plugin_url . '/js/managers/history.js', array('karma-fields-media', 'karma-manager-pool'), $this->version, true);

			wp_enqueue_script('table-manager', $plugin_url . '/js/managers/table-manager.js', array('karma-fields-media', 'karma-build', 'karma-manager-history'), $this->version, true);
			wp_enqueue_script('field-manager', $plugin_url . '/js/managers/field-manager.js', array('karma-fields-media', 'karma-build', 'karma-manager-history'), $this->version, true);
			wp_enqueue_script('filter-manager', $plugin_url . '/js/managers/filter-manager.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			// wp_enqueue_script('row-manager', $plugin_url . '/js/managers/row-manager.js', array('media-field', 'build'), $this->version, true);




			// compat
			// wp_enqueue_script('multimedia-field', $plugin_url . '/js/multimedia.js', array('build', 'sortable', 'media-field'), $this->version, false);

		}

		/**
		 * @hook admin_header
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
				'fetchURL' => rest_url().'karma-fields/v1/fetch',
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

		register_rest_route('karma-fields/v1', '/update/(?P<middleware>[a-z0-9_-]+)/(?P<key>[a-z0-9_.-]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'key' => array(
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

		register_rest_route('karma-fields/v1', '/fetch/(?P<middleware>[a-z0-9_-]+)/(?P<key>[a-z0-9_.-]+)/?', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_fetch'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'key' => array(
					'required' => true
				)
	    )
		));

		// register_rest_route('karma-fields/v1', '/options/(?P<middleware>[a-z0-9_-]+)/(?P<key>[^/]+)/?', array(
		// 	'methods' => 'GET',
		// 	'callback' => array($this, 'rest_get_field_options'),
		// 	'args' => array(
		// 		'middleware' => array(
		// 			'required' => true
		// 		),
		// 		'key' => array(
		// 			'required' => true
		// 		)
	  //   )
		// ));

		// register_rest_route('karma-fields/v1', '/add/(?P<middleware>[a-z0-9_-]+)', array(
		// 	'methods' => 'POST',
		// 	'callback' => array($this, 'rest_add'),
		// 	'args' => array(
		// 		'middleware' => array(
		// 			'required' => true
		// 		),
		// 		'filters' => array(
		// 			'default' => array()
		// 		)
	  //   )
		// ));
		//
		// register_rest_route('karma-fields/v1', '/remove/(?P<middleware>[a-z0-9_-]+)', array(
		// 	'methods' => 'POST',
		// 	'callback' => array($this, 'rest_remove'),
		// 	'args' => array(
		// 		'middleware' => array(
		// 			'required' => true
		// 		),
		// 		'uris' => array(
		// 			'required' => true
		// 		)
	  //   )
		// ));





	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/query/'
	 */
	public function rest_query($request) {

		$middleware_name = $request->get_param('middleware');

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware) {

			if (method_exists($middleware, 'query')) {

				$args = $this->parse_args($request, $middleware);

				return $middleware->query($args, $request);

				// return apply_filters("karma_fields_{$middleware_name}_results", $results, $args);

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
	public function rest_fetch($request) {

		$middleware_name = $request->get_param('middleware');
		$key = $request->get_param('key');
		// $params = $request->get_params();

		$middleware = $this->get_middleware($middleware_name);
		$driver = $middleware->get_driver($key);


		if ($driver) {

			return $driver->fetch($request);

		} else {

			return "karma fields rest filter error: driver not found ($key)";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get($request) {

		$path = $request->get_param('path');
		$parts = explode('/', $path);
		$middleware = array_shift($parts);
		$key = array_pop($parts);
		$uri = implode('/', $parts);

		$driver = $this->get_middleware($middleware)->get_driver($key);

		if ($driver) {

			if (method_exists($driver, 'get')) {

				return $driver->get($uri);

			} else {

				return "karma fields rest get error: get callback not found";

			}

		} else {

			return "karma fields rest get error: driver not found ($key)";

		}

	}


	/**
	 *	@rest 'wp-json/karma-fields/v1/update/{middleware}'
	 */
	public function rest_update($request) {

		$middleware_name = $request->get_param('middleware');
		$fields = $request->get_param('fields');
		$key = $request->get_param('key');

		$middleware = $this->get_middleware($middleware_name);



		$driver = $middleware->get_driver($key);

		foreach ($fields as $uri => $item) {

			if (isset($item['action']) && $item['action'] === 'add') {

				// $this->add_item($middleware, $key, $item, $request);

				$driver->add($item, $uri, $request);

			} else if (isset($item['action']) && $item['action'] === 'remove') {

				// $this->remove_item($middleware, $key, $uri, $request);
				$driver->remove($uri, $request);

			} else {

				// $this->update_item($middleware, $key, $item, $uri, $request);

				$driver->update($item, $uri, $request);

			}

		}

		return $driver->fetch($request);


		// $args = $this->parse_args($request, $middleware);
		//
		// return $middleware->query($args);

		// return array(
		// 	'query' => $middleware->query($args),
		// 	'delta' => $delta
		// );

	}




	// /**
	//  *	@rest 'wp-json/karma-fields/v1/add/{middleware}
	//  */
	// public function rest_add($request) {
	//
	// 	$middleware_name = $request->get_param('middleware');
	//
	// 	$middleware = $this->get_middleware($middleware_name);
	//
	// 	$filters = $request->get_param('filters');
	//
	// 	if ($middleware) {
	//
	//
	// 		// foreach ($filters as $key => $value) {
	// 		//
	// 		// 	$filter = $this->get_key_filter($middleware_name, $key);
	// 		//
	// 		// 	if ($filter && isset($filter['default']) && is_callable($filter['default'])) {
	// 		//
	// 		// 		$args = call_user_func($filter['default'], $args, $value);
	// 		//
	// 		// 	}
	// 		//
	// 		// }
	//
	// 		if (isset($middleware['add']) && is_callable($middleware['add'])) {
	//
	// 			return call_user_func($middleware['add'], $filters);
	//
	// 		} else {
	//
	// 			return "karma fields rest add error: add callback not found";
	//
	// 		}
	//
	// 	} else {
	//
	// 		return "karma fields rest add error: middleware not found";
	//
	// 	}
	//
	// }
	//
	// /**
	//  *	@rest 'wp-json/karma-fields/v1/remove/{middleware}
	//  */
	// public function rest_remove($request) {
	//
	// 	$middleware_name = $request->get_param('middleware');
	//
	// 	$middleware = $this->get_middleware($middleware_name);
	//
	// 	$uris = $request->get_param('uris');
	//
	// 	if ($middleware) {
	//
	// 		foreach ($uris as $uri) {
	//
	// 			$id = apply_filters("karma_fields_{$middleware_name}_uri", $uri);
	//
	// 			if (isset($middleware['remove']) && is_callable($middleware['remove'])) {
	//
	// 				return call_user_func($middleware['remove'], $id);
	//
	// 			} else {
	//
	// 				return "karma fields rest add error: add callback not found";
	//
	// 			}
	//
	// 		}
	//
	// 	} else {
	//
	// 		return "karma fields rest add error: middleware not found";
	//
	// 	}
	//
	// }


	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	// public function rest_get_field_options($request) {
	//
	// 	$middleware_name = $request->get_param('middleware');
	// 	$key = $request->get_param('key');
	//
	// 	$field = $this->get_key_field($middleware_name, $key);
	//
	// 	if ($field) {
	//
	// 		if (isset($field['fetch']) && is_callable($field['fetch'])) {
	//
	// 			return call_user_func($field['fetch'], $request);
	//
	// 		} else {
	//
	// 			return "karma fields rest get error: get callback not found";
	//
	// 		}
	//
	// 	} else {
	//
	// 		return "karma fields rest field option error: field not found";
	//
	// 	}
	//
	// }

	/**
	 * parse_args
	 */
	public function parse_args($request, $middleware) {

		$args = array();

		foreach ($middleware->keys as $key => $resource) {

			if ($request->has_param($key)) {

				$value = $request->get_param($key);

				$driver = $middleware->get_driver($key);

				if ($driver && method_exists($driver, 'parse')) {

					$driver->parse($value, $args);

				} else {

					$args[$key] = $value;

				}

				if ($driver && method_exists($driver, 'filter')) {

					$driver->parse($value, $args, $request);

				}
				// else {
				//
				// 	$args[$key] = $value;
				//
				// }

			}

		}

		if ($request->has_param('search')) {

			$word = $request->get_param('search');

			if (method_exists($middleware, 'search')) {

				$middleware->search($word, $args);

			} else {

				$args['search'] = $word;

			}

		}

		if ($request->has_param('orderby')) {

			$key = $request->get_param('orderby');

			$driver = $middleware->get_driver($key);

			if ($driver && method_exists($driver, 'sort')) {

				$order = $request->get_param('order');

				if ($order) {

					$order = strtoupper($order);

				}

				if ($order !== 'ASC' && $order !== 'DESC') {

					$order = null;

				}

				$driver->sort($order, $args, $request);

			}
			// else {
			//
			// 	$args['orderby'] = $key;
			//
			// }

		}

		if ($request->has_param('ppp')) {


		}

		return $args;

	}

	/**
	 *	add_item
	 */
	public function add_item($middleware, $fields, $request) {

		$middleware = $this->get_middleware($middleware_name);

		$output = array();

		if (method_exists($middleware, 'add')) {

			$args = $this->parse_args($request, $middleware);

			// $uri =
			$middleware->add($fields, $args);

			// $args = array();

			foreach ($fields as $key => $value) {

				$driver = $middleware->get_driver($key);

				if ($driver) {

					if (method_exists($driver, 'update')) {

						$driver->update($uri, $value, $args);

					}

				} else {

					return "karma fields rest add_item error: driver not found ($key)";

				}

			}

			// if ($args) {
			//
			// 	if (method_exists($middleware, 'update')) {
			//
			// 		$middleware->update($uri, $args); // $uri is modified if changed
			//
			// 	}
			//
			// }

			// return $uri; // -> return new uri

		} else {

			return "karma fields rest add_item error: add method not found";

		}

	}

	/**
	 *	update_item
	 */
	public function update_item($middleware, $item_fields, $uri, $request = null) {

		$args = array();

		foreach ($item_fields as $key => $value) {

			$driver = $middleware->get_driver($key);

			if ($driver) {

				if (method_exists($driver, 'update')) {

					$driver->update($uri, $value, $args);

				} else if (isset($value)) {

					$args[$key] = $value;

				}

			}

		}

		if ($args) {

			if (method_exists($middleware, 'update')) {

				$middleware->update($uri, $args);

			}

		}

		// return $uri; // return uri for if it changed

	}

	/**
	 *	update_item
	 */
	public function remove_item($middleware, $uri, $request = null) {

		if (method_exists($middleware, 'remove')) {

			$middleware->remove($uri);

		}

	}

	/**
	 *	get_middleware
	 */
	public function get_middleware($name) {

		require_once $this->middlewares[$name]['path'];

		$middleware = new $this->middlewares[$name]['class'];

		$middleware->keys = isset($this->keys[$name]) ? $this->keys[$name] : array();
		$middleware->drivers = isset($this->drivers[$name]) ? $this->drivers[$name] : array();

		return $middleware;

	}

	/**
	 *	register_middleware
	 */
	public function register_middleware($name, $path, $class) {

		$this->middlewares[$name] = array(
			'path' => $path,
			'class' => $class
		);

	}

	/**
	 *	register_driver
	 */
	public function register_driver($middleware_name, $name, $path, $class) {

		$this->drivers[$middleware_name][$name] = array(
			'path' => $path,
			'class' => $class
		);

	}

	/**
	 *	register_keys
	 */
	public function register_keys($middleware_name, $keys) {

		foreach ($keys as $key => $resource) {

			$this->keys[$middleware_name][$key] = $resource;

		}

	}

	/**
	 *	get_cachefile
	 */
	public function get_cachefile($middleware_name, $key) {

		if (isset($this->keys[$middleware_name][$key])) {

			$resource = $this->keys[$middleware_name][$key];

			if (!isset($resource['cache']) || $resource['cache'] === true) {

	      if (isset($resource['type']) && $resource['type'] === 'json') {

	        return $key.'.json';

	      } else {

	        return $key.'.txt';

	      }

	    } else if ($resource['cache']) {

	      return $resource['cache'];

	    }

		}

	}

	/**
	 *	find key from cache file
	 */
	public function find_key($middleware_name, $filename) {

		foreach ($this->keys[$middleware_name] as $key => $resource) {

			if ($filename === $this->get_cachefile($middleware_name, $key)) {

				return $key;

			}

		}

	}




	/**
	 *	print_table
	 */
	public function print_grid($args) {
		static $id = 0;

		$id++;

		include plugin_dir_path(__FILE__) . 'includes/table.php';

	}



}

global $karma_fields;
$karma_fields = new Karma_Tables;
