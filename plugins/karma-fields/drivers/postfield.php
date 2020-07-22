<?php

require_once KARMA_FIELDS_PATH.'/drivers/driver.php';

Class Karma_Fields_Driver_Postfield extends Karma_Fields_Driver {


	/**
	 * get
	 */
  public function get($uri, $key) {

    $id = apply_filters("karma_fields_posts_uri", $uri);

		return get_post($id)->$key;

  }

	/**
	 * update
	 */
  public function update($uri, $key, $value, &$args) {

		$args[$key] = $value;

  }

	/**
	 * sort
	 */
  public function sort($key, $order, &$args) {

		if ($key === 'post_title') {

			$args['orderby'] = 'title';

		} else if ($key === 'post_date') {

			$args['orderby'] = 'date';

		} else if ($key === 'menu_order') {

			$args['orderby'] = 'menu_order';

		}

		// $args['order'] = $order;

  }



}
