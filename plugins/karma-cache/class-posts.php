<?php

/**
 *	Class Karma_Cache
 */
class Karma_Cache_Posts {

	/**
	 * @dependancy_meta_key
	 */
	private $dependancy_meta_key = 'kdep';

	/**
	 *	Constructor
	 */
	public function __construct() {

		add_action('karma_cache_flush', array($this, 'flush_dependancies'));

		add_action('karma_cache_request', array($this, 'karma_cache_request'), 10, 4);
		add_action('save_post', array($this, 'save_post'), 11, 3); // -> must trigger after standard translations save
		add_action('before_delete_post', array($this, 'before_delete_post'), 99);

		add_action('added_post_meta', array($this, 'updated_post_meta'), 10, 4);
		add_action('updated_post_meta', array($this, 'updated_post_meta'), 10, 4);
		add_action('deleted_post_meta', array($this, 'deleted_post_meta'), 10, 4);

		add_action('set_object_terms', array($this, 'set_object_terms'), 99, 6);

		add_action('edited_term', array($this, 'edited_term'), 99, 3);
		add_action('delete_term', array($this, 'delete_term'), 99, 5);

		// post_id -> uri
		add_filter('karma_fields_posts_id', array($this, 'get_uri'));

		// uri -> post_id
		add_filter('karma_fields_posts_uri', array($this, 'get_id'));

		// multilanguage
		add_action('init', array($this, 'sublanguage_init'));


		// dependancy
		add_action('karma_cache_posts_add_dependancy', array($this, 'add_dependancy'), 10, 3);
		add_action('karma_cache_posts_remove_dependancy', array($this, 'remove_dependancy'), 10, 3);
	}

	/**
	 * @hook 'init'
	 */
	public function sublanguage_init() {
		global $sublanguage;

		if (isset($sublanguage)) {

			require_once plugin_dir_path( __FILE__ ) . 'class-posts-multilanguage.php';

		}

	}

	/**
	 * @filter "karma_fields_{posts}_id"
	 */
	// public function filter_id($id) {
	//
	// 	// $post = get_post($id);
	// 	//
	// 	// if ($post) {
	// 	//
	// 	// 	return $this->get_uri($id);
	// 	//
	// 	// }
	// 	//
	// 	// return $id;
	//
	// 	return $this->get_uri($id);
	//
	// }
	//
	// /**
	//  * @filter "karma_fields_{posts}_uri"
	//  */
	// public function filter_uri($uri) {
	// 	// global $wpdb;
	// 	//
	// 	// return $wpdb->get_var($wpdb->prepare("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'post_uri' AND meta_value = %s", $uri));
	// 	//
	// 	// $post = $this->get_post($uri);
	// 	//
	// 	// if ($post) {
	// 	//
	// 	// 	return $post->ID;
	// 	//
	// 	// }
	// 	//
	// 	// return $uri;
	// 	return $this->get_id($uri);
	// }

	/**
	 * request
	 */
	public function request($post_id, $key) {
		global $karma_cache;

		$uri = $this->get_uri($post_id);

		if ($uri) {

			return $karma_cache->request("posts/$uri/$key");

		}

	}

	/**
	 * update
	 */
	public function update($post_id, $key, $value) {
		global $karma_cache;

		$uri = $this->get_uri($post_id);

		if ($uri) {

			$karma_cache->update("posts/$uri/$key", $value);

		}

	}

	/**
	 * get
	 */
	public function get($post_id, $key) {
		global $karma_cache;

		$uri = $this->get_uri($post_id);

		if ($uri) {

			return $karma_cache->get("posts/$uri/$key");

		}

	}

	/**
	 * delete
	 */
	public function delete($post_id, $key = null) {
		global $karma_cache;

		$uri = $this->get_uri($post_id);

		if ($uri) {

			$path = "posts/$uri";

			if ($key) {

				$path .= "/$key";

			}

			$karma_cache->delete($path);

		}

	}

	/**
	 * get_uri
	 */
	public function get_uri($id) {
		global $karma_cache;
		// static $uris = array();
		//
		// if (!isset($uris[$id])) {

			$uri = $this->create_uri($id);

			$post = get_post($id);

			$meta_key = apply_filters('karma_cache_posts_uri_meta_key', 'post_uri', $uri);

			$old_uri = get_post_meta($id, $meta_key, true);

			if ($uri !== $old_uri) {

				if ($old_uri) {

					$karma_cache->delete_dir('posts/'.$old_uri);

				}

				update_post_meta($id, $meta_key, $uri);

			}

		// }

		return $uri;
	}

	/**
	 * get_uri
	 */
	public function get_id($uri) {
		global $wpdb;

		do_action('karma_cache_posts_request_uri', $uri); // multilanguage -> set language

		$meta_key = apply_filters('karma_cache_posts_uri_meta_key', 'post_uri', $uri);

		$post_id = $wpdb->get_var($wpdb->prepare("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = %s AND meta_value = %s", $meta_key, $uri));

		if (!$post_id) {

			$post_id = $this->get_post_id($uri);

		}

		return $post_id;
	}

	/**
	 * get_uri
	 */
	public function create_uri($post) {

		if (!is_object($post)) {

			$post = get_post($post);

		}

		$uri = apply_filters('karma_cache_posts_create_uri', null, $post);

		if ($uri) {

			return $uri;

		}

		$uri = $post->post_name;

		while ($post->post_parent != 0) {

			$post = get_post($post->post_parent);

			$parent_slug = $post->post_name;

			$uri = $parent_slug.'/'.$uri;

		}

		if ($post->post_type !== 'post' && $post->post_type !== 'page') {

			$post_type_object = get_post_type_object($post->post_type);

			if (isset($post_type_object->rewrite['slug'])) {

				$uri = $post_type_object->rewrite['slug'].'/'.$uri;

			} else {

				$uri = $post->post_type.'/'.$uri;

			}

		}

		return $uri;
	}

	/**
	 * @hook 'karma_cache_request'
	 */
	public function karma_cache_request($middleware, $uri, $key, $cache) {
		global $karma_cache;

		if ($middleware === 'posts') {

			$post_id = $this->get_id($uri);

			if ($post_id) {

				$query = new WP_Query(array(
					'p' => intval($post_id),
					'post_type' => 'any',
					'post_status' => 'any'
				));

				if ($query->have_posts()) {

					while($query->have_posts()) {

						$query->the_post();

						// compat
						do_action('karma_cache_'.$query->post->post_type, $query->post, $this);

						// API
						do_action("karma_cache_posts_request_post", $query->post, $this);
						do_action("karma_cache_posts_request_post_key", $query->post, $key, $this);
						do_action("karma_cache_posts_request_post_{$query->post->post_type}", $query->post, $this);
						do_action("karma_cache_posts_request_post_{$query->post->post_type}_key", $query->post, $key, $this);

					}

				}

			}

		}

	}

	/**
	 * @hook 'save_post'
	 */
	public function save_post($post_id, $post, $update) {

		if (defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE) {

			return $post_id;

    }

		// $this->clear_dependancy_cache($post_id);
		$this->update_dependancies($post_id);

		do_action("karma_cache_posts_before_save", $post, $this); // -> for multilanguage

		do_action("karma_cache_posts_save_post", $post, $this);
		do_action("karma_cache_posts_save_post_{$post->post_type}", $post, $this);

		do_action("karma_cache_posts_after_save", $post, $this); // -> not used

	}

	/**
	 * @hook 'before_delete_post'
	 */
	public function before_delete_post($post_id) {
		global $karma_cache;

		// $this->clear_dependancy_cache($post_id);
		$this->update_dependancies($post_id);

		$this->delete($post_id);

		// $uri = $this->get_uri($post_id);
		//
		// if ($uri) {
		//
		// 	$this->delete_dir($uri);
		//
		// }

		do_action("karma_cache_posts_after_delete", $post_id, $this); // -> for multilanguage

	}



	/**
	 * @hook 'karma_cache_posts_add_dependancy'
	 */
	public function add_dependancy($post_id, $path, $context = '') {
		global $wpdb;

		$meta_key = "{$this->dependancy_meta_key}_{$context}";

		$meta_id = $wpdb->get_var($wpdb->prepare(
			"SELECT meta_id FROM $wpdb->postmeta WHERE post_id = %d AND meta_key = %s AND meta_value = %s LIMIT 1",
			$post_id,
			$meta_key,
			$path
		));

		if (!$meta_id) {

			update_post_meta($post_id, $meta_key, $path);

		}

	}

	/**
	 * @hook 'karma_cache_posts_remove_dependancy'
	 */
	public function remove_dependancy($post_id, $path, $context = '') {
		global $wpdb;

		$wpdb->delete($wpdb->postmeta, array(
			'post_id' => $post_id,
			'meta_key' => "{$this->dependancy_meta_key}_{$context}",
			'meta_value' => $path
		), array(
			'%d',
			'%s',
			'%s'
		));

	}

	/**
	 * update_dependancies
	 */
	public function update_dependancies($post_id, $context = '') {
		global $wpdb, $karma_cache;

		static $updates = array();

		if ($context && empty($updates[$context][$post_id]) || empty($updates[$post_id])) {

			$meta_key = "{$this->dependancy_meta_key}_{$context}";

			$paths = $wpdb->get_col($wpdb->prepare(
				"SELECT meta_value FROM $wpdb->postmeta WHERE post_id = %d AND meta_key = %s",
				$post_id,
				$meta_key
			));

			foreach ($paths as $path) {

				$karma_cache->delete("posts/$path");

				// $this->remove_dependancy($post_id, $path, $context);

			}

			if ($context) {

				$updates[$context][$post_id] = true;

			} else {

				$updates[$post_id] = true;

			}

		}

	}

	/**
	 * @hook 'karma_cache_flush'
	 */
	public function flush_dependancies() {
		global $wpdb;

		$wpdb->query("DELETE FROM $wpdb->postmeta WHERE meta_key LIKE '{$this->dependancy_meta_key}_%'");

	}


	// /**
	//  * add_dependancy
	//  */
	// public function add_dependancy($post_id, $dependant_post_id, $value = '', $context = '') {
	//
	// 	$dependant_post_id = intval($dependant_post_id);
	// 	$context = esc_sql($context);
	//
	// 	$meta_key = "{$this->dependancy_meta_key}_{$dependant_post_id}_{$context}";
	//
	// 	if (!in_array($value, get_post_meta($post_id, $meta_key))) {
	//
	// 		update_post_meta($post_id, $meta_key, $value);
	//
	// 	}
	//
	// }
	//
	// /**
	//  * update_dependancies
	//  */
	// public function update_dependancies($post_id, $context = '') {
	// 	global $wpdb;
	//
	// 	$post_id = intval($post_id);
	// 	$context = esc_sql($context);
	//
	// 	$meta_key = "{$this->dependancy_meta_key}_{$post_id}_{$context}";
	//
	// 	// $dependancy_ids = $wpdb->get_col($wpdb->prepare("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'karma_dependancy' AND meta_value = %d", $post_id));
	//
	// 	$dependancies = $wpdb->get_results("SELECT post_id, meta_value FROM $wpdb->postmeta WHERE meta_key = '$meta_key'");
	//
	// 	// if ($dependancies) {
	//
	// 		foreach ($dependancies as $dependancy) {
	//
	// 			// if ($dependancy->meta_value) {
	//
	// 				$this->delete($dependancy->post_id, $dependancy->meta_value);
	//
	// 			// }
	//
	// 			// only needed when value is empty
	// 			// do_action("karma_cache_posts_dependancy_updated", $dependancy->post_id, $dependancy->meta_value, $this);
	//
	// 		}
	//
	// 	// }
	//
	// }
	//
	// /**
	//  * @hook 'karma_cache_flush'
	//  */
	// public function flush_dependancies() {
	// 	global $wpdb;
	//
	// 	$wpdb->query("DELETE FROM $wpdb->postmeta WHERE meta_key LIKE '{$this->dependancy_meta_key}_%'");
	//
	// }






	/**
	 * delete_cache_dependancies
	 */
	// public function clear_dependancy_cache($post_id) {
	// 	global $wpdb, $karma_cache;
	//
	// 	$dependancy_ids = $wpdb->get_row($wpdb->prepare("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'karma_dependancy' AND meta_value = %d", $post_id));
	//
	// 	if ($dependancy_ids) {
	//
	// 		foreach ($dependancy_ids as $id) {
	//
	// 			$uri = $this->get_uri($id);
	//
	// 			$karma_cache->delete_dir("posts/$uri");
	//
	// 		}
	//
	// 	}
	//
	// }






	/**
	 * @hook 'added_post_meta'
	 */
	public function added_post_meta($meta_id, $object_id, $meta_key, $meta_value) {

		$this->update_dependancies($object_id);
		$this->update_dependancies($object_id, $meta_key);

		do_action('karma_cache_posts_update_meta', $object_id, $meta_key, $meta_value, $this);

	}

	/**
	 * @hook 'updated_post_meta'
	 */
	public function updated_post_meta($meta_id, $object_id, $meta_key, $meta_value) {

		$this->update_dependancies($object_id);
		$this->update_dependancies($object_id, $meta_key);

		do_action('karma_cache_posts_update_meta', $object_id, $meta_key, $meta_value, $this);

	}

	/**
	 * @hook 'deleted_post_meta'
	 */
	public function deleted_post_meta($meta_id, $object_id, $meta_key, $meta_value) {

		// $this->delete($object_id, $meta_key);

		$this->update_dependancies($object_id);
		$this->update_dependancies($object_id, $meta_key);

		do_action('karma_cache_posts_delete_meta', $object_id, $meta_key, $meta_value, $this);

	}

	/**
	 * @hook 'set_object_terms'
	 */
	public function set_object_terms($object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids) {

		$this->update_taxonomy_dependancy($object_id, $taxonomy);

		do_action('karma_cache_posts_set_post_terms', $object_id, $terms, $taxonomy, $append, $this);

	}

	/**
	 * @hook 'edited_term'
	 */
	public function edited_term($term_id, $tt_id, $taxonomy) {

		$this->update_term_dependancy($term_id, $taxonomy);

		// global $karma_cache;
		//
		// $wp_query = new WP_Query(array(
		// 	'posts_per_page' => -1,
		// 	'tax_query' => array(
		// 		array(
		// 			'taxonomy' => $taxonomy,
		// 			'field' => 'id',
		// 			'terms' => $term_id
		// 		)
		// 	)
		// ));
		//
		// foreach ($wp_query->posts as $post) {
		//
		// 	// $this->update_dependancies($post->ID, $taxonomy);
		//
		// 	// $uri = $this->get_uri($post);
		// 	// $karma_cache->delete("posts/$uri/$taxonomy.json");
		//
		// }

	}

	/**
	 * @hook 'delete_term'
	 */
	public function delete_term($term, $tt_id, $taxonomy, $deleted_term, $object_ids) {

		$this->update_term_dependancy($term->term_id, $taxonomy);

		// global $karma_cache;
		//
		// $wp_query = new WP_Query(array(
		// 	'posts_per_page' => -1,
		// 	'post__in' => $object_ids
		// ));
		// foreach ($wp_query->posts as $post) {
		// 	// $uri = $this->get_uri($post);
		// 	// $karma_cache->delete("posts/$uri/$taxonomy.json");
		// }

	}


	/**
	 * add_taxonomy_dependancy
	 */
	public function add_taxonomy_dependancy($post_id, $taxonomy, $value = '') {

		$meta_key = "{$this->dependancy_meta_key}_{$taxonomy}";

		if (!in_array($value, get_post_meta($post_id, $meta_key))) {

			update_post_meta($post_id, $meta_key, $value);

		}

	}



	/**
	 * update_taxonomy_dependancy
	 */
	public function update_taxonomy_dependancy($post_id, $taxonomy) {
		global $wpdb;

		$meta_key = "{$this->dependancy_meta_key}_{$taxonomy}";

		$dependancies = $wpdb->get_results($wpdb->prepare(
			"SELECT meta_value FROM $wpdb->postmeta WHERE post_id = %d AND meta_key = %s",
			$post_id,
			$meta_key
		));

		foreach ($dependancies as $dependancy) {

			$this->delete($post_id, $dependancy->meta_value);

		}

	}


	/**
	 * update_term_dependancy
	 */
	public function update_term_dependancy($term_id, $taxonomy) {
		global $wpdb;

		$meta_key = "{$this->dependancy_meta_key}_{$taxonomy}";

		$dependancies = $wpdb->get_results($wpdb->prepare(
			"SELECT pm.post_id, pm.meta_value FROM $wpdb->postmeta AS pm
			JOIN $wpdb->term_relationships AS tr ON (tr.object_id = pm.post_id)
			JOIN $wpdb->term_taxonomy AS tt ON (tt.term_taxonomy_id = tr.term_taxonomy_id)
			WHERE tt.term_id = %d AND tt.taxonomy = %s AND pm.meta_key = %s",
			$term_id,
			$taxonomy,
			$meta_key
		));

		// $dependancies = $wpdb->get_results($wpdb->prepare(
		// 	"SELECT pm.post_id, pm.meta_value FROM $wpdb->postmeta AS pm
		// 	JOIN $wpdb->term_relationships AS tr ON (tr.object_id = pm.post_id)
		// 	WHERE tr.term_taxonomy_id = %d AND pm.meta_key = %s",
		// 	$tt_id,
		// 	$meta_key
		// ));

		foreach ($dependancies as $dependancy) {

			if ($dependancy->meta_value) {

				$this->delete($dependancy->post_id, $dependancy->meta_value);

			}

		}

	}






	/**
	 * get_post
	 */
	public function get_post_id($uri) {
		global $wpdb;

		$parts = explode('/', $uri);

		if ($parts) {

			$post_id = $this->find_post_id($parts);

			if (!$post_id) {

				$post_id = $this->find_page_id($parts);

			}

			if (!$post_id) {

				$post_type_slug = array_shift($parts);

				$post_type = $this->find_post_type($post_type_slug);

				if ($post_type) {

					$post_id = $this->find_page_id($parts, $post_type);

				}

			}

			return $post_id;

		}

	}

	/**
	 * get_post
	 */
	public function find_post_type($lug) {

		$slug = apply_filters('karma_cache_find_post_type', $lug);

		$post_type_obj = get_post_type_object($lug);

		if ($post_type_obj && $post_type_obj->publicly_queryable) {

			return $post_type_obj->name;

		} else {

			$post_type_objects = get_post_types(array(
				'publicly_queryable' => true
			), 'objects');

			foreach ($post_type_objects as $post_type_object) {

				if (isset($post_type_object->rewrite['slug']) && $post_type_object->rewrite['slug'] === $lug) {

					return $post_type_object->name;

				}

			}

		}

	}

	/**
	 * find_post
	 */
	public function find_post_id($ancestors) {
		global $wpdb;

		$post_name = array_pop($ancestors);

		// to do:
		// -> handle date, category, etc.

		if ($post_name) {

			return $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE post_type = 'post' AND post_name = %s", $post_name));

		}

	}

	/**
	 * find_page
	 */
	public function find_page_id($ancestors, $post_type = 'page') {
		global $wpdb;

		$post_name = array_pop($ancestors);
		$joins = array();

		$parent = 'p';

		foreach (array_reverse($ancestors) as $i => $ancestor) {

			$joins[] = $wpdb->prepare("INNER JOIN $wpdb->posts as p$i ON (p$i.ID = $parent.post_parent AND p$i.post_name = %s)", $ancestor);

			$parent = "p$i";

		}

		$join_sql = implode(' ', $joins);

		return $wpdb->get_var($wpdb->prepare("SELECT p.ID FROM $wpdb->posts AS p $join_sql WHERE p.post_type = %s AND p.post_name = %s", $post_type, $post_name));

	}

}

global $karma_cache_posts;
$karma_cache_posts = new Karma_Cache_Posts;
