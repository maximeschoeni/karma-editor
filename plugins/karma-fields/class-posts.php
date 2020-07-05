<?php


Class Karma_Fields_Posts {

	/**
	 *	constructor
	 */
	public function __construct() {

		add_action('karma_fields_init', array($this, 'init'));

	}


	/**
	 * @hook init
	 */
	public function init($karma_fields) {

		$karma_fields->register_middleware('posts', array(
			'query' => function($args) {
				$query = new WP_Query($args);
				return array(
					'query' => $query->query,
					'num' => intval($query->found_posts),
					'items' => array_map(function($post) {
						return array(
							'uri' => apply_filters('karma_fields_posts_id', $post->ID),
							'post_title' => $post->post_title,
							'post_date' => $post->post_date,
							'post_parent' => $post->post_parent,
							'post_status' => $post->post_status
						);
					}, $query->posts)
				);
			},
			'update' => function($id, $args) {
				$args['ID'] = $id;
				wp_update_post($args);
				return $args;
			},
			'add_item' => function($args) {
				add_filter('wp_insert_post_empty_content', '__return_false');
				$id = wp_insert_post($args);
				return $id;
			},
			'add' => function($filters) {
				$args = array();
				if (isset($filters['post_type']) &&  $filters['post_type']) {
					$args['post_type'] = $filters['post_type'];
				} else {
					$args['post_type'] = 'post';
				}
				if (isset($filters['post_status']) &&  $filters['post_status']) {
					$args['post_status'] = $filters['post_status'];
				} else {
					$args['post_status'] = 'draft';
				}
				$args['post_date'] = date('Y-m-d h:i:s');
				add_filter('wp_insert_post_empty_content', '__return_false');
				$id = wp_insert_post($args);
				$args['uri'] = apply_filters('karma_fields_posts_id', $id);
				// return $args;
				return array(
					'uri' => apply_filters('karma_fields_posts_id', $id),
					'values' => $args
				);
			},
			'remove' => function($id) {
				return wp_delete_post($id);
			},
			'search' => function($args, $search) {
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

				return $args;
			},
			// 'output' => function($results) {
			// 	return array_map(function($post) {
			// 		return array(
			// 			'ID' => $post->ID,
			// 			'post_title' => $post->post_title,
			// 			'post_parent' => $post->post_parent,
			// 			'uri' => apply_filters('karma_cache_format_uri', $post->ID, $post)
			// 		);
			// 	}, $results->posts);
			// },
			'filters' => array(
				'posttype' => array(
					'parse' => function($args, $key, $value) {
						$args[$key] = $value;
						return $args;
					},
					'fetch' => function($key, $request, $middleware = null) {
						return 1;
					},
					'where' => function($key, $value) {
						global $wpdb;
						return $wpdb->prepare("p.$key = %s", $value);
					}
					// 'default' => function($args, $value) {
					// 	$args['post_type'] = $value;
					// 	return $args;
					// }
				),
				'poststatus' => array(
					'name' => 'poststatus',
					'parse' => function($args, $key, $value) {
						$args[$key] = $value;
						return $args;
					},
					'fetch' => function($key, $request, $middleware = null) use($karma_fields) {
						global $wpdb;

						$sql_parts = $karma_fields->get_other_filters_sql($request);

						$before_where = isset($sql_parts['before']['where']) ? 'WHERE '.$sql_parts['before']['where'] : '';
						$before_join = isset($sql_parts['before']['join']) ? $sql_parts['before']['join'] : '';

						$status_results = $wpdb->get_results(
							"SELECT p.$key, COUNT(p.ID) AS total FROM $wpdb->posts AS p $before_join $before_where GROUP BY p.$key"
						);

						$results = array();

						$results[] = array(
							'value' => 'any',
							'title' => 'All'
						);

						foreach ($status_results as $status) {

							$results[] = array(
								'value' => $status->$key,
								'title' => $status->$key,
								// 'count' => isset($status->count) ? $status->count : $status->total,
								'total' => $status->total
							);

						}

						return $results;
					},
					'where' => function($key, $value) {
						global $wpdb;
						return $wpdb->prepare("p.$key = %s", $value);
					}
					// 'default' => function($args, $value) {
					// 	$args['post_status'] = $value;
					// 	return $args;
					// }
				),
				'postdate' => array(
					'parse' => function($args, $key, $value) {
						$values = explode('-', $value);
						$args['date_query'] = array(
							'year' => $values[0],
							'month' => $values[1]
						);
						return $args;
					},
					'fetch' => function($key, $request, $middleware = null) use($karma_fields) {
						global $wpdb, $wp_locale;

						$sql_parts = $karma_fields->get_other_filters_sql($request);

						$before_where = isset($sql_parts['before']['where']) ? 'WHERE '.$sql_parts['before']['where'] : '';
						$before_join = isset($sql_parts['before']['join']) ? $sql_parts['before']['join'] : '';

						$results = $wpdb->get_results(
							"SELECT CONCAT(YEAR(p.$key), '-', MONTH(p.$key)) AS $key, COUNT(p.$key) AS total FROM $wpdb->posts AS p
							$before_join $before_where GROUP BY YEAR(p.$key), MONTH(p.$key) ORDER BY p.$key DESC"
						);

						// $after_where = isset($sql_parts['after']['where']) ? $sql_parts['after']['where'] : '';
						// $after_join = isset($sql_parts['after']['join']) ? $sql_parts['after']['join'] : '';
						//
						// if ($after_where || $after_join) {
						//
						// 	$after_results = $wpdb->get_results(
						// 		"SELECT CONCAT(YEAR(p.$key), '-', MONTH(p.$key)) AS $key, COUNT(p.$key) AS total FROM $wpdb->posts AS p
						// 		$after_join $before_where AND $after_where GROUP BY YEAR(p.$key), MONTH(p.$key) ORDER BY p.$key DESC"
						// 	);
						//
						// 	$results = $this->merge_results($key, $results, $after_results);
						//
						// }

						$options = array();

						foreach ($results as $result) {

							$t = strtotime($result->$key);

							$options[] = array(
								'value' => date('Y-m', $t),
								'title' => date_i18n('F Y', $t),
								// 'count' => isset($result->count) ? $result->count : $result->total,
								'total' => $result->total
							);

						}

						return $options;

						// return array_map(function($row) {
						// 	return array(
						// 		'month' => $row->month,
						// 		'month_name' => $wp_locale->get_month($row->month),
						// 		'year' => $row->year
						// 	);
						// }, $results);

					}
					// 'input' => 'monthYearFilter'
				),
				'year' => array(
					'name' => 'year', // year-months, etc.
					'parse' => function($args, $key, $value) {
						if ($value === 'future') {
							$args['meta_query'] = array(
								array(
									'key'     => $key,
									'value'   => date('Y-m-d'),
									'compare' => '>='
								)
							);
						} else {
							$args['meta_query'] = array(
								array(
									'key'     => $key,
									'value'   => $value,
									'compare' => '>='
								),
								array(
									'key'     => $key,
									'value'   => $value+1,
									'compare' => '<'
								)
							);
						}


						return $args;
					},
					'fetch' => function($key, $request, $middleware = null) use($karma_fields) {
						global $wpdb;

						$sql_parts = $karma_fields->get_other_filters_sql($request);

						$before_where = isset($sql_parts['before']['where']) ? 'WHERE '.$sql_parts['before']['where'] : '';
						$before_join = isset($sql_parts['before']['join']) ? $sql_parts['before']['join'] : '';

						$results = $wpdb->get_results($wpdb->prepare(
							"SELECT YEAR(pm.meta_value) AS year, COUNT(pm.meta_value) AS total FROM $wpdb->posts AS p
							JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
							$before_join
							$before_where
							GROUP BY YEAR(pm.meta_value) ORDER BY pm.meta_value DESC",
							$key
						));

						$future_count = intval($wpdb->get_var($wpdb->prepare(
							"SELECT COUNT(pm.meta_value) FROM $wpdb->posts AS p
							JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s AND pm.meta_value > %s)
							$before_join
							$before_where",
							$key,
							date('Y-m-d')
						)));

						$options = array();

						// $options[] = array(
						// 	'value' => '',
						// 	'title' => 'Custom Date Filter'
						// );

						if ($future_count) {

							$options[] = array(
								'value' => 'future',
								'title' => "Future ($future_count)"
							);

						}

						foreach ($results as $result) {

							$options[] = array(
								'value' => $result->year,
								'title' => $result->year." ({$result->total})"
							);

						}

						return $options;


						// if ($request->has_param('post_type') && $request->has_param('key')) {
							// return array(
							// 	'first_year' => $wpdb->get_var($wpdb->prepare(
							// 		"SELECT YEAR(pm.meta_value) FROM $wpdb->posts
							// 		JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
							// 		WHERE p.post_type = %s ORDER BY p.post_date ASC LIMIT 1",
							// 		$request->get_param('key'),
							// 		$request->get_param('post_type')
							// 	)),
							// 	'last_year' => $wpdb->get_var($wpdb->prepare(
							// 		"SELECT YEAR(pm.meta_value) FROM $wpdb->posts
							// 		JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
							// 		WHERE p.post_type = %s ORDER BY p.post_date DESC LIMIT 1",
							// 		$request->get_param('key'),
							// 		$request->get_param('post_type')
							// 	))
							// );
						// } else {
						// 	return 'year filter error: post_type or key not found';
						// }
					},
					'where' => function($key, $value) {
						global $wpdb;
						$key = preg_replace('/[^0-9A-Za-z_]/', '_', $key);
						return $wpdb->prepare("pm_$key.meta_value = %s", $value);
					},
					'join' => function($key) {
						global $wpdb;
						$key = preg_replace('/[^0-9A-Za-z_]/', '_', $key);
						return $wpdb->prepare("JOIN $wpdb->postmeta AS pm_$key ON (pm_$key.post_id = p.ID AND pm_$key.meta_key = %s)", $key);
					}
				)
			),
			'columns' => array(
				array(
					'name' => 'post_title',
					'title' => 'Title',
					'search' => true,
					'default_order' => 'ASC',
					'order' => function($args, $key, $order) {
						$args['orderby'] = 'post_title';
						$args['order'] = $order;
						return $args;
					},
					'field_type' => 'post_title'
					// 'format' => function($post, $resource) {
					//
					// 	return get_post_title($format, $time);
					// }
				),
				array(
					'name' => 'date',
					'title' => 'Date',
					'order' => function($args, $key, $order) {
						$args['orderby'] = 'date';
						$args['order'] = $order;
						return $args;
					},
					'field_type' => 'date'
					// 'format' => function($value, $resource) {
					// 	$time = strtotime($value);
					// 	$format = isset($resource['format']) ? $resource['format'] : 'd/m/Y';
					// 	return date_i18n($format, $time);
					// }
				),
				array(
					'name' => 'custom-date',
					'default' => true,
					'order' => function($args, $key, $order) {
						$args['orderby'] = array('meta_value' => $order, 'title' => 'ASC');
						$args['meta_key'] = $key;
						return $args;
					}
					// 'format' => function($value, $resource) {
					// 	$time = strtotime($value);
					// 	$format = isset($resource['format']) ? $resource['format'] : 'd/m/Y';
					// 	return date_i18n($format, $time);
					// }
				),
				array(
					'name' => 'thumbnail',
					// 'field' => array(
					// 	'key' => '_thumbnail_id',
					// 	'editable' => false,
					// 	'field' => 'image',
					// 	'object' => 'postmeta'
					// )
				)
			),
			'fields' => array(
				'postfield' => array(
					'name' => 'postfield',
					'update' => function($args, $id, $key, $value) {
						// do_action('karma_fields_save', $value, $uri, $key, $extension);
						// do_action('karma_cache_update', 'posts/'.$uri.'/postfield/'.$key.$extension, $value);

						// $args[] = array(
						// 	'ID' => $id,
						// 	$key => $value
						// );
						// $args[$id]['ID'] = $id;
						// $args[$id][$key] = $value;
						// $args['ID'] = $id;
						$args[$key] = $value;
						return $args;

						// return wp_update_post(array(
						// 	'ID' => $id,
						// 	$key => $value
						// ));
					},
					// 'add' => function($args, $key, $value) {
					// 	if ($key === 'post_type' || $key === 'post_status') {
					// 		$args[$key] = $value;
					// 	}
					// 	return $args;
					// },
					'get' => function($id, $key) {
						// $postfield = pathinfo($key, PATHINFO_FILENAME);
						$query = new WP_Query(array(
							'p' => $id
						));
						foreach ($query->posts as $post) {
							return $post->$key;
						}
					},
					'sort' => function($args, $order_key, $order) {
						if ($order_key === 'post_title') {
							$args['orderby'] = 'title';
						} else if ($order_key === 'post_date') {
							$args['orderby'] = 'date';
						} else if ($order_key === 'menu_order') {
							$args['orderby'] = 'menu_order';
						}
						$args['order'] = $order;
						return $args;
					},
					'search1' => function($args, $word, $keys) {
						$wheres = array();
						$word = esc_sql($word);
						foreach ($keys as $key) {
							$key = esc_sql($key);
							$wheres[] = "$key LIKE '$word' OR $key LIKE '$word %' OR $key LIKE '% $word' OR $key LIKE '% $word %'";
						}
						if ($wheres) {
							$ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE (".implode(') OR (', $wheres).")");
							if ($ids) {
								if (isset($args['post__in'])) {
									$args['post__in'] = array_merge($args['post__in'], $ids);
								} else {
									$args['post__in'] = $ids;
								}
								return $args;
							}
						}
					},
					'search2' => function($word, $keys) {
						$wheres = array();
						$words = explode(' ', $words);
						foreach ($words as $word) {
							if (strlen($word) > 2) {
								foreach ($keys as $key) {
									$key = esc_sql($key);
									$word = esc_sql($word);
									$wheres[] = "$key LIKE '%$word%'";
								}
							}
						}
						if ($wheres) {
							$ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE (".implode(') OR (', $wheres).")");
							if ($ids) {
								if (isset($args['post__in'])) {
									$args['post__in'] = array_merge($args['post__in'], $ids);
								} else {
									$args['post__in'] = $ids;
								}
								return $args;
							}
						}
					}
					// 'search' => function($args, $word, $keys) {
					// 	$wheres = array();
					// 	$word = esc_sql($word);
					// 	foreach ($keys as $key) {
					// 		$key = esc_sql($key);
					// 		$wheres[] = "$key LIKE '$word' OR $key LIKE '$word %' OR $key LIKE '% $word' OR $key LIKE '% $word %'";
					// 	}
					// 	if ($wheres) {
					// 		$ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE (".implode(') OR (', $wheres).")");
					// 		if (!$ids) {
					// 			$wheres = array();
					// 			$words = explode(' ', $words);
					// 			foreach ($words as $word) {
					// 				foreach ($keys as $key) {
					// 					$key = esc_sql($key);
					// 					$wheres[] = "$key LIKE '%$word%'";
					// 				}
					// 			}
					// 			if ($wheres) {
					// 				$ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE (".implode(') OR (', $wheres).")");
					// 			}
					// 		}
					// 	}
					//
					//
					//
					// 	$args['post__in'] =
					// }
				),
				'postmeta' => array(
					'name' => 'postmeta',
					'sanitize' => function($value, $id, $key) {
						return $value;
					},
					'update' => function($args, $id, $key, $value) {
						// $args = array(
						// 	// 'ID' => apply_filters('karma_fields_id', $uri),
						// 	'ID' => $id,
						// 	'meta_input' => array(
						// 		$key => $value
						// 	)
						// );

						update_metadata('post', $id, $key, $value);

						return $args;

						// do_action('karma_fields_save', $value, $uri, $key, $extension);
						// return wp_update_post($args);
					},
					'get' => function($id, $key) {
						// $id = apply_filters('karma_fields_id', $id);
						return get_post_meta($id, $key, true);
					},
					'sort' => function($args, $key, $order) {
						$args['orderby'] = array(
							'meta_value' => $order,
							'title' => 'ASC'
						);
						$args['meta_key'] = $key;
						return $args;
					},
					'fetch' => function($key, $request) {
						return $wpdb->get_col($wpdb->prepare(
							"SELECT pm.meta_value FROM $wpdb->posts
							JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
							WHERE p.post_type = %s ORDER BY p.post_date ASC LIMIT 1",
							$key,
							$request->get_param('type')
						));
					},
					// 'fetch' => function($key, $request, $middleware) {
					// 	global $wpdb;
					// 	// $where = implode(' AND ', $conditions);
					//
					// 	// $total_conditions = apply_filters('karma_fields_filter_conditions_total', array(), $request, $middleware);
					// 	// // $current_conditions = apply_filters('karma_fields_filter_conditions_current', array(), $request, $middleware);
					// 	// $where = '';
					// 	// if ($total_conditions) {
					// 	// 	$where = 'WHERE '.implode(' AND ', $total_conditions);
					// 	// }
					// 	$key = esc_sql($key);
					//
					// 	$sql = "SELECT $key, COUNT(ID) AS total FROM $wpdb->posts GROUP BY $key";
					//
					// 	$sql = apply_filters('karma_fields_filter_sql', $sql, $key, $request, $middleware);
					//
					// 	$results = $wpdb->get_results($sql);
					//
					// 	return apply_filters('karma_fields_filter_results', $results, $sql, $key, $request, $middleware);
					// },


					// 'cache' => function($value, $filename, $cache) {
					// 	$cache->update('posts/'.$uri.'/'.$filename, $value);
					// }
				),
				'multipostmeta' => array(
					'name' => 'multipostmeta',
					'save' => function($value, $id, $key) {
						// $id = apply_filters('karma_fields_id', $id);

						$previous = get_post_meta($id, $key);

						$to_remove = array_diff($previous, $value);
						$to_add = array_diff($value, $previous);

						foreach ($to_remove as $value_to_remove) {

							delete_post_meta($post_id, $key, $value_to_remove);

						}

						foreach ($to_add as $value_to_add) {

							add_post_meta($post_id, $key, $value_to_add);

						}

						// do_action('karma_fields_save', $value, $uri, $key, $extension);
						return array(
							'added' => $to_add,
							'removed' => $to_remove
						);

						// add_filter('wp_insert_post_empty_content', '__return_false', 10, 2);
						//
						// return wp_update_post(array(
						// 	'ID' => $id,
						// ));
					},
					'get' => function($id, $key, $extension) {
						// $id = apply_filters('karma_fields_id', $id);
						return get_post_meta($id, $key);
					}
				),
				// array(
				// 	'name' => 'terms',
				// 	'save' => function($value, $uri, $key) {
				// 		$id = apply_filters('karma_fields_id', $id);
				// 		if (is_array($value)) {
				// 			$value = array_filter(array_map('intval', $value));
				// 			wp_set_object_terms($post->ID, $value, $key);
				// 		} else {
				// 			return 'karma fields save field error: value is not an array';
				// 		}
				// 		add_filter('wp_insert_post_empty_content', '__return_false', 10, 2);
				// 		return wp_update_post(array(
				// 			'ID' => $id,
				// 		));
				// 	}
				// ),
				'terms' => array(
					'name' => 'terms',
					'save' => function($value, $id, $key, $extension) {
						// $id = apply_filters('karma_fields_id', $id);
						if (!$value) {
							$value = array();
						} else if (is_int($value)) {
							$value = array($value);
						} else if (is_string($value)) {
							$value = array(intval($value));
						} else if (is_array($value)) {
							$value = array_filter(array_map('intval', $value));
						} else {
							return 'karma fields save field error: value is not an int/string/array';
						}
						// do_action('karma_fields_save', $value, $uri, $key, $extension);
						return wp_set_object_terms($id, $value, $key);

						// add_filter('wp_insert_post_empty_content', '__return_false', 10, 2);
						// return wp_update_post(array(
						// 	'ID' => $id,
						// ));
					},
					'get' => function($id, $taxonomy, $extension) {
						// $id = apply_filters('karma_fields_id', $id);
						$terms = get_the_terms($id, $taxonomy);
						if (is_wp_error($terms)) {
							return $terms;
						}
						$values = array();
						if ($terms) {
							foreach ($terms as $term) {
								$values[] = array(
									'id' => $term->term_id,
									'slug' => $term->slug,
									'name' => $term->name,
									'description' => $term->description
								);
							}
						}
						return $values;
					},
					'fetch' => function($taxonomy) {
						$terms = get_terms(array(
							'taxonomy' => $taxonomy,
							'hide_empty' => false,
						));
						if (is_wp_error($terms)) {
							return $terms;
						}
						$value = array();
						if ($terms && !is_wp_error($terms)) {
							foreach ($terms as $term) {
								$value[] = array(
									'id' => $term->term_id,
									'slug' => $term->slug,
									'name' => $term->name,
									'description' => $term->description
								);
							}
						}
					}
				)
			)
		));


		// update cache
		add_action('karma_cache_posts_request_post_key', array($this, 'karma_cache_posts_request_post_key'), 10, 3);

		add_action('karma_cache_posts_save_post', array($this, 'karma_cache_posts_save_post'), 10, 2);
		add_action('karma_cache_posts_update_meta', array($this, 'karma_cache_posts_update_meta'), 10, 4);
		add_action('karma_cache_posts_set_post_terms', array($this, 'karma_cache_posts_set_post_terms'), 10, 5);

	}


	/**
	 * @hook 'karma_cache_posts_save_post'
	 */
	public function karma_cache_posts_save_post($post, $posts_cache) {
		global $karma_fields;

		if ($post->post_type !== 'revision') {

			foreach ($karma_fields->keys['posts'] as $key => $key_option) {

				$this->update_post_search_key($post->ID, $key);

				if (isset($key_option['field']) && $key_option['field'] === 'postfield' && empty($key_option['private'])) {

					$this->update_cache($post->ID, $key, $posts_cache);

				}

			}

		}

	}


	/**
	 * @hook 'karma_cache_posts_request_post_key'
	 */
	public function karma_cache_posts_request_post_key($post, $key, $posts_cache) {

		$this->update_post_search_key($post->ID, $key);

		$this->update_cache($post->ID, $key, $posts_cache);

	}

	/**
	 * @hook 'karma_cache_posts_update_meta'
	 */
	public function karma_cache_posts_update_meta($post_id, $meta_key, $meta_value, $posts_cache) {

		$this->update_post_search_key($post_id, $meta_key);

		$this->update_cache($post_id, $meta_key, $posts_cache);

	}


	/**
	 * @hook 'karma_cache_posts_set_post_terms'
	 */
	public function karma_cache_posts_set_post_terms($post_id, $terms, $taxonomy, $append, $posts_cache) {

		$this->update_cache($post_id, $taxonomy.'.json', $posts_cache);

	}



	/**
	 * @hook 'karma_cache_posts_request_post_key'
	 */
	public function update_cache($post_id, $key, $posts_cache) {
		global $karma_fields;

		$field = $karma_fields->get_key_field('posts', $key);

		if ($field) {

			$value = call_user_func($field['get'], $post_id, $key);

			$posts_cache->update($post_id, $key, $value);

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
		global $karma_fields;
		static $done = false;

		if (!$done && isset($karma_fields->keys['posts'][$key]['search']) && $karma_fields->keys['posts'][$key]['search']) {

			$this->update_post_search($post_id);
			$done = true;

		}

	}

	/**
	 *
	 */
	public function update_post_search($post_id) {
		global $karma_fields;

		$search_content = '';
		$search_strings = array();

		foreach ($karma_fields->keys['posts'] as $key => $key_option) {

			if (isset($key_option['search']) && $key_option['search']) {

				$field = $karma_fields->get_key_field('posts', $key);

				$text = call_user_func($field['get'], $post_id, $key);

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





	// POSTS

	// public function get_other_filters_sql($request) {
	//
	// 	$sql_parts = array();
	//
	// 	// $filters_before = array();
	// 	// $filters_after = array();
	//
	// 	$wheres = [];
	// 	$joins = [];
	//
	// 	$middleware_name = $request->get_param('middleware');
	//
	// 	foreach ($this->keys[$middleware_name] as $key => $key_options) {
	//
	// 		if ($request->has_param('filter-'.$key) && $key !== $request->get_param('key')) {
	//
	// 			$filter = $this->get_filter($middleware_name, $key_options['filter']);
	// 			$priority = isset($key_options['priority']) ? $key_options['priority'] : 'after';
	// 			$value = $request->get_param('filter-'.$key);
	//
	// 			if (isset($filter['join'])) {
	//
	// 				$joins[$priority][] = call_user_func($filter['join'], $key, $value);
	//
	// 			}
	//
	// 			if (isset($filter['where'])) {
	//
	// 				$wheres[$priority][] = call_user_func($filter['where'], $key, $value);
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// 	foreach ($wheres as $priority => $array) {
	//
	// 		$sql_parts[$priority]['where'] = implode(' AND ', $array);
	//
	// 	}
	//
	// 	foreach ($joins as $priority => $array) {
	//
	// 		$sql_parts[$priority]['join'] = implode(' ', $array);
	//
	// 	}
	//
	// 	return $sql_parts;
	//
	// }

	// public function merge_results($key, $results1, $results2) {
	//
	// 	$keyed_counts = array();
	//
	// 	foreach ($results2 as $result) {
	//
	// 		$keyed_counts[$result->$key] = $result->total;
	//
	// 	}
	//
	// 	foreach ($results1 as $result) {
	//
	// 		if (isset($keyed_counts[$result->$key])) {
	//
	// 			$result->count = $keyed_counts[$result->$key];
	//
	// 		}
	//
	// 	}
	//
	// 	return $results1;
	//
	// }
	//





}

new Karma_Fields_Posts;
