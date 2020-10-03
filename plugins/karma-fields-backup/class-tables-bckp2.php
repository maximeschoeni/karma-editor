<?php


Class Karma_Tables {

	public $version = '1';

	public $middlewares = array();
	public $keys = array();

	/**
	 *	constructor
	 */
	public function __construct() {

		// echo '<pre>';
		// print_r(get_option('rewrite_rules'));
		// die();

		require_once dirname(__FILE__) . '/multilanguage.php';

		add_action('init', array($this, 'init'));

		add_action('rest_api_init', array($this, 'rest_api_init'));

		// disable check for empty post in wp_insert_post

		// from  v1
		add_action('wp_ajax_karma_multimedia_get_image_src', array($this, 'ajax_get_image_src'));


		if (is_admin()) {

			add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));

			add_action('karma_field_print_grid', array($this, 'print_grid'));

			add_action('admin_head', array($this, 'print_footer'));

			// add_action('karma_field', array($this, 'print_field'), 10, 4);
			// add_action('karma_field_group', array($this, 'print_field_group'), 10, 3);
			//
			//
			// add_action('wp_ajax_karma_multimedia_get_image_src', array($this, 'ajax_get_image_src'));
			//
			// add_action('wp_ajax_karma_field_get_terms', array($this, 'ajax_get_terms'));
			// // add_action('wp_ajax_karma_field_query_posts', array($this, 'ajax_query_posts'));
			//
			//
			// add_action('karma_fields', array($this, 'print_field'), 10, 4);
			//
			//
			// // add_action('admin_footer', array($this, 'print_footer'));
			// add_action('admin_head', array($this, 'print_footer'));
		}


		// add_action('karma_cache_request', array($this, 'karma_cache_request'), 10, 4);



	}


		/**
		 * Hook for 'admin_enqueue_scripts'
		 */
		public function enqueue_styles() {

			$plugin_url = trim(plugin_dir_url(__FILE__), '/');

			wp_enqueue_style('date-field-styles', $plugin_url . '/css/date-field.css');
			wp_enqueue_style('media-field-styles', $plugin_url . '/css/media-field.css');
			wp_enqueue_style('multimedia-styles', $plugin_url . '/css/multimedia.css');
			wp_enqueue_style('karma-styles-grid', $plugin_url . '/css/grid.css');

			wp_register_script('build', $plugin_url . '/js/build-v4.js', array(), $this->version, false);
			wp_register_script('calendar', $plugin_url . '/js/calendar.js', array(), $this->version, false);
			wp_register_script('ajax', $plugin_url . '/js/ajax-v2.js', array(), $this->version, false);
			wp_register_script('sortable', $plugin_url . '/js/sortable.js', array(), $this->version, false);

			wp_enqueue_script('media-field', $plugin_url . '/js/media.js', array('ajax', 'build'), $this->version, false);
			wp_localize_script('media-field', 'KarmaFieldMedia', array(
				'ajax_url' => admin_url('admin-ajax.php')
			));

			// v1
			// wp_enqueue_script('date-field', KARMA_FIELDS_URL . '/js/date-field-v2.js', array('media-field', 'build', 'calendar'), $this->version, false);

			// v2 fields
			wp_enqueue_script('date-field', $plugin_url . '/js/fields/date.js', array('media-field', 'build', 'calendar'), $this->version, false);
			wp_enqueue_script('textinput-field', $plugin_url . '/js/fields/textinput.js', array('media-field', 'build'), $this->version, false);

			//filters
			wp_enqueue_script('karma-filter-postdate', $plugin_url . '/js/filters/postdate.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-poststatus', $plugin_url . '/js/filters/poststatus.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-search', $plugin_url . '/js/filters/search.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-posttype', $plugin_url . '/js/filters/posttype.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-filter-node', $plugin_url . '/js/filters/node.js', array('media-field', 'build'), $this->version, false);

			// tables
			wp_enqueue_script('karma-table-grid', $plugin_url . '/js/tables/grid.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-grid-body-cell', $plugin_url . '/js/tables/grid-body-cell.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-table-header-cell', $plugin_url . '/js/tables/table-header-cell.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-table-header', $plugin_url . '/js/tables/table-header.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-table-footer', $plugin_url . '/js/tables/footer.js', array('media-field', 'build'), $this->version, false);

			// managers
			wp_enqueue_script('table-manager', $plugin_url . '/js/table-manager.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('field-manager', $plugin_url . '/js/field-manager.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('filter-manager', $plugin_url . '/js/filter-manager.js', array('media-field', 'build'), $this->version, false);

			// selector
			wp_enqueue_script('karma-select-grid', $plugin_url . '/js/grid-select.js', array('media-field', 'build'), $this->version, false);

			// compat
			wp_enqueue_script('multimedia-field', $plugin_url . '/js/multimedia.js', array('build', 'sortable', 'media-field'), $this->version, false);

		}

		/**
		 * @hook admin_footer
		 */
		public function print_footer() {
			// global $karma_cache;

			$karma_fields = array(
				// 'ajax_url' => admin_url('admin-ajax.php'),
				'icons_url' => plugin_dir_url(__FILE__).'dashicons',
				'getURL' => apply_filters('karma_cache_url', rest_url().'karma-fields/v1/get'), // -> apply_filters('karma_fields_get')
				'queryURL' => rest_url().'karma-fields/v1/query',
				'saveURL' => rest_url().'karma-fields/v1/update',
				'filterURL' => rest_url().'karma-fields/v1/filters'
				// 'queryTermsURL' => rest_url().'karma-fields/v1/taxonomy',
			);


			// if (isset($karma_cache)) {
			//
			// 	$karma_fields['getPostURL'] = home_url().'/'.$karma_cache->path;
			//
			// }

			echo '<script>KarmaFields = '.json_encode($karma_fields).';</script>';

		}

	/**
	 * @hook init
	 */
	public function init() {

		$this->register_middleware('posts', array(
			'query' => function($args) {
				$query = new WP_Query($args);
				// var_dump($query->query);
				return array(
					'query' => $query->query,
					'num' => intval($query->found_posts),
					'items' => array_map(function($post) {
						return array(
							'uri' => apply_filters('karma_fields_posts_id', $post->ID),
							'post_title' => $post->post_title,
							'post_parent' => $post->post_parent,
							'post_status' => $post->post_status
						);
					}, $query->posts)
				);
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
				),
				'poststatus' => array(
					'name' => 'poststatus',
					'parse' => function($args, $key, $value) {
						$args[$key] = $value;
						return $args;
					},
					'fetch' => function($key, $request, $middleware = null) {
						global $wpdb;

						$sql_parts = $this->get_other_filters_sql($request);

						$before_where = isset($sql_parts['before']['where']) ? 'WHERE '.$sql_parts['before']['where'] : '';
						$before_join = isset($sql_parts['before']['join']) ? $sql_parts['before']['join'] : '';

						$status_results = $wpdb->get_results(
							"SELECT p.$key, COUNT(p.ID) AS total FROM $wpdb->posts AS p $before_join $before_where GROUP BY p.$key"
						);

						// $after_where = isset($sql_parts['after']['where']) ? $sql_parts['after']['where'] : '';
						// $after_join = isset($sql_parts['after']['join']) ? $sql_parts['after']['join'] : '';
						//
						// if ($after_where || $after_join) {
						//
						// 	$status_after_results = $wpdb->get_results(
						// 		"SELECT p.$key, COUNT(p.ID) AS total FROM $wpdb->posts AS p $before_join $after_join $before_where AND $after_where GROUP BY p.$key"
						// 	);
						//
						// 	$status_results = $this->merge_results($key, $status_results, $status_after_results);
						//
						// }

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
					'fetch' => function($key, $request, $middleware = null) {
						global $wpdb, $wp_locale;

						$sql_parts = $this->get_other_filters_sql($request);

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
					'fetch' => function($key, $request, $middleware = null) {
						global $wpdb;

						$sql_parts = $this->get_other_filters_sql($request);

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
					'save' => function($value, $id, $key) {
						// do_action('karma_fields_save', $value, $uri, $key, $extension);
						// do_action('karma_cache_update', 'posts/'.$uri.'/postfield/'.$key.$extension, $value);



						return wp_update_post(array(
							'ID' => $id,
							$key => $value
						));
					},
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


					'save' => function($value, $id, $key) {
						// $args = array(
						// 	// 'ID' => apply_filters('karma_fields_id', $uri),
						// 	'ID' => $id,
						// 	'meta_input' => array(
						// 		$key => $value
						// 	)
						// );

						return update_metadata('post', $id, $key, $value);

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





		// add_action('karma_cache_posts_save_post', array($this, 'karma_cache_posts'), 10, 3);

		// add_action('save_post', array($this, 'save_post'), 10, 3);


		// do_action('karma_cache_posts_save_post', $post, $cache, $middleware); // used by karma_fields

		// add_action('karma_cache_posts_save_post', function($post, $cache, $middleware) {
		//
		// 	var_dump('pp');
		// }, 10, 3);

		// add_action('karma_cache_posts_update_meta', function($post_id, $key, $value, $cache, $middleware) {
		//
		// 	$uri = $middleware->get_uri($post_id);
		// 	$cache->update("posts/$uri/$key", $value);
		//
		// }, 10, 5);

		// add_action('karma_cache_posts_delete_meta', function($post_id, $key, $cache, $middleware) {
		//
		// 	$uri = $middleware->get_uri($post_id);
		// 	$cache->update("posts/$uri/$meta_key", $value);
		//
		// }, 10, 5);


		do_action('karma_fields_init', $this);

	}



	// /**
	//  * @hook karma_cache_request
	//  */
	// public function karma_cache_request($locator, $cache) {
	//
	// 	if ($locator->middleware, $locator->key && $locator->extension) {
	//
	// 		$field = $this->get_key_field($locator->middleware, $locator->key);
	//
	// 		if ($field) {
	//
	// 			$value = call_user_func($field['get'], $locator->key, $locator->extension);
	//
	// 			$cache->update($locator->path, $value);
	//
	// 		}
	//
	// 	}
	//
	// }

	/**
	 * @hook karma_cache_request
	 */
	// public function karma_cache_request($middleware_name, $uri, $key, $cache) {
	//
	// 	$field = $this->get_key_field($middleware_name, $key);
	//
	// 	if ($field) {
	//
	// 		$id = apply_filters("karma_fields_{$middleware_name}_uri", $uri);
	//
	//
	// 		$value = call_user_func($field['get'], $id, $key);
	//
	// 		$cache->update("$middleware_name/$uri/$key", $value);
	//
	// 	}
	//
	// }



	// /**
	//  * @hook karma_cache_posts (-> @hook 'save_post')
	//  */
	// public function karma_cache_posts($post, $cache, $middleware) {
	//
	// 	$uri = $middleware->get_uri($post);
	//
	// 	if ($uri) {
	//
	// 		$middleware->delta_uri($uri, $post);
	// 		$cache->delete_dir($uri);
	//
	// 	}
	//
	// 	// to do: handle dependancies
	//
	// }

	/**
	 * @hook 'save_post'
	 */
	// public function save_post($post_id, $post) {
	//
	// 	$id = apply_filters('karma_fields_id', $post_id);
	//
	// 	foreach ($this->keys['posts'] as $key => $key_option) {
	//
	// 		if ($key_option['type'] === 'postfield' && empty($key_option['private'])) {
	//
	// 			do_action('karma_cache_flush', 'posts', $id, $key, $key_option['extension'])
	//
	// 		}
	//
	// 	}
	//
	// }

	/**
	 * @hook 'karma_cache_posts_save_post'
	 */
	// public function karma_cache_posts_save_post($post, $cache, $middleware) {
	//
	// 	$uri = apply_filters('karma_fields_posts_id', $post->ID);
	//
	// 	foreach ($this->keys['posts'] as $key => $key_option) {
	//
	//
	//
	// 		if ($key_option['type'] === 'postfield' && empty($key_option['private'])) {
	//
	// 			$field = $this->get_key_field('posts', $key);
	//
	// 			if ($field) {
	//
	// 				$value = call_user_func($field['get'], $post->ID, $key);
	//
	//
	//
	// 				$cache->update("posts/$uri/$key", $value);
	//
	// 			}
	//
	// 			// $this->karma_cache_request('posts', $id, $key, $cache);
	//
	// 		}
	//
	// 	}
	//
	// }

	// /**
	//  * @hook 'save_post'
	//  */
	// public function save_post($post_id, $post, $update) {
	//
	// 	if ($post->post_type === 'revision') {
	//
	// 		return;
	//
	// 	}
	//
	// 	$uri = apply_filters('karma_fields_posts_id', $post->ID);
	//
	// 	foreach ($this->keys['posts'] as $key => $key_option) {
	//
	// 		if ($key_option['type'] === 'postfield' && empty($key_option['private'])) {
	//
	// 			$field = $this->get_key_field('posts', $key);
	//
	// 			if ($field) {
	//
	// 				$value = call_user_func($field['get'], $post->ID, $key);
	//
	// 				do_action('karma_cache_update', 'posts', $uri, $key, $value);
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// }



	/**
	 * @hook 'karma_cache_posts_save_post'
	 */
	public function karma_cache_posts_save_post($post, $posts_cache) {

		if ($post->post_type !== 'revision') {

			foreach ($this->keys['posts'] as $key => $key_option) {

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

		$field = $this->get_key_field('posts', $key);

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
		static $done = false;

		if (!$done && isset($this->keys['posts'][$key]['search']) && $this->keys['posts'][$key]['search']) {

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

		foreach ($this->keys['posts'] as $key => $key_option) {

			if (isset($key_option['search']) && $key_option['search']) {

				$field = $this->get_key_field('posts', $key);

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
		// $query_args['meta_query'][] = array(
		// 	'key'     => 'karma_search',
		// 	'value'   => " $search ",
		// 	'compare' => 'like'
		// );


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





		// $query_args['meta_query'][] = array(
		// 	'key'     => 'date.txt',
		// 	'value'   => ' 2017 ',
		// 	'compare' => 'LIKE'
		// );


		$ids = $wpdb->get_col($sql);




		// $query_args['fields'] = 'ids';
		//
		//
		// var_dump($query_args);
		//
		// $results = new WP_Query($query_args);
		//
		// var_dump($results->request);

		return $ids;

	}



	// public function karma_cache_request($locator, $cache) {
	//
	// 	if ($locator->object && $locator->key && $locator->group && isset($this->middlewares[$locator->middleware]['fields'][$locator->group]['get'])) {
	//
	// 		$value = call_user_func($this->middlewares['posts']['fields'][$locator->group]['get'], $locator->uri, $locator->key);
	//
	// 		$cache->update($locator->path, $value);
	//
	// 	}
	//
	// }
	//





	// /**
	//  * @hook admin_footer
	//  */
	// public function print_footer() {
	// 	global $karma_cache;
	//
	// 	$karma_tables = array(
	// 		'ajax_url' => admin_url('admin-ajax.php'),
	// 		'queryPostURL' => rest_url().'karma-fields/v1/query',
	// 		'savePostURL' => rest_url().'karma-fields/v1/update',
	// 		'queryTermsURL' => rest_url().'karma-fields/v1/taxonomy',
	// 	);
	//
	//
	// 	echo '<script>KarmaTables = '.json_encode($karma_tables).';</script>';
	//
	// }


	// $sql = apply_filters('karma_fields_filter_sql', "SELECT $key, COUNT(ID) AS total FROM $wpdb->posts GROUP BY $key", $key, $request, $middleware);
	//
	// /**
	//  *	@hook 'karma_fields_filter_sql'
	//  */
	// public function filter_sql($sql, $key, $request, $middleware) {
	//
	// 	$total_conditions = apply_filters('karma_fields_filter_conditions_total', array(), $request, $middleware);
	// 	// $current_conditions = apply_filters('karma_fields_filter_conditions_current', array(), $request, $middleware);
	// 	$where = '';
	// 	if ($total_conditions) {
	// 		$where = 'WHERE '.implode(' AND ', $total_conditions);
	// 	}
	// 	$key = esc_sql($key);
	//
	// }


	/**
	 *	@hook 'rest_api_init'
	 */
	public function rest_api_init() {

		register_rest_route('karma-fields/v1', '/query/(?P<middleware>[a-z0-9_-]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_query'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'page' => array(
					'default' => 1
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/get/(?P<path>[^?]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get'),
			'args' => array(
				'path' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/update/(?P<path>[^?]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'args' => array(
				'path' => array(
					'required' => true
				),
				'value' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/filters/(?P<middleware>[a-z0-9_-]+)/(?P<key>[^/]+)/?', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_filter'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'key' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/options/(?P<middleware>[a-z0-9_-]+)/(?P<key>[^/]+)/?', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get_field_options'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'key' => array(
					'required' => true
				)
	    )
		));





	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/query/'
	 */
	public function rest_query($request) {

		$middleware_name = $request->get_param('middleware');

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware) {

			if (isset($middleware['query']) && is_callable($middleware['query'])) {

				$args = $this->parse_args($request, $middleware_name);

				$results = call_user_func($middleware['query'], $args);

				return apply_filters("karma_fields_{$middleware_name}_results", $results, $args);

			} else {

				return 'error middleware query callback not found';

			}

		} else {

			return 'error middleware not found';

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/filter/[object]/[filter]'
	 */
	public function rest_filter($request) {


		$middleware_name = $request->get_param('middleware');
		$middleware = $this->get_middleware($middleware_name);
		$key = $request->get_param('key');



// var_dump($middleware_name, $key);

		// return call_user_func($middleware['fetch'], $key, $request, $middleware);

		// $middlewares = $this->get_middlewares();
		// $middleware = $this->find($middlewares, 'name', $middleware_name);
		//
		// if ($middleware && $filter) {
		//
		// 	$filter = $this->find($middleware['filters'], 'name', $filter_name);



			$filter = $this->get_key_filter($middleware_name, $key);

			if ($filter) {

				if (isset($filter['fetch']) && is_callable($filter['fetch'])) {

					return call_user_func($filter['fetch'], $key, $request, $middleware);

				} else {

					return "rest filter error: fetch callback not found";

				}

			} else {

				return "karma fields rest filter error: filter not found";

			}

		// } else {
		//
		// 	return 'rest filter error: middleware or filter_name not found';
		//
		// }

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get($request) {

		$path = $request->get_param('path');

		$locator = $this->parse_path($path);


		// $middleware_name = $request->get_param('middleware');
		// // $field_name = $request->get_param('field');
		// $path = $request->get_param('path');

		// $middlewares = $this->get_middlewares();
		// $middleware = $this->find($middlewares, 'name', $locator->middleware);

		// if ($middleware) {

			if ($locator->middleware && $locator->uri && $locator->key) {

				// $uri = dirname($path);
				// $filename = basename($path);
				// $key = pathinfo($filename, PATHINFO_FILENAME);
				// $extension = pathinfo($filename, PATHINFO_EXTENSION);

				$field = $this->get_key_field($locator->middleware, $locator->key);

				if ($field) {

					if (isset($field['get']) && is_callable($field['get'])) {

						$uri = apply_filters("karma_fields_{$locator->middleware}_uri", $locator->uri);

						return call_user_func($field['get'], $uri, $locator->key);

					} else {

						return "karma fields rest get error: get callback not found";

					}

				} else {

					return "karma fields rest get error: field not found";

				}

			} else {

				return "karma fields rest get error: incorrect locator";

			}

		// } else {
		//
		// 	return 'karma fields rest save error: middleware not found';
		//
		// }


		// $path = $request->get_param('path');
		//
		// $post_uri = dirname($path);
		// $filename = basename($path);
		// $key = pathinfo($filename, PATHINFO_FILENAME);
		//
		// $post_id = apply_filters('karma_cache_parse_uri', $post_uri, $post_uri);
		//
		// $post = get_post($post_id);
		//
		// if (!$post) {
		//
		// 	return 'error post not exits';
		//
		// }
		//
		// $sections = $this->get_sections();
		// $sections = $this->filter_fields($sections, 'post_type', $post->post_type, false);
		//
		// $field = $this->find_field($sections, 'key', $key);
		//
		// if (!$field) {
		//
		// 	return 'error field not exits';
		//
		// }
		//
		// // do_action('karma_fields_query', $request, $field, $post);
		//
		// $field = $this->format_field($field, false);
		//
		// $value = $this->get_value($field, $post);
		//
		// return $value;

	}



	/**
	 *	@rest 'wp-json/karma-fields/v1/update/{middleware}/{file}'
	 */
	public function rest_update($request) {

		// $middleware_name = $request->get_param('middleware');
		// $file = $request->get_param('file');
		// $uri = dirname($file);
		// $filename = basename($file);
		// $parts = explode('.', $filename);
		// $extension = array_pop($file_parts);
		// $key = array_pop($file_parts);
		// $group = array_pop($file_parts);

		$path = $request->get_param('path');
		$value = $request->get_param('value');

		$locator = $this->parse_path($path);

		// $field_name = $request->get_param('field');
		// $path = $request->get_param('path');


		// $middlewares = $this->get_middlewares();
		// $middleware = $this->find($middlewares, 'name', $middleware_name);

		// if ($middleware) {

			if ($locator->middleware && $locator->uri && $locator->key) {

				// $uri = dirname($path);
				// $filename = basename($path);
				// $key = pathinfo($filename, PATHINFO_FILENAME);
				// $extension = pathinfo($filename, PATHINFO_EXTENSION);

				// $field = $this->find($middleware['fields'], 'name', $locator->group);
				$field = $this->get_key_field($locator->middleware, $locator->key);

				if ($field) {

					if (isset($field['save']) && is_callable($field['save'])) {

						$id = apply_filters("karma_fields_{$locator->middleware}_uri", $locator->uri);

						// if (has_filter('karma_fields_get_post')) {
						//
						// 	$post = apply_filters('karma_fields_get_object', null, $locator->uri, $locator);
						//
						// } else {
						//
						// 	$post = get_post($locator->uri);
						//
						// }
						return call_user_func($field['save'], $value, $id, $locator->key);

						// update cache
						// $path = "$locator->middleware/$locator->uri/$locator->group.$locator->key.$locator->extension";

						// do_action('karma_cache_update', $locator->path, $value);

					} else {

						return "karma fields rest save error: save callback not found";

					}

				} else {

					return "karma fields rest save error: field not found";

				}

			} else {

				return "karma fields rest save error: incorrect path";

			}

		// } else {
		//
		// 	return 'karma fields rest save error: middleware not found';
		//
		// }

		//
		//
		// $path = $request->get_param('path');
		// $value = $request->get_param('value');
		//
		// $post_uri = dirname($path);
		// $filename = basename($path);
		// $key = pathinfo($filename, PATHINFO_FILENAME);
		//
		// $post_id = apply_filters('karma_cache_parse_uri', $post_uri, $post_uri);
		//
		// $post = get_post($post_id);
		//
		// if (!$post) {
		//
		// 	return 'error post not exits';
		//
		// }
		//
		// $sections = $this->get_sections();
		// $sections = $this->filter_fields($sections, 'post_type', $post->post_type, false);
		//
		// $field = $this->find_field($sections, 'key', $key);
		//
		// if (!$field) {
		//
		// 	return 'error field not exits';
		//
		// }
		//
		// $field = $this->format_field($field, false);
		//
		// $this->save_field($field, $post, $value);
		//
		// return $this->get_value($field, $post);

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get_field_options($request) {

		$middleware_name = $request->get_param('middleware');
		$key = $request->get_param('key');

		// $middlewares = $this->get_middlewares();
		//
		// $middleware = $this->find($middlewares, 'name', $middleware_name);
		//
		// if ($middleware && $field_name) {
			//
			// $field = $this->find($middleware['fields'], 'name', $field_name);
			$field = $this->get_key_field($middleware_name, $key);

			if ($field) {

				if (isset($field['fetch']) && is_callable($field['fetch'])) {

					return call_user_func($field['fetch'], $request);

				} else {

					return "karma fields rest get error: get callback not found";

				}

			} else {

				return "karma fields rest field option error: field not found";

			}

		// } else {
		//
		// 	return 'karma fields rest field option error: middleware or field_name not found';
		//
		// }


		// $path = $request->get_param('path');
		//
		// $post_uri = dirname($path);
		// $filename = basename($path);
		// $key = pathinfo($filename, PATHINFO_FILENAME);
		//
		// $post_id = apply_filters('karma_cache_parse_uri', $post_uri, $post_uri);
		//
		// $post = get_post($post_id);
		//
		// if (!$post) {
		//
		// 	return 'error post not exits';
		//
		// }
		//
		// $sections = $this->get_sections();
		// $sections = $this->filter_fields($sections, 'post_type', $post->post_type, false);
		//
		// $field = $this->find_field($sections, 'key', $key);
		//
		// if (!$field) {
		//
		// 	return 'error field not exits';
		//
		// }
		//
		// // do_action('karma_fields_query', $request, $field, $post);
		//
		// $field = $this->format_field($field, false);
		//
		// $value = $this->get_value($field, $post);
		//
		// return $value;

	}





	/**
	 *	get_middlewares
	 */
	public function get_middlewares() {

		return $this->middlewares;

	}

	/**
	 *	get_middleware
	 */
	public function get_middleware($name) {

		if ($name && isset($this->middlewares[$name])) {

			return $this->middlewares[$name];

		}

	}

	/**
	 *	get_filter
	 */
	public function get_filter($middleware_name, $filter_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware && isset($middleware['filters'][$filter_name])) {

			return $middleware['filters'][$filter_name];

		}

	}

	/**
	 *	get_field
	 */
	public function get_field($middleware_name, $field_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware && isset($middleware['fields'][$field_name])) {

			return $middleware['fields'][$field_name];

		}

	}

	/**
	 *	register_middleware
	 */
	// public function get_column($middleware_name, $column_name) {
	//
	// 	$middleware = $this->get_middleware($middleware_name);
	//
	// 	if ($middleware) {
	//
	// 		return $this->find($middleware['columns'], 'name', $column_name);
	//
	// 	}
	//
	// }

	/**
	 *	register_middleware
	 */
	public function get_key($middleware_name, $key_name) {

		if (isset($this->keys[$middleware_name][$key_name])) {

			return $this->keys[$middleware_name][$key_name];

		}

	}

	/**
	 *	register_middleware
	 */
	public function get_key_field($middleware_name, $key_name) {

		$key = $this->get_key($middleware_name, $key_name);

		if (isset($key['field'])) {

			return $this->get_field($middleware_name, $key['field']);

		}

	}

	/**
	 *	register_middleware
	 */
	public function get_key_filter($middleware_name, $key_name) {

		$key = $this->get_key($middleware_name, $key_name);

		if (isset($key['filter'])) {

			return $this->get_filter($middleware_name, $key['filter']);

		}

	}

	/**
	 *	register_middleware
	 */
	public function register_middleware($middleware_name, $middleware) {

		$this->middlewares[$middleware_name] = $middleware;

	}

	/**
	 *	unregister_middleware
	 */
	public function unregister_middleware($middleware_name) {

		$middleware = $this->find($this->middlewares, 'name', $middleware_name);

		if ($middleware) {

			$index = array_search($this->middlewares, $middleware);

			if ($index !== false) {

				array_splice($this->middlewares, $index, 1);

			}

		}

	}

	/**
	 * parse_path
	 */
	public function parse_path($path) {

		$locator = new stdClass();

		$locator->path = $path;

		$parts = explode('/', $path);

		$locator->middleware = array_shift($parts);
		$locator->key = array_pop($parts);
		$locator->uri = implode('/', $parts);

		// $file_parts = explode('.', $locator->filename);
		//
		// $locator->extension = array_pop($file_parts);
		// $locator->key = array_pop($file_parts);
		// $locator->group = array_pop($file_parts);

		return $locator;

	}

	/**
	 * parse_args
	 */
	public function parse_args($request, $middleware_name) {



		$args = array();

		$middleware = $this->get_middleware($middleware_name);

		if (isset($this->keys[$middleware_name])) {

			foreach ($this->keys[$middleware_name] as $key => $key_options) {

				$filter_key = 'filter-'.str_replace('.', '_', $key);

				if ($request->has_param($filter_key)) {

					if (isset($key_options['filter'])) {

						$filter = $this->get_filter($middleware_name, $key_options['filter']);

						if ($filter) {

							$value = $request->get_param($filter_key);

							$args = call_user_func($filter['parse'], $args, $key, $value);

						}

					}

				}

			}

		}

		if ($request->has_param('search') && isset($middleware['search'])) {

			$word = $request->get_param('search');

			$args = call_user_func($middleware['search'], $args, $word);
			// $keys = array();
			//
			// if (isset($this->keys[$middleware_name])) {
			//
			// 	foreach ($this->keys[$middleware_name] as $key => $key_options) {
			//
			// 		if (isset($key_options['type'], $key_options['searchable']) && $key_options['searchable']) {
			//
			// 			$field_name = $key_options['type'];
			//
			// 			$keys[$field_name][] = $key;
			//
			// 		}
			//
			// 	}
			//
			// }
			//
			// $search_args = null;
			//
			// foreach ($keys as $field_name => $field_keys) {
			//
			// 	$field = $this->get_field($middleware_name, $field_name);
			//
			// 	if ($field && isset($field['search1'])) {
			//
			// 		$search_args = call_user_func($field['search1'], $search_args, $word, $field_keys);
			//
			// 	}
			//
			// }
			//
			// if (!$search_args) {
			//
			// 	foreach ($keys as $field_name => $field_keys) {
			//
			// 		$field = $this->get_field($middleware_name, $field_name);
			//
			// 		if ($field && isset($field['search2'])) {
			//
			// 			$search_args = call_user_func($field['search2'], $search_args, $word, $field_keys);
			//
			// 		}
			//
			// 	}
			//
			// }
			//
			// if ($search_args) {
			//
			// 	$args = array_merge($args, $search_args);
			//
			// } else {
			//
			// 	return;
			//
			// }

		}

		if ($request->has_param('orderby')) {

			$order_key = $request->get_param('orderby');

		} else if (isset($this->keys[$middleware_name])) {

			foreach ($this->keys[$middleware_name] as $key => $key_option) {

				if (isset($key_option['default_orderby']) && $key_option['default_orderby']) {

					$order_key = $key;
					break;

				}

			}

		}

		if (isset($order_key, $this->keys[$middleware_name][$order_key])) {

			$key_option = $this->keys[$middleware_name][$order_key];

			if (isset($key_option['field'])) {

				$field = $this->get_field($middleware_name, $key_option['field']);

				if ($field) {

					if ($request->has_param('order')) {

						$order = $request->get_param('order');

					} else if (isset($key_option['default_order'])) {

						$order = $key_option['default_order'];

					} else {

						$order = 'asc';

					}

					if (isset($field['sort'])) {

						$args = call_user_func($field['sort'], $args, $order_key, $order);

					}

				}

			}

		}

		$args['posts_per_page'] = $request->get_param('ppp');
		$args['paged'] = $request->get_param('page');

		return $args;

	}


	/**
	 * @helper find
	 */
	public function find($items, $key, $value) {

		foreach ($items as $item) {

			if (isset($item[$key]) && $item[$key] === $value) {

				return $item;

			}

		}

	}

	/**
	 *	register_middleware
	 */
	public function register_keys($middleware, $keys) {

		if (isset($this->keys[$middleware])) {

			$this->keys[$middleware] = array_merge($keys, $this->keys[$middleware]);

		} else {

			$this->keys[$middleware] = $keys;

		}

	}



	/**
	 *	print_table
	 */
	public function print_grid($args) {
		static $id = 0;

		$id++;

		include plugin_dir_path(__FILE__) . 'includes/table.php';

	}



	// /**
	//  * parse_args
	//  */
	// public function wp_query($args) {
	//
	// 	return new WP_Query($args);
	//
	// }




	// POSTS

	public function get_other_filters_sql($request) {

		$sql_parts = array();

		// $filters_before = array();
		// $filters_after = array();

		$wheres = [];
		$joins = [];

		$middleware_name = $request->get_param('middleware');

		foreach ($this->keys[$middleware_name] as $key => $key_options) {

			if ($request->has_param('filter-'.$key) && $key !== $request->get_param('key')) {

				$filter = $this->get_filter($middleware_name, $key_options['filter']);
				$priority = isset($key_options['priority']) ? $key_options['priority'] : 'after';
				$value = $request->get_param('filter-'.$key);

				if (isset($filter['join'])) {

					$joins[$priority][] = call_user_func($filter['join'], $key, $value);

				}

				if (isset($filter['where'])) {

					$wheres[$priority][] = call_user_func($filter['where'], $key, $value);

				}

			}

		}

		foreach ($wheres as $priority => $array) {

			$sql_parts[$priority]['where'] = implode(' AND ', $array);

		}

		foreach ($joins as $priority => $array) {

			$sql_parts[$priority]['join'] = implode(' ', $array);

		}

		return $sql_parts;

	}

	public function merge_results($key, $results1, $results2) {

		$keyed_counts = array();

		foreach ($results2 as $result) {

			$keyed_counts[$result->$key] = $result->total;

		}

		foreach ($results1 as $result) {

			if (isset($keyed_counts[$result->$key])) {

				$result->count = $keyed_counts[$result->$key];

			}

		}

		return $results1;

	}






}

new Karma_Tables;
