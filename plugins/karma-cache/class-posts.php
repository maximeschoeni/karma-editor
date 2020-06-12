<?php

/**
 *	Class Karma_Cache
 */
class Karma_Cache_Posts {


	/**
	 *	Constructor
	 */
	public function __construct() {

	// 	add_action('karma_cache_init', array($this, 'init'));
	//
	//
	// 	// add_action('karma_fields_posts_update_key', function($post_id, ) use($cache, $middleware) {
	// 	//
	// 	// 	// compat
	// 	// 	do_action('karma_cache_'.$post->post_type, $post, $cache, $middleware);
	// 	//
	// 	// 	do_action('karma_cache_posts_save_post_'.$post->post_type, $post, $cache, $middleware);
	// 	// 	do_action('karma_cache_posts_save_post', $post, $cache, $middleware); // used by karma_fields
	// 	//
	// 	// }, 20, 3);
	//
	// }
	//
	//
	// /**
	//  * @hook init
	//  */
	// public function init($cache) {
	//
	//
	// 	// $middleware = array(
	// 	// 	// 'get_object' => array($this, 'get_post'),
	// 	// 	'get_uri' => array($this, 'get_uri'),
	// 	// 	// 'delta_uri' => array($this, 'delta_uri')
	// 	// );
	//
	// 	$middleware = $this;
	//
	// 	$cache->register_middleware('posts', $middleware);


		add_action('karma_cache_request', array($this, 'karma_cache_request'), 10, 4);
		add_action('save_post', array($this, 'save_post'), 10, 3);
		add_action('before_delete_post', array($this, 'before_delete_post'), 99);


		// add_action('save_post', function($post_id, $post, $update = null) use($cache, $middleware) {
		//
		// 	// compat
		// 	do_action('karma_cache_'.$post->post_type, $post, $cache, $middleware);
		//
		// 	do_action('karma_cache_posts_save_post_'.$post->post_type, $post, $cache, $middleware);
		// 	do_action('karma_cache_posts_save_post', $post, $cache, $middleware); // used by karma_fields
		//
		// }, 20, 3);

		// add_action('before_delete_post', function($post_id) use($cache, $middleware) {
		//
		// 	// $post = get_post($post_id);
		// 	$uri = $middleware->get_uri($post_id);
		// 	$cache->delete_dir($uri);
		//
		// }, 99);

		// add_action('updated_post_meta', function($meta_id, $object_id, $meta_key, $meta_value) use($cache, $middleware) {
		// 	// do_action('karma_cache_posts_update_meta', $object_id, $meta_key, $meta_value, $cache, $middleware);
		// 	$uri = $middleware->get_uri($post_id);
		// 	$cache->update("posts/$uri/$meta_key", $meta_value);
		// }, 99, 4);
		//
		// add_action('deleted_post_meta', function($meta_id, $object_id, $meta_key, $meta_value) use($cache, $middleware) {
		// 	$uri = $middleware->get_uri($post_id);
		// 	$cache->delete("posts/$uri/$meta_key");
		// }, 99, 4);

		add_action('added_post_meta', array($this, 'updated_post_meta'), 10, 4);
		add_action('updated_post_meta', array($this, 'updated_post_meta'), 10, 4);
		add_action('deleted_post_meta', array($this, 'deleted_post_meta'), 10, 4);

		// add_action('set_object_terms', function($object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids) use($cache, $middleware) {
		// 	// $uri = $middleware->get_uri($object_id);
		// 	// $terms = array_map(function($term) {
		// 	// 	return array(
		// 	// 		'term_id' => $term->term_id,
		// 	// 		'name' => $term->name,
		// 	// 		'slug' => $term->slug,
		// 	// 		'description' => $term->description
		// 	// 	);
		// 	// });
		// 	// if ($append) {
		// 	// 	$existing_terms = $cache->get("posts/$uri/$taxonomy.json");
		// 	// 	if ($existing_terms) {
		// 	// 		$terms = array_merge($existing_terms, $terms);
		// 	// 	}
		// 	// }
		// 	// $cache->update("posts/$uri/$taxonomy.json", $terms);
		// 	do_action('karma_fields_posts_set_post_terms', $object_id, $terms, $taxonomy, $append, $cache, $middleware);
		// }, 99, 6);


		add_action('set_object_terms', array($this, 'set_object_terms'), 99, 6);


		add_action('edited_term', array($this, 'edited_term'), 99, 3);
		add_action('delete_term', array($this, 'delete_term'), 99, 5);


		// add_action('edited_term', function($term_id, $tt_id, $taxonomy) use($cache, $middleware) {
		// 	$wp_query = new WP_Query(array(
	  //     'posts_per_page' => -1,
	  //     'tax_query' => array(
	  //       array(
	  //         'taxonomy' => $taxonomy,
	  //         'field' => 'id',
	  //         'terms' => $term_id
	  //       )
	  //     )
	  //   ));
		// 	// do_action('karma_fields_posts_set_post_terms', $term_id, $taxonomy, $wp_query->posts, $cache, $middleware);
		// 	foreach ($wp_query->posts as $post) {
		// 		$uri = $middleware->get_uri($post);
		// 		$cache->delete("posts/$uri/$taxonomy.json");
		// 	}
		// }, 99, 3);
		//
		// add_action('delete_term', function($term, $tt_id, $taxonomy, $deleted_term, $object_ids) use($cache, $middleware) {
		// 	$wp_query = new WP_Query(array(
	  //     'posts_per_page' => -1,
	  //     'post__in' => $object_ids
	  //   ));
		// 	foreach ($wp_query->posts as $post) {
		// 		$uri = $middleware->get_uri($post);
		// 		$cache->delete("posts/$uri/$taxonomy.json");
		// 	}
		// }, 99, 3);



		// post_id -> uri
		// add_filter('karma_fields_posts_id', array($this, 'get_uri'));
		// add_filter('karma_fields_posts_id', function($id) use($cache, $middleware) {
		// 	$uri = $middleware->get_uri($id);
		// 	$old_uri = get_post_meta($id, 'post_uri', true);
		// 	if ($uri !== $old_uri) {
		// 		$cache->delete_dir($old_uri);
		// 		update_post_meta($id, 'post_uri', $uri);
		// 	}
		// 	return $uri;
		// });

		// post_id -> uri
		add_filter('karma_fields_posts_id', array($this, 'get_uri'));

		// uri -> post_id
		add_filter('karma_fields_posts_uri', array($this, 'get_id'));



		// add_action('karma_cache_request', function($middleware, $uri, $key, $cache) use($middleware) {
		// 	$post_id = $middleware->get_id($uri);
		// 	$query = new WP_Query(array(
		// 		'p' => intval($post_id);
		// 	));
		// 	if ($query->have_posts()) {
		// 		while($query->have_posts()) {
		// 			$query->the_post();
		//
		// 			// compat
		// 			do_action('karma_cache_'.$post->post_type, $post, $middleware);
		//
		// 			// API
		// 			do_action("karma_cache_posts_request_post", $query->post, $middleware);
		// 			do_action("karma_cache_posts_request_post_key", $query->post, $key, $middleware);
		// 			do_action("karma_cache_posts_request_post_{$query->post->post_type}", $query->post, $middleware);
		// 			do_action("karma_cache_posts_request_post_{$query->post->post_type}_key", $query->post, $key, $middleware);
		// 		}
		// 	}
		//
		// });
		//
		// add_action('save_post', function($post_id, $post, $update) use ($middleware) {
		//
		// 	// API
		// 	do_action("karma_cache_posts_request_post", $query->post, $middleware);
		// 	do_action("karma_cache_posts_request_post_{$query->post->post_type}", $query->post, $middleware);
		// })
		//



		// add_filter('karma_fields_posts_results', function($results) use($middleware) {
		//
		// 	foreach ($results as $post) {
		//
		// 		$post->uri = $middleware->get_uri($post->ID);
		//
		// 	}
		//
		// 	return $results;
		// });



		// -> delete cache when saving from outsite
		// add_action('updated_postmeta', function($meta_id, $object_id, $meta_key, $meta_value) use($cache) {
		//
		// 	// do_action('karma_cache_clear', 'posts', $object_id, $meta_key);
		//
		//
		// 	$location = $cache->get_object_location('posts', $object_id);
		//
		// 	$path = $location.'/postmeta/'.$meta_key.'.*';
		//
		// 	$files = $cache->has($path);
		//
		// 	foreach ($files as $file) {
		//
		// 		unlink($file);
		//
		// 	}
		//
		// }, 10, 4);


		// add_action('karma_cache_save_key_posts', function($locator) {
		// 	do_action('karma_cache_save_key_posts_'.$locator->object->post_type, $locator);
		// }, 10, 1);


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

			$karma_cache->get("posts/$uri/$key");

		}

	}

	/**
	 * delete
	 */
	public function delete($post_id, $key) {
		global $karma_cache;

		$uri = $this->get_uri($post_id);

		if ($uri) {

			$karma_cache->delete("posts/$uri/$key");

		}

	}




	/**
	 * get_uri
	 */
	public function get_uri($id) {
		global $karma_cache;

		$uri = $this->create_uri($id);

		$old_uri = get_post_meta($id, 'post_uri', true);

		if ($uri !== $old_uri) {

			$karma_cache->delete_dir($old_uri);
			update_post_meta($id, 'post_uri', $uri);

		}

		return $uri;
	}




	/**
	 * @hook "save_post"
	 */
	// public function save_object($post_id, $post, $update = null) {
	//
	// 	do_action('karma_cache_save_object', 'posts', $post);
	//
	// }
	//
	// /**
	//  * @hook "save_post"
	//  */
	// public function delete_post($post_id) {
	//
	// 	$post = get_post($post_id);
	//
	// 	do_action('karma_cache_delete_object', 'posts', $post);
	//
	// }

	/**
	 * delta_uri
	 */
	// public function delta_uri($uri, $post, $cache) {
	//
	// 	$old_slug = get_post_meta($post->ID, 'karma_cache_uri', true);
	//
	// 	if ($uri !== $old_slug) {
	//
	// 		if ($old_slug) {
	//
	// 			$cache->remove_dir($old_slug);
	//
	// 		}
	//
	// 		update_post_meta($post->ID, 'karma_cache_uri', $slug);
	//
	// 	}
	//
	// }

	/**
	 * get_uri
	 */
	public function get_id($uri) {
		global $wpdb;

		return $wpdb->get_var($wpdb->prepare("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'post_uri' AND meta_value = %s", $uri));

	}

	/**
	 * get_uri
	 */
	public function create_uri($post) {

		if (!is_object($post)) {

			$post = get_post($post);

		}

		if ($post->post_type === 'post') {

			$uri = $post->post_name;

			if (!$uri) {

				$uri = $post->ID;

			}

		} else {

			$uri = get_page_uri($post);

			if (!$uri) {

				$uri = $post->ID;

			}

			if ($post->post_type !== 'page') {

				$post_type_object = get_post_type_object($post->post_type);

				if (isset($post_type_object->rewrite['slug'])) {

					$uri = $post_type_object->rewrite['slug'].'/'.$uri;

				} else {

					$uri = $post->post_type.'/'.$uri;

				}

			}

		}



		// $slug = apply_filters('karma_cache_get_slug', $slug, $post);
		//
		// $old_slug = get_post_meta($post->ID, 'karma_cache_slug', true);
		//
		// if ($slug !== $old_slug) {
		//
		// 	if ($old_slug) {
		//
		// 		$cache->remove_object($old_slug);
		//
		// 		// $file = ABSPATH.$this->path.'/'.$old_slug;
		// 		//
		// 		// $this->rrmdir($file);
		//
		// 	}
		//
		// 	update_post_meta($post->ID, 'karma_cache_slug', $slug);
		//
		// }

		return $uri;
	}


	// /**
	//  * find_post_type
	//  */
	// public function find_post_type($lug) {
	//
	// 	$slug = apply_filters('karma_cache_find_post_type', $lug);
	//
	// 	$post_type_obj = get_post_type_object($lug);
	//
	// 	if ($post_type_obj && $post_type_obj->publicly_queryable) {
	//
	// 		return $post_type_obj->name;
	//
	// 	} else {
	//
	// 		$post_type_objects = get_post_types(array(
	// 			'publicly_queryable' => true
	// 		), 'objects');
	//
	// 		foreach ($post_type_objects as $post_type_object) {
	//
	// 			if (isset($post_type_object->rewrite['slug']) && $post_type_object->rewrite['slug'] === $lug) {
	//
	// 				return $post_type_object->name;
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// /**
	//  * find_post
	//  */
	// public function find_post($ancestors) {
	// 	global $wpdb;
	//
	// 	$post_name = array_pop($ancestors);
	//
	// 	// to do:
	// 	// -> handle date, category, etc.
	//
	// 	if ($post_name) {
	//
	// 		$post = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->posts WHERE post_type = 'post' AND post_name = %s", $post_name));
	//
	// 		return apply_filters('karma_cache_find_post', $post, $post_name);
	//
	// 	}
	//
	// }
	//
	// /**
	//  * find_page
	//  */
	// public function find_page($ancestors, $post_type = 'page') {
	// 	global $wpdb;
	//
	// 	$post_name = array_pop($ancestors);
	// 	$joins = array();
	//
	// 	$parent = 'p';
	//
	// 	foreach (array_reverse($ancestors) as $i => $ancestor) {
	//
	// 		$joins[] = $wpdb->prepare("INNER JOIN $wpdb->posts as p$i ON (p$i.ID = $parent.post_parent AND p$i.post_name = %s)", $ancestor);
	//
	// 		$parent = "p$i";
	//
	// 	}
	//
	// 	$join_sql = implode(' ', $joins);
	//
	// 	$post = $wpdb->get_row($wpdb->prepare("SELECT p.* FROM $wpdb->posts AS p $join_sql WHERE p.post_type = %s AND p.post_name = %s", $post_type, $post_name));
	//
	// 	return apply_filters('karma_cache_find_page', $post, $ancestors, $post_type);
	//
	// }
	//
	// /**
	//  * get_post
	//  */
	// public function get_post($uri) {
	// 	global $wpdb;
	//
	// 	$post = apply_filters('karma_cache_get_post', null, $uri);
	//
	// 	if ($post) {
	//
	// 		return $post;
	//
	// 	}
	//
	// 	$parts = explode('/', $uri);
	//
	// 	if ($parts) {
	//
	// 		$post = $this->find_post($parts);
	//
	// 		if (!$post) {
	//
	// 			$post = $this->find_page($parts);
	//
	// 		}
	//
	// 		if (!$post) {
	//
	// 			$post_type_slug = array_shift($parts);
	//
	// 			$post_type = $this->find_post_type($post_type_slug);
	//
	// 			if ($post_type) {
	//
	// 				$post = $this->find_page($parts, $post_type);
	//
	// 			}
	//
	// 		}
	//
	// 		if ($post) {
	//
	// 			return get_post($post);
	//
	// 		}
	//
	// 	}
	//
	// }



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

		$this->clear_dependancy_cache($post_id);

		do_action("karma_cache_posts_save_post", $post, $this);
		do_action("karma_cache_posts_save_post_{$post->post_type}", $post, $this);

	}

	/**
	 * @hook 'before_delete_post'
	 */
	public function before_delete_post($post_id) {
		global $karma_cache;

		$this->clear_dependancy_cache($post_id);

		$uri = $middleware->get_uri($post_id);

		if ($uri) {

			$karma_cache->delete_dir($uri);

		}

	}

	/**
	 * delete_cache_dependancies
	 */
	public function clear_dependancy_cache($post_id) {
		global $wpdb, $karma_cache;

		$dependancy_ids = $wpdb->get_row($wpdb->prepare("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'karma_dependancy' AND meta_value = %d", $post_id));

		foreach ($dependancy_ids as $id) {

			$uri = $this->get_uri($id);

			$karma_cache->delete_dir("posts/$uri");

		}

	}






	/**
	 * @hook 'updated_post_meta'
	 */
	public function added_post_meta($meta_id, $object_id, $meta_key, $meta_value) {

		do_action('karma_cache_posts_update_meta', $object_id, $meta_key, $meta_value, $this);

	}

	/**
	 * @hook 'updated_post_meta'
	 */
	public function updated_post_meta($meta_id, $object_id, $meta_key, $meta_value) {

		do_action('karma_cache_posts_update_meta', $object_id, $meta_key, $meta_value, $this);

	}

	/**
	 * @hook 'deleted_post_meta'
	 */
	public function deleted_post_meta($meta_id, $object_id, $meta_key, $meta_value) {

		$this->delete($object_id, $meta_key);

		do_action('karma_cache_posts_delete_meta', $object_id, $meta_key, $meta_value, $this);

	}




	/**
	 * @hook 'set_object_terms'
	 */
	public function set_object_terms($object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids) {

		do_action('karma_cache_posts_set_post_terms', $object_id, $terms, $taxonomy, $append, $this);

	}


	/**
	 * @hook 'edited_term'
	 */
	public function edited_term($term_id, $tt_id, $taxonomy) {
		global $karma_cache;

		$wp_query = new WP_Query(array(
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => $taxonomy,
					'field' => 'id',
					'terms' => $term_id
				)
			)
		));

		foreach ($wp_query->posts as $post) {

			$uri = $this->get_uri($post);
			$karma_cache->delete("posts/$uri/$taxonomy.json");

		}

	}

	/**
	 * @hook 'delete_term'
	 */
	public function delete_term($term, $tt_id, $taxonomy, $deleted_term, $object_ids) {
		global $karma_cache;

		$wp_query = new WP_Query(array(
			'posts_per_page' => -1,
			'post__in' => $object_ids
		));
		foreach ($wp_query->posts as $post) {
			$uri = $this->get_uri($post);
			$karma_cache->delete("posts/$uri/$taxonomy.json");
		}

	}



}

new Karma_Cache_Posts;
