<?php


Class Karma_Query {

  public function __construct($request) {
    global $wpdb;

    $this->request = $request;

    $query = new stdClass();

    $this->parse_fields($query, $request);
    $this->parse_order($query, $request);
    $this->parse_meta($query, $request);
    $this->parse_taxonomy($query, $request);
    $this->parse_search($query, $request);

    $where = '';
    $join = '';
    $group = '';
    $order = '';

    if ($query->wheres) {

      $where = 'WHERE '.implode(' AND ', $query->wheres);

    }

    if ($query->joins) {

      $join = implode(' ', array_unique($query->joins));
      $group = 'GROUP BY p.ID';

    }

    if ($query->orders) {

      $order = 'ORDER BY '.implode(', ', $query->orders);

    }

    if (isset($request['num'])) {

      $limit = $wpdb->prepare("LIMIT %d, %d", isset($request['offset']) ? $request['offset'] : 0, $request['num']);

    }

    if (!isset($request['query_posts']) || $request['query_posts']) {

      $this->sql = "SELECT p.post_name, p.post_status FROM $wpdb->posts AS p $join $where $group $order $limit";

      $this->posts = $wpdb->get_results($this->sql);

    }

    if (!isset($request['query_count']) || $request['query_count']) {

      $this->count = $wpdb->get_var("SELECT COUNT(*) FROM $wpdb->posts AS p $join $where $group");

    }

    $this->query = $query;

  }

  /**
   * get_order
   */
  private function get_order($request, $default) {

    if (isset($order->order)) {

      return $order->order === 'DESC' ? 'DESC' : 'ASC';

    } else {

      return $default;

    }

  }

  /**
   * parse_order
   */
  private function parse_order($query, $request) {
    global $wpdb;

    if (isset($request['orderby'])) {

      if ($request['orderby'] === 'menu_order') {

        $order = $this->get_order($request, 'ASC');
        $query->orders[] = "p.menu_order $order";

      } else if ($request['orderby'] === 'post_title') {

        $order = $this->get_order($request, 'ASC');
        $query->orders[] = "p.post_title $order";
        $query->orders[] = 'p.post_date DESC';

      } else if ($request['orderby'] === 'post_date') {

        $order = $this->get_order($request, 'DESC');
        $query->orders[] = "p.post_date $order";
        $query->orders[] = 'p.post_title ASC';

      } else {

        $alias = 'pm_'.esc_sql($request['orderby']);

        $query->joins[] = $wpdb->prepare("LEFT JOIN $wpdb->postmeta AS $alias ON (p.ID = $alias.post_id AND $alias.meta_key = %s)", $request['orderby']);
        $order = $this->get_order($request, 'ASC');

        if (isset($request['numeric_order']) && $request['numeric_order']) {

          $query->orders[] = "LENGTH(pmo.meta_value) $order";

        }

        $query->orders[] = "pmo.meta_value $order";
        $query->orders[] = 'p.post_title ASC';
        $query->orders[] = 'p.post_date DESC';

      }

    }

  }

  /**
   * parse_order
   */
  private function parse_meta($query, $request) {
    global $wpdb;

    if (isset($request['meta_key'])) {

      $alias = 'pm_'.esc_sql($meta_query->meta_key);
      $type = isset($request['meta_type']) && $request['meta_type'] === 'NUMERIC' ? '%d' : '%s';
      $compare = isset($request['meta_compare']) ? esc_sql($request['meta_compare']) : '=';

      $query->joins[] = $wpdb->prepare("LEFT JOIN $wpdb->postmeta AS $alias ON (p.ID = $alias.post_id AND $alias.meta_key = %s)", $request['meta_key']);

      if (isset($request['meta_value']) && ($compare === '=' || $compare === '!=' || $compare === '>' || $compare === '<' || $compare === '>=' || $compare === '<=')) {

        $query->wheres[] = $wpdb->prepare("$alias.meta_value $compare $type", $request['meta_value']);

      } else if ($compare === 'BETWEEN' && isset($request['meta_value'])) {

        $values = explode(',', $request['meta_value']);

        if (count($values) === 2) {

          $query->wheres[] = "$alias.meta_value > {$values[0]} AND $alias.meta_value < {$values[1]}";

        }

      } else if ($compare === 'NOT BETWEEN' && isset($request['meta_value'])) {

        $values = explode(',', $request['meta_value']);

        if (count($values) === 2) {

          $query->wheres[] = "($alias.meta_value < {$values[0]} OR $alias.meta_value > {$values[1]})";

        }

      } else if ($compare === 'EXIST') {

        $query->wheres[] = "$alias.meta_value IS NOT NULL";

      } else if ($compare === 'NOT EXIST') {

        $query->wheres[] = "$alias.meta_value IS NULL";

      }

    }


    // if (isset($request->meta) && is_array($request->meta)) {
    //
    //   foreach (array_values($request->meta) as $index => $meta_query) {
    //
    //     if (isset($meta_query->key, $meta_query->value)) {
    //
    //       $alias = 'pm'.$index;
    //       $type = isset($meta_query->type) && $meta_query->type === 'NUMERIC' ? '%d' : '%s';
    //
    //       $query->joins[] = $wpdb->prepare("LEFT JOIN $wpdb->postmeta AS $alias ON (p.ID = $alias.post_id AND $alias.meta_key = %s)", $meta_query->key);
    //
    //       if ($meta_query->compare === '=' || $meta_query->compare === '!=' || $meta_query->compare === '>' || $meta_query->compare === '<' || $meta_query->compare === '>=' || $meta_query->compare === '<=') {
    //
    //         $query->wheres[] = $wpdb->prepare("$alias.meta_value $meta_query->compare $type", $meta_query->value);
    //
    //       } else if ($meta_query->compare === 'BETWEEN' && is_array($meta_query->value) && count($meta_query->value) === 2) {
    //
    //         $query->wheres[] = "$alias.meta_value > {$meta_query->value[0]} AND $alias.meta_value < {$meta_query->value[1]}";
    //
    //       } else if ($meta_query->compare === 'NOT BETWEEN' && is_array($meta_query->value) && count($meta_query->value) === 2) {
    //
    //         $query->wheres[] = "($alias.meta_value < {$meta_query->value[0]} OR $alias.meta_value > {$meta_query->value[1]})";
    //
    //       } else if ($meta_query->compare === 'EXIST') {
    //
    //         $query->wheres[] = "$alias.meta_value IS NOT NULL";
    //
    //       } else if ($meta_query->compare === 'NOT EXIST') {
    //
    //         $query->wheres[] = "$alias.meta_value IS NULL";
    //
    //       }
    //
    //     }
    //
    //   }
    //
    // }

  }

  /**
   * parse_order
   */
  private function parse_taxonomy($query, $request) {
    global $wpdb;

    if (isset($request['taxonomy'], $request['term_id'])) {

      $query->joins[] = "INNER JOIN $wpdb->term_relationships AS tr ON (p.ID = tr.object_id)";
      $query->joins[] = $wpdb->prepare("INNER JOIN $wpdb->term_taxonomy AS tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = %s)", $request['taxonomy']);
      $query->wheres[] = $wpdb->prepare("tt.term_id = %d", $request['term_id']);


      // foreach (array_values($request->taxonomy) as $index => $tax_query) {
      //
      //   if (isset($tax_query->taxonomy, $tax_query->term_id)) {
      //
      //     $query->joins[] = "INNER JOIN $wpdb->term_relationships AS tr ON (p.ID = tr.object_id)";
      //     $query->joins[] = $wpdb->prepare("INNER JOIN $wpdb->term_taxonomy AS tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = %s)", $tax_query->taxonomy);
      //     $query->wheres[] = $wpdb->prepare("tt.term_id = %d", $tax_query->term_id);
      //
      //   }
      //
      //   break;
      //
      // }

    }

  }

  /**
   * parse_search
   */
  private function parse_search($query, $request) {
    global $wpdb;

    if (isset($request['search']) && $request['search']) {

      $search = $wpdb->esc_like($request['search']);
      $query->joins[] = "INNER JOIN $wpdb->postmeta AS pms ON (p.ID = pms.post_id)";
      $query->wheres[] = "(pms.meta_value LIKE '%$search%' OR p.post_title LIKE '%$search%' OR p.post_content LIKE '%$search%')";

    }

  }

  /**
   * parse_search
   */
  private function parse_fields($query, $request) {
    global $wpdb;

    if (isset($request['post_status']) && $request['post_status'] !== 'all') {

      $query->wheres[] = $wpdb->prepare('p.post_status = %s', $request['post_status']);

    }

    if (isset($request['post_type'])) {

      $query->wheres[] = $wpdb->prepare('p.post_type = %s', $request['post_type']);

    }

    if (isset($request['post_title'])) {

      $query->wheres[] = $wpdb->prepare('p.post_title = %s', $request['post_title']);

    }

    if (isset($request['post_name'])) {

      $query->wheres[] = $wpdb->prepare('p.post_name = %s', $request['post_name']);

    }

    if (isset($request['year'])) {

      $query->wheres[] = $wpdb->prepare('p.post_date >= %s AND p.post_date < %s', $request['year'], intval($request['year'])+1);

    }

    if (isset($request->ID)) {

      $query->wheres[] = $wpdb->prepare('p.ID = %d', $request->ID);

    }

  }

}
