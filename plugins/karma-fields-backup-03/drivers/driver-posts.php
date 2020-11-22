<?php


Class Karma_Fields_Driver_Posts {


  /**
	 * get
	 */
  public function get($id, $key, $request, $karma_fields) {

    $post = get_post($id);

    switch($key) {

      case 'post_name':
      case 'post_title':
      case 'post_content':
      case 'post_excerpt':
      case 'post_parent':
      case 'post_date':
      case 'post_status':
      case 'post_author':
      case 'post_type':
      case 'menu_order':
        $value = $post->$key;
        break;

      // case 'status':
      //   switch($post->post_status) {
      //     case 'trash':
      //       $value = 2;
      //       break;
      //     case 'auto-draft':
      //       $value = 0;
      //       break;
      //     default:
      //       $value = 1;
      //       break;
      //   }
      //   break;

    }

    if (isset($value)) {

      return $value;

    }

    return '';
  }

  /**
	 * update
	 */
  public function update($data, $output, $request, $karma_fields) {

    foreach ($data as $id => $item) {

      $args = array();

      $args['ID'] = intval($id);

      foreach ($item as $key => $value) {

        switch ($key) {

          case 'post_name':
          case 'post_title':
          case 'post_content':
          case 'post_excerpt':
          case 'post_date':
          case 'post_status':
          case 'post_type':
            $args[$key] = $value;
            break;

          case 'post_parent':
          case 'post_author':
          case 'menu_order':
            $args[$key] = intval($value);
            break;

          // case 'status':
          //   switch($value) {
          //     case 0:
          //       $args['post_status'] = 'auto-draft';
          //       break;
          //     case 2:
          //       $args['post_status'] = 'trash';
          //       break;
          //     default:
          //       $args['post_status'] = 'publish';
          //       break;
          //   }

        }

      }

      wp_insert_post($args);

    }

  }

  /**
	 * add
	 */
  public function add($item, $params, $request, $karma_fields) {

    $args = array();

    foreach ($item as $key => $value) {

      switch ($key) {

        case 'post_name':
        case 'post_title':
        case 'post_content':
        case 'post_excerpt':
        case 'post_date':
        case 'post_status':
        case 'post_type':
          $args[$key] = $value;
          break;

        case 'post_parent':
        case 'post_author':
        case 'menu_order':
          $args[$key] = intval($value);
          break;

        // case 'status':
        //   switch($value) {
        //     case 0:
        //       $args['post_status'] = 'auto-draft';
        //       break;
        //     case 2:
        //       $args['post_status'] = 'trash';
        //       break;
        //     default:
        //       $args['post_status'] = 'publish';
        //       break;
        //   }

      }

    }

    $id = wp_insert_post($args);

    return get_post($id);

  }

  /**
	 * query
	 */
  public function query($params, $request, $karma_fields) {

    $output = array();

    $args = array();

    $args['post_status'] = array('publish', 'pending', 'draft', 'future');
    $args['post_type'] = 'posts';
    $args['orderby'] = 'post_date';
    $args['order'] = 'DESC';

    if (isset($params['page'])) {

      $args['paged'] = $params['options']['page'];

    }

    if (isset($params['options']['ppp'])) {

      $args['posts_per_page'] = $params['options']['ppp'];

    }

    if (isset($params['order']['orderby'])) {

      if (isset($params['order']['order'])) {

        $order = $params['order']['order'];

      } else {

        $order = 'ASC';

      }

      if (isset($params['order']['driver']) && $params['order']['driver'] !== $this->name) {

        $driver = $karma_fields->get_driver($params['order']['driver']);

        if (method_exists($driver, 'order')) {

          $driver->order($args, $params['order']['orderby'], $order);

        }

      } else {

        switch ($params['options']['orderby']) {
          case 'post_name':
            $args['orderby'] = array('name' => $order, 'date' => 'DESC');
            break;
          case 'post_title':
            $args['orderby'] = array('title' => $order, 'date' => 'DESC');
            break;
          case 'post_date':
            $args['orderby'] = array('date' => $order, 'title' => 'ASC');
            break;
          case 'menu_order':
            $args['orderby'] = array('menu_order' => $order);
            break;
          case 'post_author':
            $args['orderby'] = array('author' => $order, 'title' => 'ASC', 'date' => 'DESC');
            break;
        }

      }

    }

    if (isset($params['filters'])) {

      foreach ($params['filters'] as $driver_name => $filters) {

        if ($driver_name === 'posts') {

          foreach ($filters as $key => $value) {

            switch ($key) {
              case 'post_name':
                $args['name'] = $value;
                break;
              case 'post_date':
                $args['m'] = $value; // ex:201307
                break;
              case 'post_status':
              case 'post_type':
                $args[$key] = $value;
                break;
              case 'post_parent':
                $args['post_parent'] = intval($value);
                break;
              case 'post_author':
                $args['author'] = intval($value);
                break;
              case 'search':
                $args['s'] = $value;
                break;

            }

          }

        } else {

          $driver = $karma_fields->get_driver($driver_name);

          if (method_exists($driver, 'filter')) {

            $driver->filter($args, $filters);

          }

        }

      }

    }

    $query = new WP_Query($args);

    if (isset($params['columns'])) {

      foreach ($params['columns'] as $column) {

        if (isset($column['driver']) && $column['driver'] !== $this->name) {

          $driver = $karma_fields->get_driver($driver_name);

          if (method_exists($driver, 'column')) {

            $driver->column($query->posts, $column);

          }

        }

      }

    }



    $output['sql'] = $query->request;
    $output['items'] = $query->posts;
    $output['count'] = $query->found_posts;


    return $output;

  }


  /**
	 * fetch spectacles
	 */
  public function fetch($key, $params, $request, $karma_fields) {
    global $wpdb;

    $clauses = array();

    switch ($key) {
      case 'post_date':
        $clauses['select'] = "DATE_FORMAT(p.post_date, '%Y%m') AS 'key', DATE_FORMAT(p.post_date, '%M %Y') AS 'name'";
        $clauses['group'] = "YEAR(p.post_date), MONTH(p.post_date)";
        $clauses['order'] = "p.post_date ASC";
        break;

      case 'post_status':
        $clauses['select'] = "p.post_status AS 'key', CASE
          WHEN p.post_status='draft' THEN 'Draft'
          WHEN p.post_status='publish' THEN 'Publish'
          ELSE p.post_status
          END AS 'name'";
        $clauses['group'] = "p.post_status";
        $clauses['order'] = "p.post_status ASC";

      case 'post_type':
        $clauses['select'] = "p.post_type AS 'key', CASE
          WHEN p.post_type='post' THEN 'Post'
          WHEN p.post_type='page' THEN 'Page'
          ELSE p.post_type
          END AS 'name'";
        $clauses['group'] = "p.post_type";
        $clauses['order'] = "p.post_type ASC";

      case 'post_author':
        $clauses['select'] = "p.post_author AS 'key', u.display_name AS 'name'";
        $clauses['group'] = "p.post_author";
        $clauses['order'] = "u.display_name ASC";
        $clauses['join']['u'] = "INNER JOIN $wpdb->users AS u ON (p.post_author = u.ID)"
        break;

      case 'post_author':
        $clauses['select'] = "p.ID AS 'key', p.post_title AS 'name'";
        $clauses['group'] = "p.post_title";
        $clauses['order'] = "p.post_title ASC";
        break;

    }

    if (isset($params['filters'])) {

      foreach ($params['filters'] as $driver_name => $filters) {

        if ($driver_name !== $this->name) {

          $driver = $karma_fields->get_driver($driver_name);

          if (method_exists($driver, 'filter_fetch')) {

            $driver->filter_fetch($clauses, $filters);

          }

        } else {

          if (isset($filters[$key])) {

            unset($filters[$key]);

          }

          $this->filter_fetch($clauses, $filters);

        }

      }

    }

    if (isset($clauses['select'])) {

      $select = "SELECT {$clauses['select']} FROM $wpdb->posts AS p";

    } else {

      $select = "SELECT * FROM $wpdb->posts AS p";

    }

    if (isset($clauses['where'])) {

      $where = "WHERE ".implode(" AND ", $clauses['where']);

    } else {

      $where = '';

    }

    if (isset($clauses['join'])) {

      $join = implode(" ", $clauses['join']);

    } else {

      $join = '';

    }

    if (isset($clauses['group'])) {

      $group = "GROUP BY {$clauses['group']}";

    } else {

      $group = '';

    }

    if (isset($clauses['order'])) {

      $order = "ORDER BY {$clauses['order']}";

    } else {

      $order = '';

    }

    $sql = "$select $join $where $group $order";

    $output = array();
    $output['sql'] = $sql;
    $output['items'] = $wpdb->get_results($sql);

    return $output;

  }


  /**
	 * @hook clauses_posts_fetch
	 */
  public function filter_fetch(&$clauses, $filters) {
    global $wpdb;

    foreach ($filters as $key => $value) {

      switch ($key) {
        case 'post_date':
          $year = substr($value, 0, 4);
          $month = substr($value, 4, 2);
          $next_month = $month < 12 ? intval($month+1) : 1;
          $next_year = $month < 12 ? $year : intval($year+1);
          $clauses['where'][] = "p.post_date > '$year-$month'";
          $clauses['where'][] = "p.post_date < '$next_year-$next_month'";
          break;
        case 'post_status':
        case 'post_type':
          $value = esc_sql($value);
          $key = esc_sql($key);
          $clauses['where'][] = "$key = '$value'";
          break;
        case 'post_author':
          $user_id = intval($value);
          $clauses['where'][] = "p.post_author = $user_id";
          break;
        case 'search':
          $words = explode(' ', $value);
          foreach ($words as $word) {
            $word = esc_sql($word);
            $clauses['where'][] = "(p.post_title LIKE '%$word%' OR p.post_content LIKE '%$word%' OR p.post_excerpt LIKE '%$word%' OR pm.meta_value LIKE '%$word%')";
          }
          $clauses['join']['pm'] = "LEFT JOIN $wpdb->postmeta AS pm ON (p.ID = pm.post_id)";
          break;

      }

    }

  }




}
