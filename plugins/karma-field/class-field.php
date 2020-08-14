<?php


Class Karma_Field {

	var $version = '6';

	/**
	 * sectins array
	 */
	var $sections = array();

	/**
	 *	constructor
	 */
	public function __construct() {

		// echo '<pre>';
		// print_r(get_option('rewrite_rules'));
		// die();

		require_once dirname(__FILE__) . '/multilanguage.php';

		add_action('init', array($this, 'init'));

		// add_action('rest_api_init', array($this, 'rest_api_init'));

		// disable check for empty post in wp_insert_post





		if (is_admin()) {

			add_action('karma_field', array($this, 'print_field'), 10, 4);
			add_action('karma_field_group', array($this, 'print_field_group'), 10, 3);

			add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));
			add_action('wp_ajax_karma_multimedia_get_image_src', array($this, 'ajax_get_image_src'));

			add_action('wp_ajax_karma_field_get_terms', array($this, 'ajax_get_terms'));
			// add_action('wp_ajax_karma_field_query_posts', array($this, 'ajax_query_posts'));


			add_action('karma_fields', array($this, 'print_field'), 10, 4);


			// add_action('admin_footer', array($this, 'print_footer'));
			// add_action('admin_head', array($this, 'print_footer'));
		}



	}



	/**
	 * @hook init
	 */
	public function init() {

		add_action('save_post', array($this, 'save'), 10, 3);

		// do_action('karma_fields_init', $this);

		// if (is_admin()) {
		//
		// 	add_action('add_meta_boxes', array($this, 'meta_boxes'), 10, 2);
		//
		// }

		// add_action('karma_cache', array($this, 'cache_sections'), 10, 2);

	}


	/**
	 * Hook for 'admin_enqueue_scripts'
	 */
	public function enqueue_styles() {

		wp_enqueue_style('date-field-styles', KARMA_FIELD_URL . '/css/date-field.css');
		wp_enqueue_style('media-field-styles', KARMA_FIELD_URL . '/css/media-field.css');
		wp_enqueue_style('multimedia-styles', KARMA_FIELD_URL . '/css/multimedia.css');

		wp_register_script('build', KARMA_FIELD_URL . '/js/build-v2.js', array(), $this->version, false);
		wp_register_script('calendar', KARMA_FIELD_URL . '/js/calendar.js', array(), $this->version, false);
		wp_register_script('ajax', KARMA_FIELD_URL . '/js/ajax-v2.js', array(), $this->version, false);
		wp_register_script('sortable', KARMA_FIELD_URL . '/js/sortable.js', array(), $this->version, false);

		wp_enqueue_script('media-field', KARMA_FIELD_URL . '/js/media.js', array('ajax', 'build'), $this->version, false);
		wp_localize_script('media-field', 'KarmaFieldMedia', array(
			'ajax_url' => admin_url('admin-ajax.php')
		));

		// v1
		wp_enqueue_script('date-field', KARMA_FIELD_URL . '/js/date-field-v2.js', array('media-field', 'build', 'calendar'), $this->version, false);

		// v2
		// wp_enqueue_script('date-field', KARMA_FIELD_URL . '/js/fields/date.js', array('media-field', 'build', 'calendar'), $this->version, false);

		wp_enqueue_script('multimedia-field', KARMA_FIELD_URL . '/js/multimedia.js', array('build', 'sortable', 'media-field'), $this->version, false);

	}
	//
	// /**
	//  * @hook admin_footer
	//  */
	// public function print_footer() {
	// 	global $karma_cache;
	//
	// 	$karma_fields = array(
	// 		'ajax_url' => admin_url('admin-ajax.php'),
	// 		'queryPostURL' => rest_url().'karma-fields/v1/get',
	// 		'savePostURL' => rest_url().'karma-fields/v1/update',
	// 		'queryTermsURL' => rest_url().'karma-fields/v1/taxonomy',
	// 	);
	//
	// 	if (isset($karma_cache)) {
	//
	// 		$karma_fields['queryPostURL'] = home_url().'/'.$karma_cache->path;
	//
	// 	}
	//
	// 	echo '<script>KarmaFields = '.json_encode($karma_fields).';</script>';
	//
	// }

	/**
	 * @ajax karma_multimedia_get_image_src
	 */
	public function ajax_get_image_src() {

		if (isset($_GET['id'])) {

			$id = intval($_GET['id']);
			// $post = get_post($id);
			$src_data = wp_get_attachment_image_src($id, 'thumbnail', true);
			$filename = basename(get_attached_file($id));

			echo json_encode(array(
				'filename' => $filename,
				'url' => $src_data[0],
				'width' => $src_data[1],
				'height' => $src_data[2]
			));

		} else {

			trigger_error('id not set');

		}

		exit;

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

			if (isset($_REQUEST['karma-fields'], $_REQUEST[$nonce]) && wp_verify_nonce($_POST[$nonce], $action)) {

				$meta_keys = $_REQUEST['karma-fields'];

				foreach ($meta_keys as $meta_key) {

					$field = $_REQUEST['karma_field_type'][$meta_key];
					$datatype = isset($_REQUEST['karma_field_datatype'][$meta_key]) ? $_REQUEST['karma_field_datatype'][$meta_key] : 'string';
					$name = "karma_field-$meta_key";

					$value = isset($_REQUEST[$name]) ? $_REQUEST[$name] : '';



					if ($datatype === 'json' && $value) {

						$value = stripslashes($value);
						$value = json_decode($value);

					}

					$value = apply_filters('karma_field_save', $value, $post, $meta_key, $field);

					if ($field === 'taxonomy' && isset($_REQUEST['karma_field_taxonomy'][$meta_key]) && !is_null($value)) {

						$taxonomy = $_REQUEST['karma_field_taxonomy'][$meta_key];

						wp_set_object_terms($post_id, $value, $taxonomy);

					}



					if ($field === 'checkbox') {

						if ($value) {

							update_post_meta($post_id, $meta_key, $value);

						} else {

							delete_post_meta($post_id, $meta_key);

						}

					} else if (!is_null($value)) {

						update_post_meta($post_id, $meta_key, $value);

					}

				}

			}

		}

	}

	/**
	 * get_post_term_ids
	 */
	public function get_post_term_ids($post, $taxonomy) {

		$terms = get_the_terms($post, $taxonomy);
		$term_ids = array();

		if ($terms && !is_wp_error($terms)) {

			foreach ($terms as $term) {

				$term_ids[] = $term->term_id;

			}

		}

		return $term_ids;
	}

	/**
	 * @hook 'karma_field'
	 */
	public function generate_key() {
		static $index = 1;

		return 'custom_meta_field_'.($index++);
	}
	/**
	 * @hook 'karma_field'
	 */
	public function print_field($post, $args = array()) {

		$args = apply_filters('karma_field_args', $args, $post);

		$field = isset($args['field']) ? $args['field'] : 'text';

		if ($field === 'group') {

			$fields = $args['fields'];

			$display = isset($args['display']) ? $args['display'] : 'block';

			include dirname(__FILE__) . "/includes/fields-group.php";

		} else {

			if ($field === 'taxonomy' && isset($args['taxonomy'])) {

				$meta_key = 'taxonomy-'.$args['taxonomy'];

				$value = $this->get_post_term_ids($post, $args['taxonomy']);

			} else {

				$meta_key = isset($args['meta_key']) ? $args['meta_key'] : $this->generate_key();

				$value = get_post_meta($post->ID, $meta_key, true);

			}

			include_once dirname(__FILE__) . '/includes/field-nonce.php';
			include dirname(__FILE__) . '/includes/field-hidden.php';

			if (isset($args['placeholder'])) {

				$args['placeholder'] = apply_filters('sublanguage_untranslated_meta', $args['placeholder'], $args['meta_key'], $post);

			}

			$value = apply_filters('karma_field_input', $value, $post, $meta_key, $field, $args);

			include dirname(__FILE__) . "/includes/field-$field.php";

		}

	}

	/**
	 * @hook 'karma_field_group'
	 */
	public function print_field_group($post, $args) {

		$args['field'] = 'group';

		$this->print_field($post, $args);

		// $fields = $args['fields'];
		// $display = isset($args['display']) ? $args['display'] : 'block';
		//
		// include dirname(__FILE__) . "/includes/fields-group.php";

	}

	/**
	 * @ajax karma_field_get_terms
	 */
	public function ajax_get_terms() {

		$output = array();

		if (isset($_GET['taxonomy'])) {

			$terms = get_terms(array(
				'taxonomy' => esc_attr($_GET['taxonomy']),
				'count' => true,
				'hide_empty' => false
			));

			if ($terms) {

				if (is_wp_error($terms)) {

					$output['error'] = 'taxonomy not exist';

				} else {

					$output['terms'] = $terms;

				}

			} else {

				$output['terms'] = array();

			}

		} else {

			$output['error'] = 'taxonomy not set';

		}

		echo json_encode($output);
		exit;

	}




	//
	//
	//
	//
	// /**
	//  *	@hook 'rest_api_init'
	//  */
	// public function rest_api_init() {
	//
	// 	register_rest_route('karma-fields/v1', '/update/(?P<path>.*$)', array(
	// 		'methods' => 'POST',
	// 		'callback' => array($this, 'rest_save_post'),
	// 		'args' => array(
	// 			'path' => array(
	// 				'required' => true
	// 			),
	// 			'value' => array(
	// 				'required' => true
	// 			)
	//     )
	// 	));
	//
	// 	register_rest_route('karma-fields/v1', '/get/(?P<path>.*$)', array(
	// 		'methods' => 'GET',
	// 		'callback' => array($this, 'rest_get_post'),
	// 		'args' => array(
	// 			'path' => array(
	// 				'required' => true
	// 			)
	//     )
	// 	));
	//
	// 	register_rest_route('karma-fields/v1', '/taxonomy/(?P<taxonomy>[^/]+)', array(
	// 		'methods' => 'GET',
	// 		'callback' => array($this, 'rest_get_terms'),
	// 		'args' => array(
	// 			'taxonomy' => array(
	// 				'required' => true
	// 			)
	//     )
	// 	));
	//
	// }
	//
	//
	//
	// /**
	//  *	@rest 'wp-json/karma-fields/v1/update/'
	//  */
	// public function rest_save_post($request) {
	//
	// 	$path = $request->get_param('path');
	// 	$value = $request->get_param('value');
	//
	// 	$post_uri = dirname($path);
	// 	$filename = basename($path);
	// 	$key = pathinfo($filename, PATHINFO_FILENAME);
	//
	// 	$post_id = apply_filters('karma_fields_parse_uri', $post_uri);
	//
	// 	$post = get_post($post_id);
	//
	// 	if (!$post) {
	//
	// 		return 'error post not exits';
	//
	// 	}
	//
	// 	$sections = $this->get_sections();
	// 	$sections = $this->filter_fields($sections, 'post_type', $post->post_type);
	//
	// 	$field = $this->find_field($sections, 'key', $key);
	//
	// 	if (!$field) {
	//
	// 		return 'error field not exits';
	//
	// 	}
	//
	// 	$field = $this->format_field($field, false);
	//
	// 	$this->save_field($field, $post, $value);
	//
	// 	return $this->get_value($field, $post);
	//
	// }
	//
	// /**
	//  *	@rest 'wp-json/karma-fields/v1/get/'
	//  */
	// public function rest_get_post($request) {
	//
	// 	$path = $request->get_param('path');
	//
	// 	$post_uri = dirname($path);
	// 	$filename = basename($path);
	// 	$key = pathinfo($filename, PATHINFO_FILENAME);
	//
	// 	$post_id = apply_filters('karma_fields_parse_uri', $post_uri);
	//
	// 	$post = get_post($id);
	//
	// 	if (!$post) {
	//
	// 		return 'error post not exits';
	//
	// 	}
	//
	// 	$sections = $this->get_sections();
	// 	$sections = $this->filter_fields($sections, 'post_type', $post->post_type);
	//
	// 	$field = $this->find_field($sections, 'key', $key);
	//
	// 	if (!$field) {
	//
	// 		return 'error field not exits';
	//
	// 	}
	//
	// 	// do_action('karma_fields_query', $request, $field, $post);
	//
	// 	$field = $this->format_field($field, false);
	//
	// 	$value = $this->get_value($field, $post);
	//
	// 	return $value;
	//
	// }
	//
	// /**
	//  *	@rest 'wp-json/karma-fields/v1/update/'
	//  */
	// public function rest_get_terms($request) {
	//
	// 	$taxonomy = $request->get_param('taxonomy');
	//
	// 	$terms = get_terms(array(
	// 		'taxonomy' => $taxonomy,
	// 		'count' => true,
	// 		'hide_empty' => false
	// 	));
	//
	// 	if ($terms) {
	//
	// 		return $terms;
	//
	// 	} else {
	//
	// 		return array();
	//
	// 	}
	//
	// }
	//
	// /**
	//  * @hook karma_cache
	//  */
	// public function cache_sections($post, $cache) {
	//
	// 	$sections = $this->get_sections();
	// 	$sections = $this->filter_fields($sections, 'post_type', $post->post_type);
	//
	// 	$this->cache_fields($sections, $post, $cache);
	//
	// }
	//
	// /**
	//  * register_fields
	//  */
	// public function cache_fields($fields, $post, $cache) {
	//
	// 	foreach ($fields as $field) {
	//
	// 		$this->cache_field($field, $post, $cache);
	//
	// 	}
	//
	// }
	//
	// /**
	//  * register_fields
	//  */
	// public function cache_field($field, $post, $cache) {
	//
	// 	$field = $this->format_field($field);
	//
	// 	if (isset($field['key'], $field['object'], $field['extension']) && $field['key'] && $field['extension'] && $field['object'] && empty($field['private'])) {
	//
	// 		$value = $this->get_value($field, $post);
	//
	// 		$cache->update($post, $field['key'].$field['extension'], $value);
	//
	// 	}
	//
	// 	if (isset($field['children']) && $field['children']) {
	//
	// 		$this->cache_fields($field['children'], $post, $cache);
	//
	// 	}
	//
	// }
	//
	// /**
	//  * get field value
	//  */
	// public function get_value($field, $post) {
	//
	// 	if ($field['object'] === 'postmeta') {
	//
	// 		$single = empty($field['multi']);
	//
	// 		$value = get_post_meta($post->ID, $field['key'], $single);
	//
	// 		// if ($field['extension'] === '.json' && !$value) {
	// 		//
	// 		// 	$value = array();
	// 		//
	// 		// }
	//
	// 	} else if ($field['object'] === 'postfield') {
	//
	// 		$post_field = $field['key'];
	//
	// 		$value = apply_filters('sublanguage_translate_post_field', $post->$post_field, $post, $post_field);
	//
	// 	} else if ($field['object'] === 'terms') {
	//
	// 		$value = $this->get_the_terms($post, $field['key']);
	//
	// 	} else if ($field['object'] === 'term') {
	//
	// 		$value = $this->get_the_terms($post, $field['key']);
	//
	// 		$value = $value ? $value[0] : '';
	//
	// 	} else {
	//
	// 		$value = '';
	//
	// 	}
	//
	// 	return apply_filters("karma_field-{$field['field']}-value", $value, $field, $post);
	// }
	//
	// /**
	//  * get field value
	//  */
	// public function save_field($field, $post, $value) {
	//
	// 	$args = array();
	//
	// 	if (isset($field['object'])) {
	//
	// 		if ($field['object'] === 'postmeta') {
	//
	// 			if (isset($field['multi']) && $field['multi'] && is_array($value)) {
	//
	// 				$this->update_multi_postmeta($post_id, $field['key'], $value);
	//
	// 			} else {
	//
	// 				$args['meta_input'][$field['key']] = $value;
	//
	// 			}
	//
	// 		} else if ($field['object'] === 'postfield') {
	//
	// 			$args[$field['key']] = $value;
	//
	// 		} else if ($field['object'] === 'terms') {
	//
	//
	// 			// if (!is_array($value)) {
	// 			//
	// 			// 	$value = $value ? array($value) : array();
	// 			//
	// 			// }
	//
	// 			$value = array_filter(array_map('intval', $value));
	//
	// 			// $args['tax_input'][$field['key']] = $value;
	//
	// 			wp_set_object_terms($post->ID, $value, $field['key']);
	//
	// 		} else if ($field['object'] === 'term') {
	//
	// 			$value = $value ? array(intval($value)) : array();
	//
	// 			// $args['tax_input'][$field['key']] = array_filter(array_map('intval', $value));
	//
	// 			wp_set_object_terms($post->ID, $value, $field['key']);
	//
	// 		}
	//
	// 		$args['ID'] = $post->ID;
	//
	// 		add_filter('wp_insert_post_empty_content', '__return_false', 10, 2);
	//
	// 		wp_update_post($args);
	//
	// 	}
	//
	//
	//
	//
	//
	// 	// if ($args) {
	// 	//
	// 	// 	$args['ID'] = $post->ID;
	// 	//
	// 	// 	return wp_update_post($args);
	// 	//
	// 	// } else {
	// 	//
	// 	// 	return 'error: no arguments to save';
	// 	//
	// 	// }
	//
	// }
	//
	// /**
	//  * update post meta multiple
	//  */
	// public function update_multi_postmeta($post_id, $key, $values) {
	//
	// 	$previous = get_post_meta($post_id, $key);
	//
	// 	$to_remove = array_diff($previous, $value);
	// 	$to_add = array_diff($value, $previous);
	//
	// 	foreach ($to_remove as $value_to_remove) {
	//
	// 		delete_post_meta($post_id, $key, $value_to_remove);
	//
	// 	}
	//
	// 	foreach ($to_add as $value_to_add) {
	//
	// 		add_post_meta($post_id, $key, $value_to_add);
	//
	// 	}
	//
	// }
	//
	// /**
	//  * get field value
	//  */
	// public function get_the_terms($post, $taxonomy) {
	//
	// 	$terms = get_the_terms($post, $taxonomy);
	//
	// 	$value = array();
	//
	// 	if ($terms && !is_wp_error($terms)) {
	//
	// 		foreach ($terms as $term) {
	//
	// 			$value[] = array(
	// 				'id' => $term->term_id,
	// 				'slug' => $term->slug,
	// 				'name' => $term->name,
	// 				'description' => $term->description
	// 			);
	//
	// 		}
	//
	// 	}
	//
	// 	return $value;
	// }
	//
	//
	// /**
	//  * format_fields
	//  */
	// public function format_fields($fields) {
	//
	// 	$formated_fields = array();
	//
	// 	foreach ($fields as $field) {
	//
	// 		$formated_fields[] = $this->format_field($field);
	//
	// 	}
	//
	// 	return $formated_fields;
	// }
	//
	// /**
	//  * format_fields
	//  */
	// public function format_field($field, $recursively = true) {
	//
	// 	if (empty($field['field'])) {
	//
	// 		$field['field'] = 'group';
	//
	// 	}
	//
	// 	if ($field['field'] === 'taxonomy' && empty($field['object'])) {
	//
	// 		$field['object'] = 'terms';
	//
	// 	}
	//
	// 	if (empty($field['extension'])) {
	//
	// 		switch ($field['field']) {
	//
	// 			case 'text':
	// 			case 'checkbox':
	// 			case 'date':
	// 			case 'image':
	// 			case 'radio':
	// 			case 'select':
	// 			case 'relation':
	// 				$field['extension'] = '.txt';
	// 				break;
	//
	// 			// case 'taxonomy':
	// 			// 	$field['extension'] = $field['object'] === 'term' ? '.txt' : '.json';
	// 			// 	break;
	//
	// 			case 'richtext':
	// 				$field['extension'] = '.html';
	// 				break;
	//
	// 			default: // taxonomy, data-array, checkboxes...
	// 				$field['extension'] = '.json';
	// 				break;
	//
	// 		}
	//
	// 	}
	//
	// 	if (isset($field['children']) && $recursively) {
	//
	// 		$field['children'] = $this->format_fields($field['children']);
	//
	// 	}
	//
	// 	return apply_filters('karma_fields_format_field', $field);
	// }
	//
	// /**
	//  * @hook add_meta_boxes
	//  */
	// public function get_sections() {
	// 	static $sections;
	//
	// 	if (!isset($sections)) {
	//
	// 		$sections = apply_filters('karma_fields_sections', array(), $this);
	//
	// 	}
	//
	// 	return $sections;
	// }
	//
	// /**
	//  * @hook add_meta_boxes
	//  */
	// public function find_field($fields, $key, $value, $recursively = true) {
	//
	// 	foreach ($fields as $field) {
	//
	// 		if (isset($field[$key]) && $field[$key] === $value) {
	//
	// 			return $field;
	//
	// 		} else if ($recursively && isset($field['children'])) {
	//
	// 			return $this->find_field($field['children'], $key, $value);
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// /**
	//  * filter fields
	//  */
	// public function filter_fields($fields, $key, $value) {
	//
	// 	$filtered_fields = array();
	//
	// 	foreach ($fields as $field) {
	//
	// 		if (isset($field[$key]) && ($field[$key] === $value || is_array($field[$key]) && in_array($value, $field[$key]))) {
	//
	// 			$filtered_fields[] = $field;
	//
	// 		}
	//
	// 	}
	//
	// 	return $filtered_fields;
	// }
	//
	// /**
	//  * @hook add_meta_boxes
	//  */
	// public function meta_boxes($post_type, $post) {
	//
	// 	$sections = $this->get_sections();
	//
	// 	$sections = $this->filter_fields($sections, 'post_type', $post_type);
	//
	// 	$sections = $this->format_fields($sections);
	//
	//
	// 	foreach ($sections as $i => $section) {
	//
	// 		if (isset($section['post_type'])) {
	//
	// 			$label = isset($section['label']) ? $section['label'] : 'Karma Fields';
	// 			$context = isset($section['context']) ? $section['context'] : 'normal';
	// 			$priority = isset($section['priority']) ? $section['priority'] : 'default';
	//
	// 			add_meta_box(
	// 				'karma-fields-'.$i,
	// 				$label,
	// 				array($this, 'add_meta_box'),
	// 				$section['post_type'],
	// 				$context,
	// 				$priority,
	// 				$section
	// 			);
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// /**
	//  * @hook add_meta_boxes
	//  */
	// public function add_meta_box($post, $box) {
	// 	global $karma_cache, $sublanguage;
	//
	// 	$id = $box['id'];
	// 	$section = $box['args'];
	// 	$current_post = array(
	// 		'uri' => $post->ID,
	// 		'post_type' => $post->post_type
	// 	);
	//
	// 	if (isset($karma_cache)) {
	//
	// 		$current_post['uri'] = $karma_cache->get_uri($post);
	//
	// 	}
	//
	// 	if (isset($sublanguage)) {
	//
	// 		$current_post['legacy_uri'] = $untranslated_post_uri;
	//
	// 	}
	//
	// 	// echo '<pre>';
	// 	// print_r(get_post_meta($post->ID));
	// 	// echo '</pre>';
	//
	// 	include plugin_dir_path(__FILE__) . 'includes/fields.php';
	// }
	//

}

new Karma_Field;
