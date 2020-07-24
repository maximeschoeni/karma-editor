<?php


Class Karma_Fields_Driver {

  public $resource;
  public $key;

  public function get_cache() {

    if (!isset($this->resource['cache']) || $this->resource['cache'] === true) {

      if (isset($this->resource['type']) && $this->resource['type'] === 'json') {

        return $this->key.'.json';

      } else {

        return $this->key.'.txt';

      }

    } else if ($this->resource['cache']) {

      return $this->resource['cache'];

    }

  }

	// /**
	//  * get
	//  */
  // public function get($uri, $key) {
  //
  //   $id = apply_filters("karma_fields_posts_uri", $uri);
  //
	// 	return get_post($id)->$key;
  //
  // }
  //
	// /**
	//  * update
	//  */
  // public function update($uri, $key, $value, &$args) {
  //
	// 	$args[$key] = $value;
  //
  // }
  //
	// /**
	//  * sort
	//  */
  // public function sort($key, $order, &$args) {
  //
	// 	if ($key === 'post_title') {
  //
	// 		$args['orderby'] = 'title';
  //
	// 	} else if ($key === 'post_date') {
  //
	// 		$args['orderby'] = 'date';
  //
	// 	} else if ($key === 'menu_order') {
  //
	// 		$args['orderby'] = 'menu_order';
  //
	// 	}
  //
	// 	// $args['order'] = $order;
  //
  // }



}
