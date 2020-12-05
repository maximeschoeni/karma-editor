<?php



Class Karma_Tables {

	public $version = '9';

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

			add_action('karma_field_print_grid', array($this, 'print_grid_compat'));
			add_action('karma_fields_print_field', array($this, 'print_field_compat'), 10, 2);

			add_action('karma_field', array($this, 'print_field'));


			add_action('admin_head', array($this, 'print_footer'));


			// $file = 'wp-content/karma-fields/users/reservations/change-2.json';
			// $this->unset_to_file($file, array('reservations', '27913', 'email'));
			//
			// die('aa');




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
			$plugin_path = ABSPATH.'wp-content/plugins/karma-editor/plugins/karma-fields';

			wp_enqueue_style('date-field-styles', $plugin_url . '/css/date-field.css');
			wp_enqueue_style('multimedia-styles', $plugin_url . '/css/multimedia.css');
			wp_enqueue_style('karma-styles-grid', $plugin_url . '/css/grid.css');

			wp_enqueue_media();


			// var_dump($plugin_path.'/js/all.min.js', file_exists($plugin_path));
			// die('asdf');

			if (true && file_exists($plugin_path.'/js/all.min.js')) {

				wp_enqueue_script('karma-fields', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-fields', $plugin_url . '/js/all.js', array('karma-fields'), $this->version, true);

			} else {



				wp_enqueue_script('karma-fields-media', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields', $plugin_url . '/js/karma-fields.js', array(), $this->version, true); // -> extensions must comme after this!

				wp_enqueue_script('karma-build', $plugin_url . '/js/build-v7.1.1.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-fields-calendar', $plugin_url . '/js/calendar.js', array('karma-fields-media'), $this->version, true);


				// v2 fields
				wp_enqueue_script('karma-field-group', $plugin_url . '/js/fields/group.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-date', $plugin_url . '/js/fields/date.js', array('karma-fields-media', 'karma-fields-calendar'), $this->version, true);
				wp_enqueue_script('karma-field-textinput', $plugin_url . '/js/fields/textinput.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-grid', $plugin_url . '/js/fields/grid.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-file', $plugin_url . '/js/fields/file.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-files', $plugin_url . '/js/fields/files.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-dropdown', $plugin_url . '/js/fields/dropdown.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-checkbox', $plugin_url . '/js/fields/checkbox.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-checkboxes', $plugin_url . '/js/fields/checkboxes.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-textarea', $plugin_url . '/js/fields/textarea.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-tinymce', $plugin_url . '/js/fields/tinymce.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-checkboxtest', $plugin_url . '/js/fields/checkbox-test.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-index', $plugin_url . '/js/fields/index.js', array('karma-fields-media'), $this->version, true);
				// wp_enqueue_script('karma-field-option-buttons', $plugin_url . '/js/fields/option-buttons.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-submit', $plugin_url . '/js/fields/submit.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-filterlink', $plugin_url . '/js/fields/filterlink.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-autocomplete-textinput', $plugin_url . '/js/fields/autocomplete-textinput.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-posttype', $plugin_url . '/js/fields/posttype.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-search', $plugin_url . '/js/fields/search.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-array', $plugin_url . '/js/fields/array.js', array('karma-fields-media'), $this->version, true);

				wp_enqueue_script('karma-field-textinput-datalist', $plugin_url . '/js/fields/textinput-datalist.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-table', $plugin_url . '/js/fields/table.js', array('karma-fields-media'), $this->version, true);


				// tables
				wp_enqueue_script('karma-table-grid', $plugin_url . '/js/tables/grid.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-table-pagination', $plugin_url . '/js/tables/pagination.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-table-footer', $plugin_url . '/js/tables/footer.js', array('karma-fields-media'), $this->version, true);

				// utils
				wp_enqueue_script('karma-select-grid', $plugin_url . '/js/grid-select.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-utils-rect', $plugin_url . '/js/utils/rect.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-utils-object', $plugin_url . '/js/utils/object.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-transfer', $plugin_url . '/js/transfer-manager.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-caster', $plugin_url . '/js/utils/caster.js', array('karma-fields-media'), $this->version, true);

				// includes
				wp_enqueue_script('karma-includes-icon', $plugin_url . '/js/includes/icon.js', array('karma-fields-media'), $this->version, true);

				// managers
				wp_enqueue_script('karma-manager-history', $plugin_url . '/js/managers/history.js', array('karma-fields-media', 'karma-utils-object'), $this->version, true);
				wp_enqueue_script('table-manager', $plugin_url . '/js/managers/table-manager.js', array('karma-fields-media', 'karma-manager-history'), $this->version, true);
				wp_enqueue_script('field-manager', $plugin_url . '/js/managers/field-manager.js', array('karma-fields-media', 'karma-manager-history'), $this->version, true);

			}

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
				'user_edit' => home_url('wp-content/karma-fields/users/'.get_current_user_id().'.json'),
				'nonce' => wp_create_nonce( 'wp_rest' )
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

		add_action('wp_login', array($this, 'user_login'), 10, 2);
		add_action('wp_logout', array($this, 'user_logout'));

		$this->register_driver(
			'posts',
			KARMA_FIELDS_PATH.'/drivers/driver-posts.php',
			'Karma_Fields_Driver_Posts'
		);
		$this->register_driver(
			'postmeta',
			KARMA_FIELDS_PATH.'/drivers/driver-postmeta.php',
			'Karma_Fields_Driver_Postmeta'
		);
		$this->register_driver(
			'postmetaobject',
			KARMA_FIELDS_PATH.'/drivers/driver-postmeta-object.php',
			'Karma_Fields_Driver_Postmeta_Object'
		);
		$this->register_driver(
			'postmetafile',
			KARMA_FIELDS_PATH.'/drivers/driver-postmeta-file.php',
			'Karma_Fields_Driver_Postmeta_File'
		);
		$this->register_driver(
			'postmetafiles',
			KARMA_FIELDS_PATH.'/drivers/driver-postmeta-files.php',
			'Karma_Fields_Driver_Postmeta_Files'
		);
		$this->register_driver(
			'taxonomy',
			KARMA_FIELDS_PATH.'/drivers/driver-taxonomy.php',
			'Karma_Fields_Driver_Taxonomy'
		);

		add_action('save_post', array($this, 'save'), 10, 3);


		// $this->get_driver('postmeta');

	}

	/**
	 * Save meta boxes
	 *
	 * @hook 'save_post'
	 */
	public function save($post_id, $post, $update) {

		if (current_user_can('edit_post', $post_id) && (!defined( 'DOING_AUTOSAVE' ) || !DOING_AUTOSAVE )) {

			$action = "karma_field-action";
			$nonce = "karma_field-nonce";

			if (isset($_REQUEST[$nonce]) && wp_verify_nonce($_POST[$nonce], $action)) {

				if (isset($_REQUEST['karma-fields-items']) && $_REQUEST['karma-fields-items']) {

					foreach ($_REQUEST['karma-fields-items'] as $encoded_input) {

						$encoded_input = stripslashes($encoded_input);
						$input = json_decode($encoded_input, true);

						if ($input) {

							foreach ($input as $driver_name => $data) {

								$driver = $this->get_driver($driver_name);

								// -> should verify permissions here

								if (method_exists($driver, 'update')) {

									$driver->update($data, array(), null, $this);

								}

							}

						}

					}

				}

			}

		}

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
		// register_rest_route('karma-fields/v1', '/get/(?P<driver>[^/]+)(?P<path>/.+)?/(?P<key>.+)', array(
		register_rest_route('karma-fields/v1', '/get/(?P<driver>[^/]+)/(?P<path>[^/]+)/(?P<key>.+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get')
			// 'args' => array(
			// 	'path' => array(
			// 		'required' => true
			// 	)
	    // )
		));

		register_rest_route('karma-fields/v1', '/update/(?P<driver>[^/]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'args' => array(
				'driver' => array(
					'required' => true
				),
				// 'key' => array(
				// 	'required' => true
				// ),
				'input' => array(
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

		register_rest_route('karma-fields/v1', '/autosave/(?P<driver>[^/]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_autosave')
		));

		register_rest_route('karma-fields/v1', '/autosave2/(?P<driver>[^/]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_autosave2')
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

		// $driver_name = $request->get_param('driver');
		// // $method = $request->get_param('method');
		//
		// $driver = $this->get_driver($driver_name);

		$params = $this->parse_request_object($request);
		$driver = $this->get_driver($params['driver']);

		// $params = $request->get_param('p');
		//
		// var_dump(json_decode($params));die();

		// $user_id = get_current_user_id();
		//
		// $file = "wp-content/karma-fields/users/{$driver_name}/change-{$user_id}.json";
		// $this->update_user_edit_file($file, '[]');

		if ($driver) {

			if (method_exists($driver, 'query')) {

				return $driver->query($params, $request, $this);

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

		// $driver_name = $request->get_param('driver');
		// $key = $request->get_param('key');
		// $driver = $this->get_driver($driver_name);



		$params = $this->parse_request_object($request);

		$driver = $this->get_driver($params['driver']);

		if ($driver) {

			if (method_exists($driver, 'fetch')) {


				return $driver->fetch($params['key'], $params, $request, $this);

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

		$user_id = get_current_user_id();
		$file = "wp-content/karma-fields/users/{$driver_name}/change-{$user_id}.json";
		$this->unset_to_file($file, array($driver_name, $uri, $key));


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

		$main_driver_name = $request->get_param('driver'); // -> needed for permissions check (multiusers)...
		// $fields = $request->get_param('output');

		$params = $request->get_params();

		$output = array();

		foreach ($params['input'] as $driver_name => $data) {

			$driver = $this->get_driver($driver_name);

			if (method_exists($driver, 'update')) {

				$driver->update($data, $output, $request, $this);



				// foreach ($data as $uri => $item) {
				//
				// 	$driver->update($item, $uri, $output, $request, $this);
				//
				// }

			} else {

				return "karma fields error: driver ($driver_name) has no method 'update'";

			}

		}

		$this->update_users($fields, $main_driver_name, $request);

		return $output;


		// if (method_exists($driver, 'update')) {
		//
		// 	$output = array();
		//
		// 	foreach ($fields as $uri => $item) {
		//
		// 		$driver->update($item, $uri, $output, $request, $this);
		//
		// 	}
		//
		// } else {
		//
		// 	return "karma fields error: driver has no method 'update'";
		//
		// }


		// if (method_exists($driver, 'query')) {
		//
		// 	return $driver->query($request, $this);
		//
		// } else {
		//
		// 	return "karma fields error: driver has no method 'query'";
		//
		// }




	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/add/{driver}'
	 */
	public function rest_add($request) {

		$driver_name = $request->get_param('driver');
		$fields = $request->get_param('fields');
		$params = $request->get_params();

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'add')) {

			return $driver->add($fields, $params, $request, $this);

		} else {

			return "karma fields error: driver has no method 'add'";

		}

	}

	// public function merge($obj1, $obj2) {
	// 	foreach ($obj2 as $key => $child2) {
	// 		if ($child2 && (is_object($child2) || is_array($child2))) {
	// 			if (empty($obj1[$key])) {
	// 				$obj1[$key] = array();
	// 			}
	// 		}
	// 		$this->merge($obj1[$key], $child2);
	// 	}
	// 	for (var i in object2) {
	// 		if (object2[i] && typeof object2[i] === "object" && !Array.isArray(object2[i])) {
	// 			if (!object1[i]) {
	// 				object1[i] = {};
	// 			}
	// 			this.merge(object1[i], object2[i], soft);
	// 		} else if (object2[i] !== undefined && (!soft || object1[i] === undefined)) {
	// 			object1[i] = this.clone(object2[i]);
	// 		}
	// 	}
	//
	//
	//
	// }



	/**
	 *	@rest 'wp-json/karma-fields/v1/autosave'
	 */
	public function rest_autosave($request) {

		$driver_name = $request->get_param('driver');

		$user_id = get_current_user_id();

		$save = array(
			'store' => $request->get_param('store'),
			'undos' => $request->get_param('undos'),
			'redos' => $request->get_param('redos'),
			'temp' => $request->get_param('temp')
		);

		$save = $this->clean_array($save);

		$path = "wp-content/karma-fields/users/{$driver_name}/state-{$user_id}.json";
		$this->update_user_edit_file($path, json_encode($save, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

		$path = "wp-content/karma-fields/users/{$driver_name}/change-{$user_id}.json";
		$user_edit = $this->get_user_edit_file($path);

		return json_decode($user_edit);

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/autosave'
	 */
	public function rest_autosave2($request) {

		$driver_name = $request->get_param('driver');

		$user_id = get_current_user_id();

		// $save = array(
		// 	'store' => $request->get_param('store'),
		// 	'undos' => $request->get_param('undos'),
		// 	'redos' => $request->get_param('redos'),
		// 	'temp' => $request->get_param('temp')
		// );

		$timestamp = time();



		$path = "wp-content/karma-fields/users/{$driver_name}/state-{$user_id}.json";
		$this->merge_object_to_file($path, array(
			$timestamp => $request->get_param('diff')
		));


		$path = "wp-content/karma-fields/users/{$driver_name}/change-{$user_id}.json";
		$user_edit = $this->get_user_edit_file($path);

		return json_decode($user_edit);

		// $save = $this->clean_array($save);
		//
		// $path = "wp-content/karma-fields/users/{$driver_name}/state-{$user_id}.json";
		// $this->update_user_edit_file($path, json_encode($save, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
		//
		// $path = "wp-content/karma-fields/users/{$driver_name}/change-{$user_id}.json";
		// $user_edit = $this->get_user_edit_file($path);
		//
		// return json_decode($user_edit);

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
	public function get_driver($driver_name) {



		if (isset($this->drivers[$driver_name])) {

			// var_dump($this->drivers[$driver_name]['path'], file_exists($this->drivers[$driver_name]['path']));
			// die();

			require_once $this->drivers[$driver_name]['path'];



			$driver = new $this->drivers[$driver_name]['class'];
			$driver->name = $driver_name;

			return $driver;

		}

	}


	/**
	 *	get_cachefile
	 */
	public function get_cachefile($driver_name, $key) {

		if (method_exists($driver, 'get_cachefile')) {

			return $driver->get_cachefile($key);

		} // else -> no cache

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



	/** DEPRECATED
	 *	print_table
	 */
	public function print_grid_compat($args) {
		static $id = 0;

		$id++;

		$this->prepare($args);

		$user_id = get_current_user_id();

		$driver = $args['driver'];


		// $path = "wp-content/karma-fields/users/{$driver}/state-{$user_id}.json";
		//
		// $save = $this->get_user_edit_file($path, '{}');


		include plugin_dir_path(__FILE__) . 'includes/table.php';

	}

	/** DEPRECATED
	 *	print_field
	 */
	public function print_field_compat($id, $args) {
		static $index = 0;

		$index++;

		include plugin_dir_path(__FILE__) . 'includes/fields.php';

	}

	/**
	 *	@hook karma_field
	 */
	public function print_field($args) {
		static $index = 0;

		$index++;

		include plugin_dir_path(__FILE__) . 'includes/field.php';

	}



	/**
	 * @hook 'wp_login'
	 */
	public function user_login($user_login, $user) {

		update_user_meta($user->ID, 'karma_logedin', '1');

	}

	/**
	 * @hook 'wp_logout'
	 */
	public function user_logout($user_id) {

		update_user_meta($user_id, 'karma_logedin', '');

	}



	/**
	 *	parse_object
	 */
	public function parse_param($path, $value, &$results) {

		$key = array_shift($path);

		if (count($path)) {

			if (empty($results[$key])) {

				$results[$key] = array();

			}

			$this->parse_param($path, $value, $results[$key]);

		} else {

			$results[$key] = $value;

		}

	}

	/**
	 *	parse_object
	 */
	public function parse_query_object($object) {

		$results = array();

		foreach ($object as $key => $value) {

			$path = explode('/', $key);

			$this->parse_param($path, $value, $results);

		}

		return $results;
	}

	/**
	 *	parse_object
	 */
	public function parse_request_object($request) {

		$params = $request->get_params();

		return $this->parse_query_object($params);

	}



	/**
	 *	parse_object
	 */
	public function parse_object($obj) {

		$paths = array();

		foreach ($obj as $key => $child) {

			if (is_array($child) || is_object($child)) {

				$child_paths = $this->parse_object($child);

				foreach ($child_paths as &$child_path) {

					array_unshift($child_path, $key);

				}

				$paths = array_merge($paths, $child_paths);

			} else {

				$paths[] = array($key);
			}

		}

		return $paths;
	}


	/**
	 *	update_users
	 */
	// public function clean_object(&$obj) {
	//
	// 	foreach ($obj as $key => $child) {
	//
	// 		if (is_array($child) || is_object($child)) {
	//
	// 			if (empty($child)) {
	//
	// 				unset($obj[$key]);
	//
	// 			} else {
	//
	// 				$this->clean_object($child);
	//
	// 			}
	//
	// 		} else if (!isset($child)) {
	//
	// 			unset($obj[$key]);
	//
	// 		}
	//
	// 	}
	//
	// }

	// /**
	//  *	clean_array
	//  */
	// public function clean_array($obj) {
	//
	// 	$clone = array();
	//
	// 	foreach ($obj as $key => $child) {
	//
	// 		if (!empty($child)) {
	//
	// 			if (is_array($child)) {
	//
	// 				$clone[$key] = $this->clean_array($child);
	//
	// 			} else if ($child !== null) {
	//
	// 				$clone[$key] = $child;
	//
	// 			}
	//
	// 		}
	//
	//
	// 	}
	//
	// 	return $clone;
	// }

	/**
	 *	clean_array
	 */
	public function clean_array($obj) {

		$clone = array();

		foreach ($obj as $key => $child) {

			if (is_array($child)) {

				$child = $this->clean_array($child);

				if (!empty($child)) {

					$clone[$key] = $child;

				}

			} else if ($child !== null) {

				$clone[$key] = $child;

			}

		}

		return $clone;
	}



	/**
	 *	pad_object
	 */
	public function pad_object($obj, $value = 0) {

		$paths = array();

		foreach ($obj as $key => $child) {

			if (is_array($child) || is_object($child)) {

				$paths[$key] = $this->pad_object($child, $value);

			} else {

				$paths[$key] = $value;
			}

		}

		return $paths;
	}


	/**
	 *	merge_object_deep
	 */
	// public function merge_object_deep(&$array1, $array2) {
	//
	//   foreach ($array2 as $key => $value) {
	//
	//     if (is_array($value) && isset($array1[$key]) && is_array($array1[$key])) {
	//
	//       $this->merge_object_deep($array1[$key], $value);
	//
	//     } else {
	//
	//       $array1[$key] = $value;
	//
	//     }
	//
	//   }
	//
	// }

	/**
	 *	merge_object_deep
	 */
	public function merge_object_deep(&$array1, $array2) {

		if (is_array($array2)) {

			if (!is_array($array1)) {

				$array1 = array();

			}

		  foreach ($array2 as $key => $value) {

				$this->merge_object_deep($array1[$key], $value);

		  }

		} else {

			$array1 = $array2;

		}

	}


	/**
	 *	set_value_deep
	 */
	public function set_value_deep(&$array, $keys, $value) {

		if (isset($keys[0])) {

			$key = $keys[0];

			if (isset($keys[1])) {

				if (empty($array[$key]) || !is_array($array[$key])) {

					$array[$key] = array();

				}

				$this->set_value_deep($array[$key], array_slice($keys, 1), $value);

			} else {

				$array[$key] = $value;

			}

		}

	}

	/**
	 *	unset_value_deep
	 */
	public function unset_value_deep(&$array, $keys) {




		if (isset($keys[0])) {

			$key = $keys[0];

			if (isset($keys[1])) {

				if (isset($array[$key]) && is_array($array[$key])) {

					$this->unset_value_deep($array[$key], array_slice($keys, 1));

				}

			} else if (isset($array[$key])) {

				unset($array[$key]);

			}

		}

	}

	// /**
	//  *	merge_object_deep
	//  */
	// public function merge_object_deep($array1, $array2) {
	//
	// 	$clone = array();
	//
	//   foreach ($array2 as $key => $value) {
	//
	//     if (is_array($value) && isset($array1[$key]) && is_array($array1[$key])) {
	//
	//       $clone[$key] = $this->merge_object_deep($array1[$key], $value);
	//
	//     } else {
	//
	//       $clone[$key] = $value;
	//
	//     }
	//
	//   }
	//
	// 	return $clone;
	//
	// }

	/**
	 *	update_users
	 */
	public function update_users($fields, $driver_name, $request) {

		$user_id = get_current_user_id();

		$users = get_users(array(
			'meta_key' => 'karma_logedin',
			'meta_value' => '1',
			'exclude' => array($user_id)
		));

		$items = $this->pad_object($fields, $user_id);

		foreach ($users as $user) {


			$file = "wp-content/karma-fields/users/{$driver_name}/change-{$user->ID}.json";

			$this->merge_object_to_file($file, $items);

		}

	}



	/**
	 * deprecated... json file no longer directly fetched
	 *
	 * @hook 'parse_request'
	 */
	public function parse_request($wp) {

		$user_id = get_current_user_id();
		$file = 'wp-content/karma-fields/users/change-'.$user_id.'.json';

		if ($wp->request === $file) {

			$this->update_user_edit_file($file, '[]');

			echo '[]';

			exit;

		}

	}

	/**
	 * update_user_edit
	 */
	public function update_user_edit_file($path, $value) {

		$file = ABSPATH.$path;

		if (!file_exists(dirname($file))) {

			mkdir(dirname($file), 0777, true);

		}

		file_put_contents($file, $value);

	}

	/**
	 * get_user_edit
	 */
	public function get_user_edit_file($path, $default = '[]') {

		$file = ABSPATH.$path;


		if (file_exists($file)) {

			return file_get_contents($file);

		}

		return $default;

	}

	/**
	 * merge_object
	 */
	public function merge_object_to_file($path, $value) {

		$content = $this->get_user_edit_file($path, '{}');

		$current = json_decode($content, JSON_OBJECT_AS_ARRAY);

		$this->merge_object_deep($current, $value);

		$current = $this->clean_array($current);

		$content = json_encode($current, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);

		$this->update_user_edit_file($path, $content);

	}

	/**
	 * merge_object
	 */
	public function set_value_to_file($path, $keys, $value) {

		$content = $this->get_user_edit_file($path, '[]');

		$current = json_decode($content, JSON_OBJECT_AS_ARRAY);

		$this->set_value_deep($current, $keys, $value);

		$content = json_encode($current, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

		$this->update_user_edit_file($path, $content);

	}

	/**
	 * merge_object
	 */
	public function unset_to_file($path, $keys) {

		$content = $this->get_user_edit_file($path, '[]');

		$current = json_decode($content, JSON_OBJECT_AS_ARRAY);

		$this->unset_value_deep($current, $keys);

		$current = $this->clean_array($current);

		$content = json_encode($current, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

		$this->update_user_edit_file($path, $content);

	}







}

global $karma_fields;
$karma_fields = new Karma_Tables;
