<?php


Class Karma_Posts_Fields {

	/**
	 * constructor
	 */
	public function __construct() {

		add_action('init', array($this, 'init'));

	}



	/**
	 * @hook init
	 */
	public function init() {

		if (is_admin()) {

			add_action('save_post', array($this, 'save_post'), 10, 3);
			add_action('karma_fields_print_field', array($this, 'print_field'), 10, 3);


			add_action('karma_cache_posts_request_post_key', array($this, 'karma_cache_posts_request_post_key'), 10, 3);

			add_action('karma_cache_posts_save_post', array($this, 'karma_cache_posts_save_post'), 10, 2);
			add_action('karma_cache_posts_update_meta', array($this, 'karma_cache_posts_update_meta'), 10, 4);
			add_action('karma_cache_posts_set_post_terms', array($this, 'karma_cache_posts_set_post_terms'), 10, 5);

		}

	}

	/**
	 * print_field
	 *
	 * @hook 'karma_fields_print_field'
	 */
	public function print_field($middleware, $id, $resources) {
		static $index = 0;

		$index++;

		$this->prepare($resources);

		$uri = apply_filters('karma_fields_posts_id', $id);
		//
		// echo '<pre>';
		// var_dump(get_post_meta($id));
		// echo '</pre>';

		include_once dirname(__FILE__) . '/includes/field-uri.php';
		include_once dirname(__FILE__) . '/includes/field-nonce.php';

		include plugin_dir_path(__FILE__) . 'includes/fields.php';

	}

	/**
	 * @hook 'save_post'
	 */
	public function save_post($post_id, $post, $update) {
		global $karma_fields;

		if (current_user_can('edit_post', $post_id) && (!defined( 'DOING_AUTOSAVE' ) || !DOING_AUTOSAVE )) {

			$action = "karma_field-action";
			$nonce = "karma_field-nonce";

			if (isset($_REQUEST[$nonce]) && wp_verify_nonce($_POST[$nonce], $action)) {

				if (isset($_REQUEST['karma-fields-items'], $_REQUEST['karma-fields-uri']) && is_array($_REQUEST['karma-fields-items'])) {

					foreach ($_REQUEST['karma-fields-items'] as $item) {

						$item = stripslashes($item);
						$item = json_decode($item);

						$karma_fields->update_item('posts', $item, $_REQUEST['karma-fields-uri'], null);

					}

				}

			}

		}

	}

	/**
	 *	prepare
	 */
	public function prepare(&$resources) {
		global $karma_fields;

		if (isset($resources['key']) && $resources['key']) {

			$key = $karma_fields->get_key('posts', $resources['key']);

			// if (isset($key['type'])) {
			//
			// 	$resources['type'] = $key['type'];
			//
			// 	// $type = $karma_fields->get_key_type('posts', $key_name);
			// 	//
			// 	// if (isset($type['extension']) && $type['extension']) {
			// 	//
			// 	// 	$resources['extension'] = $type['extension'];
			// 	//
			// 	// }
			//
			// }

			if (isset($key['cache'])) {

				if ($key['cache'] === true) {

					$file = $resources['key'] . '.txt';

				} else {

					$file = $key['cache'];

				}

				$resources['cache'] = $file;

				// $type = $karma_fields->get_key_type('posts', $key_name);
				//
				// if (isset($type['extension']) && $type['extension']) {
				//
				// 	$resources['extension'] = $type['extension'];
				//
				// }

			}

		}

		if (isset($resources['children']) && $resources['children']) {

			foreach ($resources['children'] as &$child) {

				$this->prepare($child);

			}

		}

	}






	/**
	 * @hook 'karma_cache_posts_save_post'
	 */
	public function karma_cache_posts_save_post($post, $posts_cache) {

		if ($post->post_type !== 'revision') {

			$middleware = $karma_fields->get_middleware('posts');

			foreach ($middleware->keys as $key => $resources) {

				$middleware->update_post_search_key($post->ID, $key);

				$middleware->update_cache($post->ID, $key, $posts_cache);

			}

		}

	}


	/**
	 * @hook 'karma_cache_posts_request_post_key'
	 */
	public function karma_cache_posts_request_post_key($post, $key, $posts_cache) {

		$middleware = $karma_fields->get_middleware('posts');

		$middleware->update_post_search_key($post->ID, $key);

		$middleware->update_cache($post->ID, $key, $posts_cache);

	}

	/**
	 * @hook 'karma_cache_posts_update_meta'
	 */
	public function karma_cache_posts_update_meta($post_id, $meta_key, $meta_value, $posts_cache) {

		$middleware = $karma_fields->get_middleware('posts');

		$middleware->update_post_search_key($post_id, $meta_key);

		$middleware->update_cache($post_id, $meta_key, $posts_cache);

	}


	/**
	 * @hook 'karma_cache_posts_set_post_terms'
	 */
	public function karma_cache_posts_set_post_terms($post_id, $terms, $taxonomy, $append, $posts_cache) {

		$middleware = $karma_fields->get_middleware('posts');

		$middleware->update_cache($post_id, $taxonomy.'.json', $posts_cache);

	}




}

new Karma_Posts_Fields;
