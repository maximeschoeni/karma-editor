<?php


Class Karma_Fields_Middleware {

	public $drivers = array();
	public $keys = array();

	/**
	 *	get_resource
	 */
	public function get_driver($key) {

		if (isset($this->keys[$key])) {

			$resource = $this->keys[$key];

			if (isset($resource['driver'])) {

				$driver_name = $resource['driver'];

				if (isset($this->drivers[$driver_name])) {

					require_once $this->drivers[$driver_name]['path'];

					$driver = new $this->drivers[$driver_name]['class'];

					$driver->resource = $this->keys[$key];
					$driver->key = $key;
					$driver->middleware = $this;

					return $driver;

				}

			}

		}

	}


	// /**
	//  * create_query
	//  */
  // public function create_query() {
	//
	// 	return new Karma_Fields_Query();
	//
	// }
	//
	// /**
	//  * create_query
	//  */
  // public function fetch($main_key, $request) {
	//
	// 	$query = $this->create_query();
	//
	// 	$main_driver;
	//
	// 	foreach ($this->keys as $key => $resource) {
	//
	// 		$driver = $this->get_driver($key);
	//
	// 		if ($request->has_param($key)) {
	//
	// 			$value = $request->get_param($key);
	//
	// 			$driver->filter($value, $query);
	//
	// 		}
	//
	// 		if ($request->has_param('search') && isset($resource['search']) && $resource['search']) {
	//
	// 			$value = $request->get_param('search');
	//
	// 			$driver->search($value, $query);
	//
	// 		}
	//
	// 		if ($request->get_param('orderby') === $key) {
	//
	// 			$order = $request->get_param('order');
	//
	// 			if ($order) {
	//
	// 				$order = strtoupper($order);
	//
	// 			}
	//
	// 			if ($order !== 'ASC' && $order !== 'DESC') {
	//
	// 				$order = null;
	//
	// 			}
	//
	// 			$driver->sort($order, $query);
	//
	// 		}
	//
	// 		if ($request->has_param('ppp') && $key === $main_key) {
	//
	// 			$ppp = $request->get_param('ppp');
	//
	// 			$page = $request->get_param('page');
	//
	// 			if ($page) {
	//
	// 				$page = intval($page);
	//
	// 			}
	//
	// 			if (!$page) {
	//
	// 				$page = 1;
	//
	// 			}
	//
	// 			$driver->limit($ppp, $page, $query);
	//
	// 		}
	//
	// 	}
	//
	// 	$main_driver = $this->get_driver($main_key);
	//
	//
	//
	// 	return $main_driver->fetch();
	//
	// }








	//
	// /**
	//  * query
	//  */
  // public function query($args, $request) {
  //   global $wpdb;
	//
	// 	//
  //   // $args['join']['p'] = "LEFT JOIN $wpdb->posts AS p ON (r.spectacle_id = p.ID)";
  //   // $args['join']['pm'] = "LEFT JOIN $wpdb->postmeta AS pm ON (r.spectacle_id = pm.post_id AND pm.meta_key = 'dates')";
	//
	// 	$select = '';
	// 	$from = '';
  //   $join = '';
  //   $where = '';
  //   $order = '';
  //   $limit = '';
	//
	// 	if (isset($args['select'])) {
	//
  //     $select = $args['select'];
	//
  //   }
	//
	// 	if (isset($args['from'])) {
	//
  //     $from = $args['join'];
	//
  //   }
	//
  //   if (isset($args['join']) && $args['join']) {
	//
  //     $join = implode("\n", $args['join']);
	//
  //   }
	//
  //   if (isset($args['where']) && $args['where']) {
	//
  //     $where = "WHERE ".implode(" AND ", $args['where'])."\n";
	//
  //   }
	//
  //   if (isset($args['order']) && $args['order']) {
	//
  //     $order = $args['order'];
	//
  //   }
	//
	// 	if (isset($args['limit'])) {
	//
  //     $limit = $args['limit'];
	//
  //   }
	//
  //   if ($request->has_param('ppp')) {
	//
  //     $ppp = intval($request->get_param('ppp'));
	//
  //     $limit = "LIMIT $ppp";
	//
  //   }
	//
  //   $sql = "$select $join $where GROUP BY r.id $order $limit";
	//
  //   // var_dump($sql);
	//
	// 	// $request = "SELECT p.post_title AS spectacle, r.nom, r.prenom FROM {$wpdb->prefix}reservations AS r
  //   // LEFT JOIN $wpdb->posts AS p ON (r.spectacle_id === p.ID)
  //   // LEFT JOIN $wpdb->postmeta AS pm ON (r.spectacle_id === pm.post_id AND pm.meta_key = 'date')
  //   // $where
  //   // GROUP BY r.id";
	//
  //   $reservations = $wpdb->get_results($sql);
	//
  //   $count_sql = "SELECT COUNT(r.id) AS num FROM {$wpdb->prefix}reservations AS r $join $where GROUP BY r.id";
	//
  //   // var_dump($count_sql);
	//
  //   $count = $wpdb->get_var($count_sql);
	//
  //   return array(
  //     'query' => $args,
  //     'request' => $sql,
  //     'num' => $count,
  //     'items' => $reservations
  //   );
	//
  // }

}
