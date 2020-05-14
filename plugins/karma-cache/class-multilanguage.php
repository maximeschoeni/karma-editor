<?php

/**
 * @class
 */
class Karma_Cache_Multilanguage {

	/**
	 * Constructor
	 *
	 * @hook 'sublanguage_init'
	 */
	public function __construct() {
		global $sublanguage;

		if (isset($sublanguage)) {

			add_filter('karma_cache_get_uri', array($this, 'get_uri'), 10, 2);
			add_filter('karma_cache_find_post_type', array($this, 'find_post_type'));
			add_filter('karma_cache_find_post', array($this, 'find_post'), 10, 2);
			add_filter('karma_cache_find_page', array($this, 'find_page'), 10, 3);
			add_action('save_post', array($this, 'save_post'), 10, 3);

		}

	}

	/**
	 * @hook 'save_post'
	 */
	public function save($post_id, $post, $update) {
		global $sublanguage, $karma_cache;

		if (isset($sublanguage) && $sublanguage->is_post_type_translatable($post->post_type)) {

			$current_language = $sublanguage->get_language();

			if ($sublanguage->is_sub()) {

				$post = wp_cache_get($post->ID, 'posts'); // -> untranslate post

			}

			foreach ($sublanguage->get_languages() as $language) {

				if ($language !== $current_language) {

					$sublanguage->set_language($language);

					if ($sublanguage->is_sub()) {

						$translated_post = $post;

						foreach ($sublanguage->fields as $field) {

							$translated_post->$field = $sublanguage->translate_post_field($translated_post, $field, $language);

						}

						remove_filter('sublanguage_postmeta_override', '__return_true');

						do_action('karma_cache_'.$translated_post->post_type, $translated_post, $this);

					} else {

						do_action('karma_cache_'.$post->post_type, $post, $this);

					}

				}

			}

			$sublanguage->set_language($current_language);

		}

	}

	/**
	 * @filter 'karma_cache_find_post_type'
	 */
	public function find_post_type($slug) {
		global $sublanguage;

		if (isset($sublanguage)) {

			$translated_slug = $sublanguage->get_cpt_original($slug, $language = null);

			if ($translated_slug) {

				$slug = $translated_slug;

			}

		}

		return $slug;
	}


	/**
	 * @filter 'karma_cache_find_post'
	 */
	public function find_post($post, $post_name) {
		global $sublanguage;

		if (isset($sublanguage)) {

			$post = $wpdb->get_row(
				"SELECT p.* FROM $wpdb->posts as p
				LEFT JOIN $wpdb->postmeta as pm ON (p.ID = pm.post_id)
				WHERE p.post_type = %s AND (p.post_name = %s OR (pm.meta_key = %s AND pm.meta_value = %s))",
				'post',
				$post_name,
				$sublanguage->get_prefix().'post_name',
				$post_name
			);

		}

		return $post;

	}

	/**
	 * @filter 'karma_cache_find_page'
	 */
	public function find_page($post, $ancestors, $post_type) {
		global $sublanguage;

		$parent_id = 0;

		while (isset($sublanguage) && $ancestors && isset($parent_id)) {

			$ancestor = array_shift($ancestors);

			$post = $wpdb->get_row($wpdb->prepare(
				"SELECT p.* FROM $wpdb->posts as p
				LEFT JOIN $wpdb->postmeta as pm ON (p.ID = pm.post_id)
				WHERE p.post_type = %s AND p.post_parent = %d AND (p.post_name = %s OR (pm.meta_key = %s AND pm.meta_value = %s))",
				$post_type,
				$parent_id,
				$ancestor,
				$sublanguage->get_prefix().'post_name',
				$ancestor
			));

			if ($post) {

				$parent_id = $post->ID;

			} else {

				$parent_id = null;

			}

		}

		return $post;
	}

	/**
	 * @filter 'karma_cache_get_uri'
	 *
	 * translate uri
	 */
	public function get_uri($uri, $post) {
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

		}

		return $uri;
	}

}

new Karma_Cache_Multilanguage;
