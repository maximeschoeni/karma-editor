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

		}

		add_action('karma_cache_posts_request_post_file', array($this, 'karma_cache_posts_request_post_file'), 10, 3);

		add_action('karma_cache_posts_save_post', array($this, 'karma_cache_posts_save_post'), 10, 2);
		add_action('karma_cache_posts_update_meta', array($this, 'karma_cache_posts_update_meta'), 10, 4);
		add_action('karma_cache_posts_set_post_terms', array($this, 'karma_cache_posts_set_post_terms'), 10, 5);

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

					$middleware = $karma_fields->get_middleware('posts');

					foreach ($_REQUEST['karma-fields-items'] as $item) {

						$item = stripslashes($item);
						$item = json_decode($item);

						$karma_fields->update_item($middleware, $item, $_REQUEST['karma-fields-uri'], null);

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

			$resources['cache'] = $karma_fields->get_cachefile('posts', $resources['key']);

			// var_dump($resources['key'], $resources['cache']);



			// if (isset($karma_fields->keys['posts'][$resources['key']])) {
			//
			// 	$key_resource = $karma_fields->keys['posts'][$resources['key']];
			//
			// 	if (isset($key_resource['cache'])) {
			//
			// 		if ($key_resource['cache'] === true) {
			//
			// 			$file = $resources['key'] . '.txt';
			//
			// 		} else {
			//
			// 			$file = $key_resource['cache'];
			//
			// 		}
			//
			// 		$resources['cache'] = $file;
			//
			// 	}
			//
			// }

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
		global $karma_fields;

		if ($post->post_type !== 'revision') {

			$middleware = $karma_fields->get_middleware('posts');

			foreach ($middleware->keys as $key => $resources) {

				$middleware->update_post_search_key($post->ID, $key);

				// $middleware->update_cache($post->ID, $key, $posts_cache);

			}

		}

	}


	/**
	 * @hook 'karma_cache_posts_request_post_file'
	 */
	public function karma_cache_posts_request_post_file($post, $file, $posts_cache) {
		global $karma_fields;

		$middleware = $karma_fields->get_middleware('posts');

		$key = $karma_fields->find_key('posts', $file);

		if ($key) {

			$middleware->update_post_search_key($post->ID, $key);

			$middleware->update_cache($post->ID, $key, $posts_cache);

		}

	}

	/**
	 * @hook 'karma_cache_posts_update_meta'
	 */
	public function karma_cache_posts_update_meta($post_id, $meta_key, $meta_value, $posts_cache) {
		global $karma_fields;

		$middleware = $karma_fields->get_middleware('posts');

		$middleware->update_post_search_key($post_id, $meta_key);

		$middleware->update_cache($post_id, $meta_key, $posts_cache);

	}


	/**
	 * @hook 'karma_cache_posts_set_post_terms'
	 */
	public function karma_cache_posts_set_post_terms($post_id, $terms, $taxonomy, $append, $posts_cache) {
		global $karma_fields;

		$middleware = $karma_fields->get_middleware('posts');

		$middleware->update_cache($post_id, $taxonomy.'.json', $posts_cache);

	}




}

new Karma_Posts_Fields;
