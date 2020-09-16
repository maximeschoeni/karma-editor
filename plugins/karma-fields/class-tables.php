<?php



Class Karma_Tables {

	public $version = '2';

	public $middlewares = array();
	public $drivers = array();
	public $keys = array();

	/**
	 *	constructor
	 */
	public function __construct() {

// 		global $wpdb;
//
// 		var_dump($wpdb->get_results("SELECT IF('à' LIKE '%a%', 'YES', 'NO')"));
// die();

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

		// DEPRECATED
		// require_once dirname(__FILE__) . '/middlewares/query.php';
		// require_once dirname(__FILE__) . '/drivers/driver.php';
		//
		//
		// require_once dirname(__FILE__) . '/class-posts-fields.php';

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


		// DEPRECATED
    // $this->register_middleware('posts', KARMA_FIELDS_PATH.'/middlewares/posts.php', 'Karma_Fields_Middleware_Posts');
		//
    // $this->register_driver('posts', 'postfield', KARMA_FIELDS_PATH.'/drivers/postfield.php', 'Karma_Fields_Driver_Postfield');
		// $this->register_driver('posts', 'postfile', KARMA_FIELDS_PATH.'/drivers/postfile.php', 'Karma_Fields_Driver_Postfile');
		// $this->register_driver('posts', 'postfiles', KARMA_FIELDS_PATH.'/drivers/postfiles.php', 'Karma_Fields_Driver_Postfiles');
		// $this->register_driver('posts', 'postmeta', KARMA_FIELDS_PATH.'/drivers/postmeta.php', 'Karma_Fields_Driver_Postmeta');
		// $this->register_driver('posts', 'metadate', KARMA_FIELDS_PATH.'/drivers/metadate.php', 'Karma_Fields_Driver_Metadate');
		// $this->register_driver('posts', 'postdate', KARMA_FIELDS_PATH.'/drivers/postdate.php', 'Karma_Fields_Driver_Postdate');
		// $this->register_driver('posts', 'poststatus', KARMA_FIELDS_PATH.'/drivers/poststatus.php', 'Karma_Fields_Driver_Poststatus');
		// $this->register_driver('posts', 'posttype', KARMA_FIELDS_PATH.'/drivers/posttype.php', 'Karma_Fields_Driver_Posttype');





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



			// wp_register_script('ajax', $plugin_url . '/js/ajax-v2.js', array(), $this->version, true);
			// wp_register_script('sortable', $plugin_url . '/js/sortable.js', array(), $this->version, true);


			wp_enqueue_script('karma-fields-media', $plugin_url . '/js/media.js', array(), $this->version, true);

			wp_register_script('karma-build', $plugin_url . '/js/build-v8.js', array('karma-fields-media'), $this->version, true);
			wp_register_script('karma-fields-calendar', $plugin_url . '/js/calendar.js', array('karma-fields-media'), $this->version, true);
			// wp_localize_script('media-field', 'KarmaFieldMedia', array(
			// 	'ajax_url' => admin_url('admin-ajax.php')
			// ));



			// v1
			// wp_enqueue_script('date-field', KARMA_FIELDS_URL . '/js/date-field-v2.js', array('media-field', 'build', 'calendar'), $this->version, true);

			// v2 fields
			wp_enqueue_script('karma-field-group', $plugin_url . '/js/fields/group.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-date', $plugin_url . '/js/fields/date.js', array('karma-fields-media', 'karma-build', 'karma-fields-calendar'), $this->version, true);
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
			wp_enqueue_script('karma-field-autocomplete-textinput', $plugin_url . '/js/fields/autocomplete-textinput.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			wp_enqueue_script('karma-field-posttype', $plugin_url . '/js/fields/posttype.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-field-search', $plugin_url . '/js/fields/search.js', array('karma-fields-media', 'karma-build'), $this->version, true);


			//filters

			// deprecated: use dropdown
			wp_enqueue_script('karma-filter-postdate', $plugin_url . '/js/filters/postdate.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			wp_enqueue_script('karma-filter-poststatus', $plugin_url . '/js/filters/poststatus.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			// wp_enqueue_script('karma-filter-search', $plugin_url . '/js/filters/search.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			// wp_enqueue_script('karma-filter-node', $plugin_url . '/js/filters/node.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-filter-dropdown', $plugin_url . '/js/filters/dropdown.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			// tables
			wp_enqueue_script('karma-table-grid', $plugin_url . '/js/tables/grid.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			// wp_enqueue_script('karma-table-grid-body-cell', $plugin_url . '/js/tables/grid-body-cell.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-table-header-cell', $plugin_url . '/js/tables/table-header-cell.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-table-header', $plugin_url . '/js/tables/table-header.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-pagination', $plugin_url . '/js/tables/pagination.js', array('karma-fields-media', 'karma-build'), $this->version, true);
			wp_enqueue_script('karma-table-footer', $plugin_url . '/js/tables/footer.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			// utils
			wp_enqueue_script('karma-select-grid', $plugin_url . '/js/grid-select.js', array('karma-fields-media'), $this->version, true);
			wp_enqueue_script('karma-utils-rect', $plugin_url . '/js/utils/rect.js', array('karma-fields-media'), $this->version, true);
			wp_enqueue_script('karma-utils-object', $plugin_url . '/js/utils/object.js', array('karma-fields-media'), $this->version, true);
			wp_enqueue_script('karma-transfer', $plugin_url . '/js/transfer-manager.js', array('karma-fields-media'), $this->version, true);

			// includes
			wp_enqueue_script('karma-includes-icon', $plugin_url . '/js/includes/icon.js', array('karma-fields-media', 'karma-build'), $this->version, true);

			// managers
			// wp_enqueue_script('karma-manager-pool', $plugin_url . '/js/managers/pool.js', array('karma-fields-media'), $this->version, true);
			wp_enqueue_script('karma-manager-history', $plugin_url . '/js/managers/history.js', array('karma-fields-media', 'karma-utils-object'), $this->version, true);

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
				'restURL' => rest_url().'karma-fields/v1',
				// 'getURL' => rest_url().'karma-fields/v1/get',
				// 'getURL' => apply_filters('karma_cache_url', rest_url().'karma-fields/v1/get'), // -> apply_filters('karma_fields_get')
				'cacheURL' => apply_filters('karma_cache_url', false),
				// 'queryURL' => rest_url().'karma-fields/v1/query',
				// 'saveURL' => rest_url().'karma-fields/v1/update',
				// 'fetchURL' => rest_url().'karma-fields/v1/fetch',
				// 'defaultURL' => rest_url().'karma-fields/v1/default'


				// 'addURL' => rest_url().'karma-fields/v1/add',
				// 'removeURL' => rest_url().'karma-fields/v1/remove'
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

		register_rest_route('karma-fields/v1', '/query/(?P<driver>[a-z0-9_-]+)/?', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_query'),
			'args' => array(
				'driver' => array(
					'required' => true
				)
	    )
		));

		// register_rest_route('karma-fields/v1', '/get/(?P<driver>[a-z0-9_-]+)/(?P<path>[a-z0-9_-]+)?', array(
		register_rest_route('karma-fields/v1', '/get/(?P<driver>[^/]+)(?P<path>/.+)?/(?P<key>.+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get')
			// 'args' => array(
			// 	'path' => array(
			// 		'required' => true
			// 	)
	    // )
		));

		register_rest_route('karma-fields/v1', '/update/(?P<driver>[a-z0-9_-]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'args' => array(
				'driver' => array(
					'required' => true
				),
				// 'key' => array(
				// 	'required' => true
				// ),
				'fields' => array(
					'required' => true
				)
				// 'page' => array(
				// 	'default' => 1
				// )
	    )
		));

		register_rest_route('karma-fields/v1', '/fetch/(?P<driver>[^/]+)/(?P<key>[^/?]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_fetch'),
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'key' => array(
					'required' => true
				)
	    )
		));

		// register_rest_route('karma-fields/v1', '/default/(?P<driver>[a-z0-9_-]+)/(?P<method>[a-z0-9_-]+)/(?P<key>[a-z0-9_.-]+)/?', array(
		// 	'methods' => 'GET',
		// 	'callback' => array($this, 'rest_default')
		// ));

		register_rest_route('karma-fields/v1', '/add/(?P<driver>[a-z0-9_-]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_add'),
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'fields' => array(
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

		$driver_name = $request->get_param('driver');
		// $method = $request->get_param('method');

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'query')) {

				return $driver->query($request, $this);

				// return apply_filters("karma_fields_{$middleware_name}_results", $results, $args);

			} else {

				return "karma fields error: driver has no method 'query'";

			}

		} else {

			return 'karma fields error driver not found';

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/filter/[object]/[filter]'
	 */
	public function rest_fetch($request) {

		// $middleware_name = $request->get_param('middleware');
		$driver_name = $request->get_param('driver');
		$key = $request->get_param('key');
		// $params = $request->get_params();

		// $middleware = $this->get_middleware($middleware_name);
		// $driver = $middleware->get_driver($key);

		// $driver = $this->get_key_driver($middleware_name, $key);
		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'fetch')) {

				return $driver->fetch($key, $request, $this);

			} else {

				return "karma fields error: driver has no method 'fetch'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get($request) {

		$driver_name = $request->get_param('driver');
		$uri = $request->get_param('path');
		$key = $request->get_param('key');

		// $parts = explode('/', $path);
		// $driver_name = array_shift($parts);
		// $key = array_pop($parts);
		// $method = array_pop($parts);
		// $uri = implode('/', $parts);

		$driver = $this->get_driver($driver_name);

		// $driver = $this->get_middleware($middleware)->get_driver($key);

		// $driver = $this->get_key_driver($middleware_name, $key);

		if ($driver) {

			if (method_exists($driver, 'get')) {

				return $driver->get($uri, $key, $request, $this);

			} else {

				return "karma fields error: driver has no method 'get'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}


	/**
	 *	@rest 'wp-json/karma-fields/v1/update/{middleware}'
	 */
	public function rest_update($request) {

		// $middleware_name = $request->get_param('middleware');
		$driver_name = $request->get_param('driver');
		$fields = $request->get_param('fields');
		// $key = $request->get_param('key');

		// $middleware = $this->get_middleware($middleware_name);
		//
		//
		//
		// $driver = $middleware->get_driver($key);

		// $driver = $this->get_key_driver($middleware_name, $key);

		$driver = $this->get_driver($driver_name);

		// foreach ($fields as $uri => $item) {
		//
			// if (isset($item['action']) && $item['action'] === 'add') {
			//
			// 	if (method_exists($driver, 'add')) {
			//
			// 		$driver->add($item, $uri, $method, $request, $this);
			//
			// 	} else {
			//
			// 		return "karma fields error: driver has no method 'add'";
			//
			// 	}
			//
			// } else if (isset($item['action']) && $item['action'] === 'remove') {
			//
			// 	if (method_exists($driver, 'remove')) {
			//
			// 		$driver->remove($uri, $method, $request, $this);
			//
			// 	} else {
			//
			// 		return "karma fields error: driver has no method 'remove'";
			//
			// 	}
			//
			// } else if (method_exists($driver, 'update')) {
			//
			// 	if (method_exists($driver, 'update')) {
			//
			// 		$driver->update($item, $uri, $method, $request, $this);
			//
			// 	} else {
			//
			// 		return "karma fields error: driver has no method 'update'";
			//
			// 	}
			//
			// }

		if (method_exists($driver, 'update')) {

			foreach ($fields as $uri => $item) {

				$driver->update($item, $uri, $request, $this);

			}

		} else {

			return "karma fields error: driver has no method 'update'";

		}

		// }

		if (method_exists($driver, 'query')) {

			return $driver->query($request, $this);

		} else {

			return "karma fields error: driver has no method 'query'";

		}




		// $args = $this->parse_args($request, $middleware);
		//
		// return $middleware->query($args);

		// return array(
		// 	'query' => $middleware->query($args),
		// 	'delta' => $delta
		// );

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/add/{driver}'
	 */
	public function rest_add($request) {

		$driver_name = $request->get_param('driver');
		$fields = $request->get_param('fields');

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'add')) {

			$driver->add($fields, $request, $this);

		} else {

			return "karma fields error: driver has no method 'add'";

		}

		if (method_exists($driver, 'query')) {

			return $driver->query($request, $this);

		} else {

			return "karma fields error: driver has no method 'query'";

		}

	}

	// /**
	//  *	@rest 'wp-json/karma-fields/v1/update/{middleware}'
	//  */
	// public function rest_default($request) {
	//
	// 	$driver_name = $request->get_param('driver');
	// 	$method = $request->get_param('method');
	// 	$key = $request->get_param('key');
	//
	// 	$driver = $this->get_driver($driver_name);
	//
	// 	if (method_exists($driver, 'default')) {
	//
	// 		return $driver->default($method, $key, $request, $this);
	//
	// 	} else {
	//
	// 		return '';
	//
	// 	}
	//
	// }




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

	/** DEPRECATED
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

	/** DEPRECATED
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

	/** DEPRECATED
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

	/** DEPRECATED
	 *	update_item
	 */
	public function remove_item($middleware, $uri, $request = null) {

		if (method_exists($middleware, 'remove')) {

			$middleware->remove($uri);

		}

	}

	/** DEPRECATED
	 *	get_middleware
	 */
	public function get_middleware($name) {

		debug_backtrace();


		// require_once $this->middlewares[$name]['path'];
		//
		// $middleware = new $this->middlewares[$name]['class'];
		//
		// $middleware->keys = isset($this->keys[$name]) ? $this->keys[$name] : array();
		// $middleware->drivers = isset($this->drivers[$name]) ? $this->drivers[$name] : array();
		//
		// return $middleware;

	}

	/** DEPRECATED
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
	public function register_driver($name, $path, $class) {

		$this->drivers[$name] = array(
			'path' => $path,
			'class' => $class
		);

	}

	/**
	 * Find driver by middleware/key
	 */
	// public function get_key_driver($middleware_name, $key) {
	//
	// 	if (isset($this->keys[$middleware_name][$key])) {
	//
	// 		$key_resource = $this->keys[$middleware_name][$key];
	//
	// 		if (isset($this->drivers[$middleware_name][$key_resource['driver']])) {
	//
	// 			$driver_resource = $this->drivers[$middleware_name][$key_resource['driver']];
	//
	// 			require_once $driver_resource['path'];
	//
	// 			$driver = new $driver_resource['class'];
	//
	// 			$driver->resource = $key_resource;
	// 			$driver->key = $key;
	// 			$driver->middleware_name = $middleware_name;
	//
	// 			return $driver;
	//
	// 		}
	//
	// 	}
	//
	// }

	/**
	 * Find driver by middleware/key
	 */
	public function get_driver($driver_name) {

		if (isset($this->drivers[$driver_name])) {

			require_once $this->drivers[$driver_name]['path'];

			$driver = new $this->drivers[$driver_name]['class'];

			return $driver;

		}

	}


	/** DEPRECATED
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
	public function get_cachefile($driver_name, $key) {

		if (method_exists($driver, 'get_cachefile')) {

			return $driver->get_cachefile($key);

		} // else -> no cache



		// if (isset($this->keys[$middleware_name][$key])) {
		//
		// 	$key_resource = $this->keys[$middleware_name][$key];
		//
		// 	if (isset($resource['cache'])) {
		//
		// 		if ($resource['cache'] === true) {
		//
		// 			return $key.'.txt';
		//
		// 		} else {
		//
		// 			return $resource['cache'];
		//
		// 		}
		//
		// 	}
		//
		//
		// 	// $resource = $this->keys[$middleware_name][$key];
		// 	//
		// 	// if (!isset($resource['cache']) || $resource['cache'] === true) {
		// 	//
	  //   //   if (isset($resource['type']) && $resource['type'] === 'json') {
		// 	//
	  //   //     return $key.'.json';
		// 	//
	  //   //   } else {
		// 	//
	  //   //     return $key.'.txt';
		// 	//
	  //   //   }
		// 	//
	  //   // } else if ($resource['cache']) {
		// 	//
	  //   //   return $resource['cache'];
		// 	//
	  //   // }
		//
		// }

	}

	/**
	 *	find key from cache file
	 */
	public function find_key($driver_name, $filename) {

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'find_key')) {

			return $driver->find_key($filename);

		} else {

			return pathinfo($filename)['filename'];

		}

		//
		//
		// foreach ($this->keys[$driver_name] as $key => $resource) {
		//
		// 	if ($filename === $this->get_cachefile($driver_name, $key)) {
		//
		// 		return $key;
		//
		// 	}
		//
		// }

	}

	/**
	 * prepare field
	 */
	public function prepare(&$field) {

		if (isset($field['driver'])) {

			$driver = $this->get_driver($field['driver']);

			if ($driver && method_exists($driver, 'prepare')) {

				$driver->prepare($field);

			}

		}

		if (isset($field['children'])) {

			foreach ($field['children'] as &$child) {

				$this->prepare($child);

			}

		}

	}



	/**
	 *	print_table
	 */
	public function print_grid($args) {
		static $id = 0;

		$id++;

		$this->prepare($args);

		include plugin_dir_path(__FILE__) . 'includes/table.php';

	}



}

global $karma_fields;
$karma_fields = new Karma_Tables;
