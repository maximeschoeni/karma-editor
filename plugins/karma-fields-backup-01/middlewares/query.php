<?php


Class Karma_Fields_Query {

	public $select = '';
	public $from = '';
	public $join = array();
	public $where = array();
	public $group = '';
	public $having = '';
	public $order = '';
	public $limit = '';
	public $info = array();
	public $count = 'COUNT(*)';

	public function get_sql_where() {

		if ($this->where) {

			return "WHERE ".implode(" AND ", $this->where);

		}

		return '';

	}

	public function get_sql_join() {

		return implode(" ", $this->join);

	}

	public function select() {
		global $wpdb;

		$join = $this->get_sql_join();
		$where = $this->get_sql_where();

		$sql = "SELECT $this->select FROM $this->from $join $where $this->group $this->having $this->order $this->limit";

		$this->info['sql'] = $sql;

		return $wpdb->get_results($sql);

    // $count_sql = "SELECT COUNT(*) FROM $this->from $join $where $this->group $this->having";
		//
    // return array(
    //   'query' => $this,
    //   'request' => $sql,
    //   'num' => $wpdb->get_var($count_sql),
    //   'items' => $wpdb->get_results($sql)
    // );
	}

	public function count() {
		global $wpdb;

		return 0;

		// $join = $this->get_sql_join();
		// $where = $this->get_sql_where();
		//
		// $sql = "SELECT $this->count FROM $this->from $join $where $this->having";
		//
		// $this->info['sql_count'] = $sql;
		//
		// $t0 = microtime(true);
		//
		//
		//
		// $this->info['count'] = $wpdb->get_var("SELECT COUNT(r.id) FROM {$wpdb->prefix}reservations AS r");
		//
		// $t1 = microtime(true);
		//
		//
		//
		// $this->info['sqlcounttime'] = $t1 - $t0;
		//
		// return $wpdb->get_var($sql);

	}

	public function get_sql() {
		global $wpdb;

		$join = $this->get_sql_join();
		$where = $this->get_sql_where();

    return "SELECT $this->select FROM $this->from $join $where $this->group $this->having $this->order $this->limit";

	}

	public function query() {
		global $wpdb;

		$t0 = microtime(true);

		$items = $this->select();

		$t1 = microtime(true);

		$num = $this->count();

		$t2 = microtime(true);

		// $test = $wpdb->get_results("SELECT r.* FROM {$wpdb->prefix}reservations AS r
		// 	LEFT JOIN {$wpdb->posts} AS p ON (r.spectacle_id = p.ID)
    //   LEFT JOIN {$wpdb->postmeta} AS pm ON (r.spectacle_id = pm.post_id)
		// 	WHERE pm.meta_key = 'dates'
		// 	GROUP BY r.id
		// 	LIMIT 10");
		//
		// $t3 = microtime(true);

		$this->info['timing'] = array($t1 - $t0, $t2 - $t1);
		// $this->info = $this;

    $output = array(
      // 'query' => $this,
      // 'request' => $this->get_sql(),
			'info' => $this->info,
      'num' => $num,
      'items' => $items,
    );

		// var_dump($output);

		return $output;
	}




}
