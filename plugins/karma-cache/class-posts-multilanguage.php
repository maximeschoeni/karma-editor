<?php

/**
 * @class
 */
class Karma_Cache_Posts_Multilanguage {

	/**
	 * Constructor
	 *
	 * @hook 'sublanguage_init'
	 */
	public function __construct() {

			// add_filter('karma_cache_get_uri', array($this, 'get_uri'), 10, 2);
			// add_filter('karma_cache_find_post_type', array($this, 'find_post_type'));
			// add_filter('karma_cache_find_post', array($this, 'find_post'), 10, 2);
			// add_filter('karma_cache_find_page', array($this, 'find_page'), 10, 3);
			// add_action('save_post', array($this, 'save_post'), 10, 3);


			add_action('karma_cache_posts_request_uri', array($this, 'request_uri'));



			add_filter('karma_cache_posts_create_uri', array($this, 'create_translated_uri'), 10, 2);
			add_filter('karma_cache_posts_uri_meta_key', array($this, 'translate_uri_meta_key'), 10, 2);
		  add_action('karma_cache_posts_before_save', array($this, 'save'), 10, 2);


	}

	/**
	 * @hook karma_cache_posts_before_save
	 */
	public function save($post, $posts_cache) {
		global $sublanguage, $karma_cache;

		if (isset($sublanguage) && $sublanguage->is_post_type_translatable($post->post_type)) {

			remove_filter('sublanguage_postmeta_override', '__return_true');

			foreach ($sublanguage->get_languages() as $language) {

				if ($sublanguage->is_sub($language)) {

					$sublanguage->set_language($language);

					if (is_admin()) {

						switch_to_locale($language->post_content);

					}

					$query = new WP_Query(array(
						'p' => $post->ID,
						'post_type' => $post->post_type,
						'post_status' => 'any'
					));

					while ($query->have_posts()) {

						$query->the_post();

						do_action("karma_cache_posts_save_post", $query->post, $posts_cache);
						do_action("karma_cache_posts_save_post_{$query->post->post_type}", $query->post, $posts_cache);

					}

					wp_reset_postdata();

				}

			}

			// $sublanguage->set_language($current_language);
			$sublanguage->set_language($sublanguage->get_main_language());

			if (is_admin()) {

				restore_current_locale();

			}

		}

	}

	/**
	 * get_language
	 */
	// public function get_language($uri) {
	// 	global $sublanguage;
	//
	// 	if (preg_match('#^([a-z0-9]+)/.*$#', $uri, $matches)) {
	//
	// 		return $sublanguage->get_language_by($matches[1]);
	//
	// 	}
	//
	// }


	/**
	 * @hook 'karma_cache_posts_request_uri'
	 */
	public function request_uri($uri) {
		global $sublanguage;

		if (preg_match('#^([a-z0-9]+)/.*$#', $uri, $matches)) {

			$language = $sublanguage->get_language_by($matches[1]);

			if ($language) {

				$sublanguage->set_language($language);

			}

		}

	}



	/**
	 * @filter 'karma_cache_posts_uri_meta_key'
	 */
	public function translate_uri_meta_key($meta_key, $uri) {
		global $sublanguage;

		//
		// $language = $this->get_language($uri);
		//
		// if ($language) {
		//
		// 	$sublanguage->set_language($language);
		//
		// 	if ($sublanguage->is_sub()) {
		//
		// 		$meta_key = $sublanguage->get_prefix($language).$meta_key;
		//
		// 	}
		//
		// }

		if ($sublanguage->is_sub()) {

			$meta_key = $sublanguage->get_prefix().$meta_key;

		}

		return $meta_key;

	}

	/**
	 * @filter 'karma_cache_posts_create_uri'
	 *
	 * translate uri
	 */
	public function create_translated_uri($uri, $post) {
		global $sublanguage;


		if (isset($sublanguage) && $sublanguage->is_post_type_translatable($post->post_type)) {

			$uri = $sublanguage->translate_post_field($post, 'post_name');

			while ($post->post_parent != 0) {

				$post = get_post($post->post_parent);

				$parent_slug = $sublanguage->translate_post_field($post, 'post_name');

				$uri = $parent_slug.'/'.$uri;

			}

			if ($post->post_type !== 'post' && $post->post_type !== 'page') {

				$post_type_slug = $sublanguage->translate_cpt($post->post_type);

				$uri = $post_type_slug.'/'.$uri;

			}

			if (!$sublanguage->is_default() || $sublanguage->get_option('show_slug')) {

				$uri = $sublanguage->get_language()->post_name.'/'.$uri;

			}

		}

		return $uri;
	}







	//
	// /**
	//  * @filter 'karma_cache_find_post_type'
	//  */
	// public function find_post_type($slug) {
	// 	global $sublanguage;
	//
	// 	if (isset($sublanguage)) {
	//
	// 		$translated_slug = $sublanguage->get_cpt_original($slug, $language = null);
	//
	// 		if ($translated_slug) {
	//
	// 			$slug = $translated_slug;
	//
	// 		}
	//
	// 	}
	//
	// 	return $slug;
	// }
	//
	//
	// /**
	//  * @filter 'karma_cache_find_post'
	//  */
	// public function find_post($post, $post_name) {
	// 	global $sublanguage;
	//
	// 	if (isset($sublanguage)) {
	//
	// 		$post = $wpdb->get_row(
	// 			"SELECT p.* FROM $wpdb->posts as p
	// 			LEFT JOIN $wpdb->postmeta as pm ON (p.ID = pm.post_id)
	// 			WHERE p.post_type = %s AND (p.post_name = %s OR (pm.meta_key = %s AND pm.meta_value = %s))",
	// 			'post',
	// 			$post_name,
	// 			$sublanguage->get_prefix().'post_name',
	// 			$post_name
	// 		);
	//
	// 	}
	//
	// 	return $post;
	//
	// }
	//
	// /**
	//  * @filter 'karma_cache_find_page'
	//  */
	// public function find_page($post, $ancestors, $post_type) {
	// 	global $sublanguage;
	//
	// 	$parent_id = 0;
	//
	// 	while (isset($sublanguage) && $ancestors && isset($parent_id)) {
	//
	// 		$ancestor = array_shift($ancestors);
	//
	// 		$post = $wpdb->get_row($wpdb->prepare(
	// 			"SELECT p.* FROM $wpdb->posts as p
	// 			LEFT JOIN $wpdb->postmeta as pm ON (p.ID = pm.post_id)
	// 			WHERE p.post_type = %s AND p.post_parent = %d AND (p.post_name = %s OR (pm.meta_key = %s AND pm.meta_value = %s))",
	// 			$post_type,
	// 			$parent_id,
	// 			$ancestor,
	// 			$sublanguage->get_prefix().'post_name',
	// 			$ancestor
	// 		));
	//
	// 		if ($post) {
	//
	// 			$parent_id = $post->ID;
	//
	// 		} else {
	//
	// 			$parent_id = null;
	//
	// 		}
	//
	// 	}
	//
	// 	return $post;
	// }
	//
	//
	//


}

new Karma_Cache_Posts_Multilanguage;
