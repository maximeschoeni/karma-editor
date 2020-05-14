<?php


Class Karma_Editor {

  public function __construct() {
    global $karma_clusters;

    require_once KARMA_EDITOR_PATH . '/plugins/karma-cache/karma-cache.php';


    // define('KARMA_CLUSTER_URL', KARMA_EDITOR_URL . '/plugins/clusters');
    // define('KARMA_CLUSTER_PATH', KARMA_EDITOR_PATH . '/plugins/clusters');
    //
    // require_once KARMA_CLUSTER_PATH . '/class-clusters.php';
    //
    // $karma_clusters = new Karma_Clusters;

    define('KARMA_FIELDS_URL', KARMA_EDITOR_URL . '/plugins/karma-fields');
    define('KARMA_FIELDS_PATH', KARMA_EDITOR_PATH . '/plugins/karma-fields');

    require_once KARMA_FIELDS_PATH . '/class-fields.php';

    add_action('admin_menu', array($this, 'register_page'));
    add_action('admin_enqueue_scripts', array($this, 'scripts_styles'));

    add_action('wp_ajax_karma_query_posts', array($this, 'ajax_query_posts'));
    add_action('wp_ajax_karma_query_terms', array($this, 'ajax_query_terms'));
    add_action('wp_ajax_karma_query_distinct_years', array($this, 'ajax_query_distinct_years'));
    add_action('wp_ajax_karma_query_distinct_status', array($this, 'ajax_query_distinct_status'));


    add_action('wp_ajax_karma_save_post', array($this, 'ajax_save_post'));



    // add_action('karma_clusters_update_'.'page', array($this, 'update_page_cluster'), 10, 5);

    // wp_update_post(array(
    //   'ID' => 7,
    //   'post_type' => 'page'
    // ));
    // die();
  }


  /**
   * Register a custom menu page.
   */
  public function register_page() {
    global $menu;

    // remove_menu_page( 'edit.php?post_type=page' );

    add_menu_page(
      __('Custom Pages', 'karma'),
      'Custom Pages',
      'manage_options',
      'karma-post_type-page',
      array($this, 'print_page'),
      'dashicons-admin-page',
      20
    );
  }

  /**
   * @hook 'admin_enqueue_scripts'
   */
  public function scripts_styles() {

    wp_enqueue_style('karma-style', KARMA_EDITOR_URL.'/css/style.css', array(), false);

    wp_enqueue_script('ajax', KARMA_EDITOR_URL.'/js/ajax-v2.js', array(), false, true);
    // wp_localize_script('ajax', 'Ajax', array(
    //   'url' => admin_url() . 'admin-ajax.php'
    // ));

    wp_register_script('build', KARMA_EDITOR_URL.'/js/build-v2.js', array(), false, true);
    // wp_register_script('sortable-v2', KARMA_EDITOR_URL.'/js/sortable.js', array(), false, true);
    wp_register_script('selection', KARMA_EDITOR_URL.'/js/selection.js', array(), false, true);
    wp_enqueue_script('karma', KARMA_EDITOR_URL.'/js/editor.js', array('ajax', 'build', 'selection'), false, true);

    wp_localize_script('karma', 'Karma', array(
      'ajax_url' => admin_url() . 'admin-ajax.php',
      'clusters_url' => WP_CONTENT_URL.'/clusters',
      'locale' => str_replace('_', '-', get_locale())
    ));



  }

  /**
   * hook "karma_clusters_update_$post_type"
   */
  // public function update_page_cluster($cluster, $post, $dependency_instance, $clusters, $query) {
  //
  //   $cluster->post_title = get_the_title($post);
  //   $cluster->permalink = get_permalink($post);
  //   $cluster->post_date = $post->post_date;
  //
  //   $cluster->meta = get_post_meta($post->ID);
  //   $cluster->post = $post;
  //
  // }

  /**
   * get_post_type_options
   */
  public function get_post_type_options($post_type) {

    $options = array(
      'columns' => array(
        array(
          'key' => 'post_title',
          'name' => 'Title',
          'sortable' => true
        ),
        array(
          'key' => 'date',
          'name' => 'Date',
          'datatype' => 'date',
          'sortable' => true
        )
      ),
      'filters' => array(
        array(
          'type' => 'taxonomy',
          'taxonomy' => 'category'
        ),
        array(
          'type' => 'date',
          'field' => 'post_date'
        )
      ),
      'orderby' => 'post_title',
      'order' => 'ASC',
      'num' => 50
    );

    return $options;
  }


  //
  // /**
  //  * parse_order
  //  */
  // private function parse_order($query, $request) {
  //   global $wpdb;
  //
  //   if (isset($request->order)) {
  //
  //     foreach ($request->order as $order) {
  //
  //       $query->orders[] = $wpdb->prepare('%s %s', $order->orderby, $order->order);
  //
  //     }
  //
  //   }
  //
  // }
  //
  // /**
  //  * parse_order
  //  */
  // private function parse_meta($query, $request) {
  //   global $wpdb;
  //
  //   if (isset($request->meta) && is_array($request->meta)) {
  //
  //     foreach (array_values($request->meta) as $index => $meta_query) {
  //
  //       if (isset($meta_query->key, $meta_query->value)) {
  //
  //         $alias = 'pm'.$index;
  //         $type = isset($meta_query->type) && $meta_query->type === 'NUMERIC' ? '%d' : '%s';
  //
  //         $query->joins[] = $wpdb->prepare("LEFT JOIN $wpdb->postmeta AS $alias ON (p.ID = $alias.post_id AND $alias.meta_key = %s)", $meta_query->key);
  //
  //         if ($meta_query->compare === '=' || $meta_query->compare === '!=' || $meta_query->compare === '>' || $meta_query->compare === '<' || $meta_query->compare === '>=' || $meta_query->compare === '<=') {
  //
  //           $query->wheres[] = $wpdb->prepare("$alias.meta_value $meta_query->compare $type", $meta_query->value);
  //
  //         } else if ($meta_query->compare === 'BETWEEN' && is_array($meta_query->value) && count($meta_query->value) === 2) {
  //
  //           $query->wheres[] = "$alias.meta_value > {$meta_query->value[0]} AND $alias.meta_value < {$meta_query->value[1]}";
  //
  //         } else if ($meta_query->compare === 'NOT BETWEEN' && is_array($meta_query->value) && count($meta_query->value) === 2) {
  //
  //           $query->wheres[] = "($alias.meta_value < {$meta_query->value[0]} OR $alias.meta_value > {$meta_query->value[1]})";
  //
  //         } else if ($meta_query->compare === 'EXIST') {
  //
  //           $query->wheres[] = "$alias.meta_value IS NOT NULL";
  //
  //         } else if ($meta_query->compare === 'NOT EXIST') {
  //
  //           $query->wheres[] = "$alias.meta_value IS NULL";
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }
  //
  // /**
  //  * parse_order
  //  */
  // private function parse_taxonomy($query, $request) {
  //   global $wpdb;
  //
  //   if (isset($request->taxonomy) && is_array($request->taxonomy)) {
  //
  //     foreach (array_values($request->taxonomy) as $index => $tax_query) {
  //
  //       if (isset($tax_query->taxonomy, $tax_query->term_id)) {
  //
  //         $query->joins[] = "INNER JOIN $wpdb->term_relationships AS tr ON (p.ID = tr.object_id)";
  //         $query->joins[] = $wpdb->prepare("INNER JOIN $wpdb->term_taxonomy AS tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = %s)", $tax_query->taxonomy);
  //         $query->wheres[] = $wpdb->prepare("tt.term_id = %d", $tax_query->term_id);
  //
  //       }
  //
  //       break;
  //
  //     }
  //
  //   }
  //
  // }
  //
  // /**
  //  * parse_search
  //  */
  // private function parse_search($query, $request) {
  //   global $wpdb;
  //
  //   if (isset($request->search) && is_string($request->search)) {
  //
  //     $search = $wpdb->esc_like($request->search);
  //     $query->joins[] = "INNER JOIN $wpdb->postmeta AS pms ON (p.ID = pms.post_id)";
  //     $query->wheres[] = "pms.meta_value LIKE %$search% OR p.post_title LIKE %$search%";
  //
  //   }
  //
  // }
  //
  // /**
  //  * parse_search
  //  */
  // private function parse_status($query, $request) {
  //   global $wpdb;
  //
  //   if (isset($request->post_status)) {
  //
  //     $query->wheres[] = $wpdb->prepare('p.post_status = %s', $request->post_status);
  //
  //   }
  //
  // }
  //
  // /**
  //  * parse_request
  //  */
  // public function parse_request($request) {
  //
  //   $output = array();
  //
  //   if (isset(
  //     $request->post_type,
  //     $request->num,
  //     $request->offset,
  //   ) && $request['post_type']) {
  //
  //     $query = new stdClass();
  //
  //     $query->wheres[] = $wpdb->prepare('p.post_type = %s', $request->post_type);
  //
  //     $this->parse_status($query, $request);
  //     $this->parse_order($query, $request);
  //     $this->parse_meta($query, $request);
  //     $this->parse_taxonomy($query, $request);
  //     $this->parse_search($query, $request);
  //
  //     $offset = intval($request->offset);
  //     $num = intval($request->num);
  //     $where = '';
  //     $join = '';
  //     $group = '';
  //     $order = '';
  //
  //     if ($query->wheres) {
  //
  //       $where = 'WHERE '.implode(' AND ', $query->wheres);
  //
  //     }
  //
  //     if ($query->joins) {
  //
  //       $join = implode(' ', $query->joins);
  //       $group = 'GROUP BY p.ID';
  //
  //     }
  //
  //     if ($orders) {
  //
  //       $order = implode(', ', $query->orders);
  //
  //     }
  //
  //     $output['posts'] = $wpdb->get_row("SELECT p.post_name FROM $wpdb->posts AS p $where $join $group $order LIMIT $offset, $num");
  //     $output['count'] = $wpdb->get_var("SELECT COUNT(*) FROM $wpdb->posts AS p $where $join $group");
  //
  //   } else {
  //
  //     $output['error'] = 'arguments missing';
  //
  //   }
  //
  //   return $output;
  //
  //
  //   // $post_type = esc_attr($_GET['post_type']);
  //   //
  //   // if ($post_type) {
  //   //
  //   //   $options = $this->get_post_type_options($post_type);
  //   //
  //   // } else {
  //   //
  //   //   $post_type = 'post';
  //   //
  //   // }
  //   //
  //   // if (isset($_GET['post_status'])) {
  //   //
  //   //   $post_status = esc_attr($_GET['post_status']);
  //   //
  //   // } else if (isset($options['post_status'])) {
  //   //
  //   //   $post_status = $options['post_status'];
  //   //
  //   // } else {
  //   //
  //   //   $post_status = 'publish';
  //   //
  //   // }
  //   //
  //   // if (isset($_GET['orderby'])) {
  //   //
  //   //   $orderby = esc_attr($_GET['orderby']);
  //   //
  //   // } else if (isset($options['orderby'])) {
  //   //
  //   //   $orderby = $options['orderby'];
  //   //
  //   // } else {
  //   //
  //   //   $orderby = 'date';
  //   //
  //   // }
  //   //
  //   // if (isset($_GET['order'])) {
  //   //
  //   //   $order = esc_attr($_GET['order']);
  //   //
  //   // } else if (isset($options['order'])) {
  //   //
  //   //   $order = $options['order'];
  //   //
  //   // } else {
  //   //
  //   //   $order = 'DESC';
  //   //
  //   // }
  //   //
  //   // if (isset($_GET['num'])) {
  //   //
  //   //   $num = intval($_GET['num']);
  //   //
  //   // } else if (isset($options['num'])) {
  //   //
  //   //   $num = $options['num'];
  //   //
  //   // } else {
  //   //
  //   //   $num = 50;
  //   //
  //   // }
  //   //
  //   // if (isset($_GET['offset'])) {
  //   //
  //   //   $offset = intval($_GET['offset']);
  //   //
  //   // } else {
  //   //
  //   //   $offset = 0;
  //   //
  //   // }
  //
  //   if (isset($_GET['taxonomy'], $_GET['term_id'])) {
  //
  //     $term = intval($_GET['term_id']);
  //     $taxonomy = esc_attr($_GET['taxonomy']);
  //
  //   }
  //
  //   if (isset($_GET['meta'], $_GET['term_id'])) {
  //
  //     $term = intval($_GET['term_id']);
  //     $taxonomy = esc_attr($_GET['taxonomy']);
  //
  //   }
  //
  //
  //
  //
  // }

  /**
   * @ajax karma_query_posts
   */
  public function ajax_query_posts() {

    // if (isset($_GET['request'])) {
    //
    //   // $request = json_decode(stripslashes($_GET['request']));
    //
    //
    //
    // }

    require_once KARMA_EDITOR_PATH . '/class-query.php';

    $query = new Karma_Query($_GET);

    echo json_encode($query);

    exit;

  }

  /**
   * @ajax karma_query_terms
   */
  public function ajax_query_terms() {

    require_once KARMA_EDITOR_PATH . '/class-query-taxonomy.php';

    $query = new Karma_Query_Taxonomy($_GET);

    echo json_encode($query);

    exit;

  }

  /**
   * @ajax karma_query_distinct_years
   */
  public function ajax_query_distinct_years() {
    global $wpdb;



    if (isset($_GET['field']) && $_GET['field']) {

      $field = esc_sql($_GET['field']);

      $years = $wpdb->get_col($wpdb->prepare(
        "SELECT DISTINCT YEAR($field) AS year FROM $wpdb->posts
        WHERE post_type = %s AND post_status = 'publish'
        ORDER BY $field ASC", $_GET['post_type']));

    } else if (isset($_GET['meta_key']) && $_GET['meta_key']) {
      // SELECT DISTINCT YEAR(date_added) AS "Year", MONTH(date_added) AS "Month" FROM payments

      $years = $wpdb->get_col($wpdb->prepare(
        "SELECT DISTINCT YEAR(pm.meta_value) AS year FROM $wpdb->postmeta AS pm
        INNER JOIN $wpdb->posts AS p ON (p.ID = pm.post_id)
        WHERE pm.meta_key = %s AND p.post_type = %s AND p.post_status = 'publish'
        ORDER BY pm.meta_value ASC",
        $_GET['meta_key'], $_GET['post_type']));

    } else {

      $year = array();

    }

    echo json_encode($years);
    exit;

  }

  /**
   * @ajax karma_query_distinct_status
   */
  public function ajax_query_distinct_status() {
    global $wpdb;

    $status = $wpdb->get_results($wpdb->prepare(
      "SELECT post_status, COUNT(post_status) as num FROM $wpdb->posts
      WHERE post_type = %s
      GROUP BY post_status", $_GET['post_type']));


    echo json_encode($status);
    exit;

  }



  /**
   * print page
   */
  public function print_page() {
    global $wpdb, $karma_clusters;

    $post_type = 'page';

    // $posts = $wpdb->get_results($wpdb->prepare(
    //   "SELECT * FROM $wpdb->posts
    //   WHERE post_type = %s
    //   ORDER BY post_title ASC",
    //   $post_type
    // ));

    $options = $this->get_post_type_options($post_type);

    //
    // $uris = array_map(array($karma_clusters, 'get_cluster_url'), $posts);

    // $args->locale = get_locale();


    include KARMA_EDITOR_PATH.'/include/list.php';

  }

  /**
   * @ajax karma_save_post
   */
  public function ajax_save_post() {
    global $wpdb;

    if (isset($_POST['ID'])) {

      // $args = array();
      // $args['ID'] = intval($_POST['ID']);
      // if (isset($_POST['menu_order'])) {
      //   $args['menu_order'] = intval($_POST['menu_order']);
      // }
      // if (isset($_POST['post_parent'])) {
      //   $args['post_parent'] = intval($_POST['post_parent']);
      // }



      wp_update_post($_POST);
    }

    echo json_encode($_POST);

    exit;
  }





}

new Karma_Editor;
