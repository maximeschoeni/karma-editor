<?php

require_once KARMA_FIELDS_PATH.'/middlewares/middleware.php';

Class Karma_Fields_Middleware_posts extends Karma_Fields_Middleware {

  /**
	 * query
	 */
  public function query($args, $request) {

    $args['order'] = $request->get_param('order');
    $args['posts_per_page'] = $request->get_param('ppp');
    $args['paged'] = $request->get_param('page');

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

    $args['ID'] = apply_filters("karma_fields_posts_uri", $uri);

    wp_update_post($args);

    // $uri = apply_filters('karma_fields_posts_id', $id); // update uri -> must output new uri

  }

  /**
	 * add
	 */
  public function add($fields, $args) {

    if (isset($args['post_type']) &&  $args['post_type']) {

      $fields['post_type'] = $args['post_type'];

    } else {

      $fields['post_type'] = 'post';

    }

    if (isset($args['post_status']) &&  $args['post_status']) {

      $fields['post_status'] = $args['post_status'];

    }

    // $args = $this->sanitize_fields($fields);

    add_filter('wp_insert_post_empty_content', '__return_false');

    $id = wp_insert_post($fields);

    return apply_filters('karma_fields_posts_id', $id);

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
  public function search($search, &$args) {

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

  // /**
	//  * sanitize_fields
	//  */
  // public function sanitize_fields($fields) {
  //
  //   $args = array();
  //
  //   if (isset($fields['post_type']) &&  $fields['post_type']) {
  //
  //     $args['post_type'] = $fields['post_type'];
  //
  //   }
  //
  //   if (isset($fields['post_status']) &&  $fields['post_status']) {
  //
  //     $args['post_status'] = $fields['post_status'];
  //
  //   }
  //
  //   if (isset($fields['post_title']) &&  $fields['post_title']) {
  //
  //     $args['post_title'] = $fields['post_title'];
  //
  //   }
  //
  //   if (isset($fields['post_name']) &&  $fields['post_name']) {
  //
  //     $args['post_name'] = $fields['post_name'];
  //
  //   }
  //
  //   if (isset($fields['post_content']) &&  $fields['post_content']) {
  //
  //     $args['post_content'] = $fields['post_content'];
  //
  //   }
  //
  //   if (isset($fields['post_excerpt']) &&  $fields['post_excerpt']) {
  //
  //     $args['post_excerpt'] = $fields['post_excerpt'];
  //
  //   }
  //
  //   if (isset($fields['post_date']) &&  $fields['post_date']) {
  //
  //     $args['post_date'] = $fields['post_date'];
  //
  //   }
  //
  //   return $args;
  //
  // }

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

    $driver = $this->get_driver($key);

    if ($driver) {

      $cache = $driver->get_cache();

      if ($cache) {

        $uri = apply_filters('karma_fields_posts_id', $post_id);



        $value = $driver->get($uri, $key);



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

      if ($driver && isset($driver->resource['search']) && $driver->resource['search']) {

        $uri = apply_filters('karma_fields_posts_id', $post_id);

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
