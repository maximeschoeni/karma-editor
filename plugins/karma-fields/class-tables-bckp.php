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


		add_action('karma_cache_request', array($this, 'karma_cache_request'), 10, 2);



	}


		/**
		 * Hook for 'admin_enqueue_scripts'
		 */
		public function enqueue_styles() {

			$plugin_url = trim(plugin_dir_url(__FILE__), '/');

			wp_enqueue_style('date-field-styles', $plugin_url . '/css/date-field.css');
			wp_enqueue_style('media-field-styles', $plugin_url . '/css/media-field.css');
			wp_enqueue_style('multimedia-styles', $plugin_url . '/css/multimedia.css');

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
			wp_enqueue_script('postdate', $plugin_url . '/js/filters/postdate.js', array('media-field', 'build'), $this->version, false);

			// tables
			wp_enqueue_script('karma-fields-grid', $plugin_url . '/js/tables/grid.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-fields-grid-body-cell', $plugin_url . '/js/tables/grid-body-cell.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-fields-table-header-cell', $plugin_url . '/js/tables/table-header-cell.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('karma-fields-table-header', $plugin_url . '/js/tables/table-header.js', array('media-field', 'build'), $this->version, false);

			// managers
			wp_enqueue_script('table-manager', $plugin_url . '/js/table-manager.js', array('media-field', 'build'), $this->version, false);
			wp_enqueue_script('field-manager', $plugin_url . '/js/field-manager.js', array('media-field', 'build'), $this->version, false);

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
				'filterURL' => rest_url().'karma-fields/v1/update'
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

		$this->register_middleware(array(
			'name' => 'posts',
			'query' => function($args) {
				$query = new WP_Query($args);
				return array_map(function($post) {
					return array(
						'uri' => $post->ID,
						'post_title' => $post->post_title,
						'post_parent' => $post->post_parent
						// 'uri' => apply_filters('karma_cache_posts_id', $post->ID, $post)
					);
				}, $query->posts);
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
				array(
					'name' => 'poststatus',
					'parse' => function($args, $value) {
						$values = explode(',', $value);
						$args = $values;
						return $args;
					},
					'fetch' => function($request) {
						global $wpdb;
						return $wpdb->get_results($wpdb->prepare(
							"SELECT DISTINCT post_status FROM $wpdb->posts WHERE post_type = %s",
							$request->get_param('post_type')
						));
					},
					'input' => 'poststatus'
				),
				array(
					'name' => 'postdate',
					'parse' => function($args, $value) {
						$values = explode('-', $value);
						$args['date_query'] = array(
							'year' => $values[0],
							'month' => $values[1]
						);
						return $args;
					},
					'fetch' => function($request) {
						global $wpdb, $wp_locale;
						if ($request->has_param('type')) {
							$results = $wpdb->get_results($wpdb->prepare(
								"SELECT YEAR(post_date) AS year, Month(post_date) AS month FROM $wpdb->posts
								WHERE post_type = %s GROUP BY YEAR(post_date), Month(post_date) ORDER BY post_date ASC LIMIT 1",
								$request->get_param('type')
							));
							return array_map(function($row) {
								return array(
									'month' => $row->month,
									'month_name' => $wp_locale->get_month($row->month),
									'year' => $row->year
								);
							}, $results);
						} else {
							return 'Karma Fields postdate filter error: type not found';
						}
					}
					// 'input' => 'monthYearFilter'
				),
				array(
					'name' => 'year', // year-months, etc.
					'parse' => function($args, $value) {
						if ($value === 'future') {
							$args['meta_query'] = array(
								array(
									'key'     => 'custom-date',
									'value'   => date('Y-m-d'),
									'compare' => '>='
								)
							);
						} else {
							$args['meta_query'] = array(
								array(
									'key'     => 'custom-date',
									'value'   => $value,
									'compare' => '>='
								),
								array(
									'key'     => 'custom-date',
									'value'   => $value+1,
									'compare' => '<'
								)
							);
						}
						return $args;
					},
					'fetch' => function($request, $middleware) {
						global $wpdb;
						if ($request->has_param('post_type') && $request->has_param('key')) {
							return array(
								'first_year' => $wpdb->get_var($wpdb->prepare(
									"SELECT YEAR(pm.meta_value) FROM $wpdb->posts
									JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
									WHERE p.post_type = %s ORDER BY p.post_date ASC LIMIT 1",
									$request->get_param('key'),
									$request->get_param('post_type')
								)),
								'last_year' => $wpdb->get_var($wpdb->prepare(
									"SELECT YEAR(pm.meta_value) FROM $wpdb->posts
									JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
									WHERE p.post_type = %s ORDER BY p.post_date DESC LIMIT 1",
									$request->get_param('key'),
									$request->get_param('post_type')
								))
							);
						} else {
							return 'year filter error: post_type or key not found';
						}
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
				array(
					'name' => 'postfield',
					'save' => function($value, $id, $key, $extension) {
						// do_action('karma_fields_save', $value, $uri, $key, $extension);
						// do_action('karma_cache_update', 'posts/'.$uri.'/postfield/'.$key.$extension, $value);
						return wp_update_post(array(
							'ID' => $id,
							$key => $value
						));
					}
				),
				array(
					'name' => 'postmeta',


					'save' => function($value, $id, $key, $extension) {
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
					'get' => function($post, $key) {
						// $id = apply_filters('karma_fields_id', $id);
						return get_post_meta($post->ID, $key, true);
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
					'cache' => function($value, $filename, $cache) {
						$cache->update('posts/'.$uri.'/'.$filename, $value);
					}
				),
				array(
					'name' => 'multipostmeta',
					'save' => function($value, $id, $key, $extension) {
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
				array(
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





		// update cache when not exist in cache
		add_action('karma_cache_request', array($this, 'karma_cache_request'), 10, 3);

		// delete cache when field is saved by other way
		add_action('karma_cache_posts', array($this, 'karma_cache_posts'), 10, 3);


		do_action('karma_fields_init', $this);

	}

	/**
	 * @hook karma_cache_request
	 */
	public function karma_cache_request($object, $locator, $cache) {

		if ($locator->middleware, $locator->key && $locator->group && $locator->extension) {

			$field = $this->get_field($locator->middleware, $locator->group);

			if ($field) {

				$object = $cache->get_object($locator->middleware, $locator->uri);

				if ($object) {

					$value = call_user_func($field['get'], $object, $locator->key);

					$cache->update($locator->path, $value);

				}

			}

		}

	}



	/**
	 * @hook karma_cache_posts (-> @hook 'save_post')
	 */
	public function karma_cache_posts($post, $cache, $middleware) {

		$uri = $middleware->get_uri($post);

		if ($uri) {

			$middleware->delta_uri($uri, $post);
			$cache->delete_dir($uri);

		}

		// to do: handle dependancies

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

		register_rest_route('karma-fields/v1', '/options/(?P<middleware>[a-z0-9_-]+)/(?P<field>[a-z0-9_-]+)/?', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get_field_options'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'field' => array(
					'default' => -1
				)
	    )
		));

		register_rest_route('karma-fields/v1', '/filters/(?P<middleware>[a-z0-9_-]+)/(?P<filter>[a-z0-9_-]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_filter'),
			'args' => array(
				'middleware' => array(
					'required' => true
				),
				'filter' => array(
					'default' => -1
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

				$args = $this->parse_args($request, $middleware);

				$results = call_user_func($middleware['query'], $args, $middleware);

				return apply_filters("karma_fields_{$middleware_name}_results", $results, $args, $middleware);

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
		$filter_name = $request->get_param('filter');

		// $middlewares = $this->get_middlewares();
		// $middleware = $this->find($middlewares, 'name', $middleware_name);
		//
		// if ($middleware && $filter) {
		//
		// 	$filter = $this->find($middleware['filters'], 'name', $filter_name);

			$filter = $this->get_filter($middleware_name, $filter_name);

			if ($filter) {

				if (isset($filter['fetch']) && is_callable($filter['fetch'])) {

					return call_user_func($filter['fetch'], $request, $middleware);

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

			if ($locator->middleware && $locator->uri && $locator->group && $locator->key && $locator->extension) {

				// $uri = dirname($path);
				// $filename = basename($path);
				// $key = pathinfo($filename, PATHINFO_FILENAME);
				// $extension = pathinfo($filename, PATHINFO_EXTENSION);

				$field = $this->get_field($locator->middleware, $locator->group);

				if ($field) {

					if (isset($field['get']) && is_callable($field['get'])) {

						$uri = apply_filters("karma_fields_{$locator->middleware}_uri", $locator->uri, $locator);

						return call_user_func($field['get'], $uri, $locator->key, $locator->extension);

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
	public function rest_save($request) {

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

			if ($locator->middleware && $locator->uri && $locator->group && $locator->key && $locator->extension && $value) {

				// $uri = dirname($path);
				// $filename = basename($path);
				// $key = pathinfo($filename, PATHINFO_FILENAME);
				// $extension = pathinfo($filename, PATHINFO_EXTENSION);

				// $field = $this->find($middleware['fields'], 'name', $locator->group);
				$field = $this->get_field($locator->middleware, $locator->group);

				if ($field) {

					if (isset($field['save']) && is_callable($field['save'])) {

						$uri = apply_filters("karma_fields_{$locator->middleware}_uri", $locator->uri, $locator);

						// if (has_filter('karma_fields_get_post')) {
						//
						// 	$post = apply_filters('karma_fields_get_object', null, $locator->uri, $locator);
						//
						// } else {
						//
						// 	$post = get_post($locator->uri);
						//
						// }
						call_user_func($field['save'], $value, $uri, $locator->key, $locator->extension);

						// update cache
						// $path = "$locator->middleware/$locator->uri/$locator->group.$locator->key.$locator->extension";

						do_action('karma_cache_update', $locator->path, $value);

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
		$field_name = $request->get_param('field');

		// $middlewares = $this->get_middlewares();
		//
		// $middleware = $this->find($middlewares, 'name', $middleware_name);
		//
		// if ($middleware && $field_name) {
			//
			// $field = $this->find($middleware['fields'], 'name', $field_name);
			$field = $this->get_field($middleware_name, $field_name);

			if ($field) {

				if (isset($field['fetch']) && is_callable($field['fetch'])) {

					return call_user_func($field['fetch'], $request);

				} else {

					return "karma fields rest get error: get callback not found";

				}

			} else {

				return "karma fields rest field option error: field not found";

			}

		} else {

			return 'karma fields rest field option error: middleware or field_name not found';

		}


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
	 *	register_middleware
	 */
	public function get_middlewares() {

		return $this->middlewares;

	}

	/**
	 *	register_middleware
	 */
	public function get_middleware($name) {

		if ($name && isset($this->middlewares[$name])) {

			return $this->middlewares[$name];

		}

	}

	/**
	 *	register_middleware
	 */
	public function get_filter($middleware_name, $filter_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware) {

			return $this->find($middleware['filters'], 'name', $filter_name);

		}

	}

	/**
	 *	register_middleware
	 */
	public function get_field($middleware_name, $field_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware) {

			return $this->find($middleware['fields'], 'name', $field_name);

		}

	}

	/**
	 *	register_middleware
	 */
	public function get_column($middleware_name, $column_name) {

		$middleware = $this->get_middleware($middleware_name);

		if ($middleware) {

			return $this->find($middleware['columns'], 'name', $column_name);

		}

	}

	/**
	 *	register_middleware
	 */
	public function register_middleware($middleware) {

		$this->middlewares[] = $middleware;

	}

	/**
	 *	register_middleware
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
		$locator->filename = array_pop($parts);
		$locator->uri = implode('/', $parts);

		$file_parts = explode('.', $locator->filename);

		$locator->extension = array_pop($file_parts);
		$locator->key = array_pop($file_parts);
		$locator->group = array_pop($file_parts);

		return $locator;

	}

	/**
	 * parse_args
	 */
	public function parse_args($request, $middleware) {

		$args = array();

		if (isset($middleware['filters'])) {

			foreach ($middleware['filters'] as $filter) {

				if ($request->has_param($filter['name'])) {

					$keys = $request->get_param($filter['name']);

					$keys = explode(',', $keys);

					foreach ($keys as $key) {

						if ($request->has_param('filter-'.$key)) {

							$value = $request->get_param('filter-'.$key);

						} else {

							$value = '';

						}

						$args = call_user_func($filter['parse'], $args, $value);

					}

				}

			}

		}

		if ($request->has_param('search') && isset($middleware['search']) && is_callable($middleware['search'])) {

			$args = call_user_func($middleware['search'], $args, $request->get_param('search'));

		}

		if ($request->has_param('orderby') && isset($middleware['columns'])) {

			$column_type = $request->get_param('type-orderby');

			if ($column_type) {

				$column = $this->find($middleware['columns'], 'name', $column_type);

			} else {

				$column = $this->find($middleware['columns'], 'default', true);

			}

			if (!$column && $middleware['columns']) {

				$column = $middleware['columns'][0];

			}

			if ($column && isset($column['order']) && is_callable($column['order'])) {

				$key = $request->get_param($order_by);

				$order = $request->get_param('order');

				$args = call_user_func($column['order'], $args, $key, $order);

			}


		}

		$args['posts_per_page'] = $request->get_param('ppp');
		$args['page'] = $request->get_param('page');

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
		static $id = 1;

		include plugin_dir_path(__FILE__) . 'includes/table.php';

		$id++;

	}



	// /**
	//  * parse_args
	//  */
	// public function wp_query($args) {
	//
	// 	return new WP_Query($args);
	//
	// }




}

new Karma_Tables;
