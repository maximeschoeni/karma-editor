<?php



Class Karma_Tables {

	public $version = '11';

	public $middlewares = array();
	public $drivers = array();
	public $keys = array();

	/**
	 *	constructor
	 */
	public function __construct() {

		add_action('init', array($this, 'init'));

		add_action('rest_api_init', array($this, 'rest_api_init'));

		if (is_admin()) {

			add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));

			// add_action('karma_field_print_grid', array($this, 'print_grid_compat'));
			// add_action('karma_fields_print_field', array($this, 'print_field_compat'), 10, 2);

			add_action('karma_fields_print_field', array($this, 'print_field'));


			add_action('admin_head', array($this, 'print_footer'));

		}


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

			wp_enqueue_style('karma-fields-styles', $plugin_url . '/css/karma-fields.css');

			wp_enqueue_media();


			// var_dump($plugin_path.'/js/all.min.js', file_exists($plugin_path));
			// die('asdf');

			if (false && file_exists($plugin_path.'/js/all.min.js')) {

				wp_enqueue_script('karma-fields', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-fields', $plugin_url . '/js/all.js', array('karma-fields'), $this->version, true);

			} else {



				wp_enqueue_script('karma-fields-media', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields', $plugin_url . '/js/karma-fields.js', array(), $this->version, true); // -> extensions must comme after this!

				wp_enqueue_script('karma-build', $plugin_url . '/js/build-v7.1.2.js', array('karma-fields-media'), $this->version, true);
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
				wp_enqueue_script('karma-field-header', $plugin_url . '/js/fields/header.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-search', $plugin_url . '/js/fields/search.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-array', $plugin_url . '/js/fields/array.js', array('karma-fields-media'), $this->version, true);

				wp_enqueue_script('karma-field-textinput-datalist', $plugin_url . '/js/fields/textinput-datalist.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-field-table', $plugin_url . '/js/fields/table.js', array('karma-fields-media'), $this->version, true);


				// tables
				// wp_enqueue_script('karma-table-grid', $plugin_url . '/js/tables/grid.js', array('karma-fields-media'), $this->version, true);
				// wp_enqueue_script('karma-table-pagination', $plugin_url . '/js/tables/pagination.js', array('karma-fields-media'), $this->version, true);
				// wp_enqueue_script('karma-table-footer', $plugin_url . '/js/tables/footer.js', array('karma-fields-media'), $this->version, true);

				// utils
				wp_enqueue_script('karma-select-grid', $plugin_url . '/js/grid-select.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-utils-rect', $plugin_url . '/js/utils/rect.js', array('karma-fields-media'), $this->version, true);
				// wp_enqueue_script('karma-utils-object', $plugin_url . '/js/utils/object.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-transfer', $plugin_url . '/js/transfer-manager.js', array('karma-fields-media'), $this->version, true);
				// wp_enqueue_script('karma-caster', $plugin_url . '/js/utils/caster.js', array('karma-fields-media'), $this->version, true);

				// includes
				wp_enqueue_script('karma-includes-icon', $plugin_url . '/js/includes/icon.js', array('karma-fields-media'), $this->version, true);

				// managers
				wp_enqueue_script('karma-manager-history', $plugin_url . '/js/managers/history.js', array('karma-fields-media'), $this->version, true);
				wp_enqueue_script('karma-manager-field', $plugin_url . '/js/managers/field.js', array('karma-fields-media'), $this->version, true);
				// wp_enqueue_script('table-manager', $plugin_url . '/js/managers/table-manager.js', array('karma-fields-media', 'karma-manager-history'), $this->version, true);
				// wp_enqueue_script('field-manager', $plugin_url . '/js/managers/field-manager.js', array('karma-fields-media', 'karma-manager-history'), $this->version, true);

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

		$this->register_driver(
			'posts',
			KARMA_FIELDS_PATH.'/drivers/driver-posts.php',
			'Karma_Fields_Driver_Posts'
		);
		// $this->register_driver(
		// 	'postmeta',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta.php',
		// 	'Karma_Fields_Driver_Postmeta'
		// );
		// $this->register_driver(
		// 	'postmetaobject',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-object.php',
		// 	'Karma_Fields_Driver_Postmeta_Object'
		// );
		// $this->register_driver(
		// 	'postmetafile',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-file.php',
		// 	'Karma_Fields_Driver_Postmeta_File'
		// );
		// $this->register_driver(
		// 	'postmetafiles',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-files.php',
		// 	'Karma_Fields_Driver_Postmeta_Files'
		// );
		// $this->register_driver(
		// 	'taxonomy',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-taxonomy.php',
		// 	'Karma_Fields_Driver_Taxonomy'
		// );

		add_action('save_post', array($this, 'save'), 10, 3);

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

									$driver->update($data);

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

		register_rest_route('karma-fields/v1', '/get/(?P<driver>[^/]+)/(?P<path>[^/]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'path' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/update/(?P<driver>[^/]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'data' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/add/(?P<driver>[^/]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_add'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'data' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/fetch/(?P<driver>[^/]+)/(?P<request>[^/]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_fetch'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'request' => array(
					'required' => true
				)
	    )
		));

	}


	/**
	 *	@rest 'wp-json/karma-fields/v1/filter/[object]/[filter]'
	 */
	public function rest_fetch($request) {

		$driver_name = $request->get_param('driver');

		$request_name = $request->get_param('request');
		$params = $request->get_params();
		$header = $this->parse_query_object($params);

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'fetch')) {

				return $driver->fetch($request_name, $header);

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
		$path = $request->get_param('path');

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'get')) {

				return $driver->get($path);

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

		$driver_name = $request->get_param('driver');
		$data = $request->get_param('data');

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'update')) {

				return $driver->update($data);

			} else {

				return "karma fields error: driver ($driver_name) has no method 'update'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/add/{driver}'
	 */
	public function rest_add($request) {

		$driver_name = $request->get_param('driver');
		$data = $request->get_param('data');

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'add')) {

			return $driver->add($data);

		} else {

			return "karma fields error: driver has no method 'add'";

		}

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

			require_once $this->drivers[$driver_name]['path'];

			$driver = new $this->drivers[$driver_name]['class'];
			$driver->name = $driver_name;

			return $driver;

		}

	}


	/**
	 *	@hook karma_editor_fields
	 */
	public function print_field($args) {
		static $index = 0;

		$index++;

		include plugin_dir_path(__FILE__) . 'includes/table.php';

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





}

global $karma_fields;
$karma_fields = new Karma_Tables;
