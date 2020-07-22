<?php


Class Karma_Fields_Middleware_posts extends Karma_Fields_Middleware {

	// /**
	//  *	constructor
	//  */
	// public function __construct() {
  //
  //   // update cache
	// 	add_action('karma_cache_posts_request_post_key', array($this, 'karma_cache_posts_request_post_key'), 10, 3);
  //
	// 	add_action('karma_cache_posts_save_post', array($this, 'karma_cache_posts_save_post'), 10, 2);
	// 	add_action('karma_cache_posts_update_meta', array($this, 'karma_cache_posts_update_meta'), 10, 4);
	// 	add_action('karma_cache_posts_set_post_terms', array($this, 'karma_cache_posts_set_post_terms'), 10, 5);
  //
	// }


  /**
	 * query
	 */
  public function query($args) {

    $query = new WP_Query($args);

    return array(
      'query' => $query->query,
      'request' => $query->request,
      'num' => intval($query->found_posts),
      'items' => array_map(function($post) {
        return array(
          'uri' => apply_filters('karma_fields_posts_id', $post->ID),
          'post_type' => $post->post_type,
          'post_title' => $post->post_title,
          'post_date' => $post->post_date,
          'post_parent' => $post->post_parent,
          'post_status' => $post->post_status
        );
      }, $query->posts)
    );

  }

  /**
	 * update
	 */
  public function update($uri, $args) {

    $args = $this->sanitize_fields($args);

    if ($args) {

      $args['ID'] = apply_filters("karma_fields_posts_uri", $uri);

      wp_update_post($args);

    }

  }

  /**
	 * add
	 */
  public function add($fields, $params) {

    if (isset($params['post_type']) &&  $params['post_type']) {

      $fields['post_type'] = $params['post_type'];

    } else {

      $fields['post_type'] = 'post';

    }

    if (isset($params['post_status']) &&  $params['post_status']) {

      $fields['post_status'] = $params['post_status'];

    }

    $args = $this->sanitize_fields($fields);

    add_filter('wp_insert_post_empty_content', '__return_false');

    $id = wp_insert_post($args);

    return $id;

  }

  /**
	 * remove
	 */
  public function remove($uri) {

    $id = apply_filters("karma_fields_posts_uri", $uri);

    wp_delete_post($id, true);

  }

  /**
	 * search
	 */
  public function search($args, $search) {

    $this->update_query_search($args);

    $search = $this->format_search($search);

    if ($search) {

      $ids = $this->search_ids($args, " $search ");

      if ($ids) {

        $args['post__in'] = $ids;

      } else {

        $search_words = explode(' ', $search);

        foreach ($search_words as $search_word) {

          $args['meta_query'][] = array(
            'key'     => 'karma_search',
            'value'   => $search_word,
            'compare' => 'LIKE'
          );

        }

      }

    }

  }

  /**
	 * sanitize_fields
	 */
  public function sanitize_fields($fields) {

    $args = array();

    if (isset($fields['post_type']) &&  $fields['post_type']) {

      $args['post_type'] = $fields['post_type'];

    }

    if (isset($fields['post_status']) &&  $fields['post_status']) {

      $args['post_status'] = $fields['post_status'];

    }

    if (isset($fields['post_title']) &&  $fields['post_title']) {

      $args['post_title'] = $fields['post_title'];

    }

    if (isset($fields['post_name']) &&  $fields['post_name']) {

      $args['post_name'] = $fields['post_name'];

    }

    if (isset($fields['post_content']) &&  $fields['post_content']) {

      $args['post_content'] = $fields['post_content'];

    }

    if (isset($fields['post_excerpt']) &&  $fields['post_excerpt']) {

      $args['post_excerpt'] = $fields['post_excerpt'];

    }

    if (isset($fields['post_date']) &&  $fields['post_date']) {

      $args['post_date'] = $fields['post_date'];

    }

    return $args;

  }

	// /**
	//  * @hook 'karma_cache_posts_save_post'
	//  */
	// public function karma_cache_posts_save_post($post, $posts_cache) {
  //
	// 	if ($post->post_type !== 'revision') {
  //
	// 		foreach ($this->keys as $key => $resources) {
  //
	// 			$this->update_post_search_key($post->ID, $key);
  //
	// 			$this->update_cache($post->ID, $key, $posts_cache);
  //
	// 		}
  //
	// 	}
  //
	// }
  //
  //
	// /**
	//  * @hook 'karma_cache_posts_request_post_key'
	//  */
	// public function karma_cache_posts_request_post_key($post, $key, $posts_cache) {
  //
	// 	$this->update_post_search_key($post->ID, $key);
  //
	// 	$this->update_cache($post->ID, $key, $posts_cache);
  //
	// }
  //
	// /**
	//  * @hook 'karma_cache_posts_update_meta'
	//  */
	// public function karma_cache_posts_update_meta($post_id, $meta_key, $meta_value, $posts_cache) {
  //
	// 	$this->update_post_search_key($post_id, $meta_key);
  //
	// 	$this->update_cache($post_id, $meta_key, $posts_cache);
  //
	// }
  //
  //
	// /**
	//  * @hook 'karma_cache_posts_set_post_terms'
	//  */
	// public function karma_cache_posts_set_post_terms($post_id, $terms, $taxonomy, $append, $posts_cache) {
  //
	// 	$this->update_cache($post_id, $taxonomy.'.json', $posts_cache);
  //
	// }
  //


	/**
	 * @hook 'karma_cache_posts_request_post_key'
	 */
	public function update_cache($post_id, $key, $posts_cache) {
		global $karma_cache;

		// $key_obj = $karma_fields->get_key('posts', $key);

    $driver = $this->get_driver($key);

    if ($driver) {

      if (!isset($driver->resource['cache']) || $driver->resource['cache'] === true) {

        if (isset($driver->resource['type']) && $driver->resource['type'] === 'json') {

          $extension = '.json';

        } else {

          $extension = '.txt';

        }

        $cache = $driver->key.$extension;

      } else if ($driver->resource['cache']) {

        $cache = $driver->resource['cache'];

      }

      if ($cache) {

        $uri => apply_filters('karma_fields_posts_id', $post_id);

        $value = $driver->get($uri, $key);

        // $posts_cache->update($post_id, $cache, $value);

        $karma_cache->update("posts/$uri/$cache", $value);

      }

		}

	}

	/**
	 *
	 */
	public function format_search($text) {

		return preg_replace('/ ?["()?!,.;:\'’<>«»“] ?/', ' ', $text);

	}

	/**
	 *
	 */
	public function update_post_search_key($post_id, $key) {
		static $done = false;

		if (!$done && isset($this->keys[$key]['search']) && $this->keys[$key]['search']) {

			$this->update_post_search($post_id);
			$done = true;

		}

	}

	/**
	 *
	 */
	public function update_post_search($post_id) {

		$search_content = '';
		$search_strings = array();

		foreach ($this->keys as $key => $resource) {

      $driver = $this->get_driver($key);

      if ($driver) {

        $uri => apply_filters('karma_fields_posts_id', $post_id);

        $text = $driver->get($uri, $key);

        $text = $this->format_search($text);

        $text = trim($text);

        $search_strings[] = $text;

      }

		}

		if ($search_strings) {

			$search_content = ' '.implode(' ', $search_strings).' ';

		}

		update_post_meta($post_id, 'karma_search', $search_content);

	}

	/**
	 *
	 */
	public function update_query_search($query_args) {

		$query_args['meta_query'][] = array(
			'key' => 'karma_search',
			'compare' => 'NOT EXISTS'
    );

		$query_args['fields'] = 'ids';

		$results = new WP_Query($query_args);

		if ($results->posts) {

			foreach ($results->posts as $id) {

				$this->update_post_search($id);

			}

		}

	}

	/**
	 *
	 */
	public function search_ids($query_args, $search) {
		global $wpdb;

		$search = esc_sql($search);

		$sql = "SELECT p.ID FROM $wpdb->posts AS p
		INNER JOIN $wpdb->postmeta AS pm ON (p.ID = pm.post_id)
		WHERE  pm.meta_key = 'karma_search' AND pm.meta_value LIKE '%{$search}%'";

		if (isset($query_args['post_type']) && $query_args['post_type'] && is_string($query_args['post_type'])) {

			$post_type = esc_sql($query_args['post_type']);

			$sql .= " AND p.post_type = '$post_type'";

		}

		if (isset($query_args['post_status']) && $query_args['post_status'] && is_string($query_args['post_status'])) {

			$post_status = esc_sql($query_args['post_status']);

			$sql .= " AND p.post_status = '$post_status'";

		}

		$ids = $wpdb->get_col($sql);

		return $ids;

	}



}
