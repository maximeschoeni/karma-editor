<?php


class Karma_Fields_Object {


	/**
	 * parse_param
   *
   * array = {a: {b: c: 5}}
   * path = ["a", "b", "d"]
   * value = 6
   * array -> {a: {b: c: 5, d: 6}}
	 */
	public static function set(&$array, $path, $value) {

		$key = array_shift($path);

    if (isset($key)) {

      if (count($path)) {

  			if (empty($array[$key])) {

  				$array[$key] = array();

  			}

  			self::set($array[$key], $path, $value);

  		} else {

  			$array[$key] = $value;

  		}

    } else {

      $array = $value;

    }

	}

  /**
	 * set_value_deep
   * array = {a: {b: 3}}
   * keys = ["a", "c"]
   * value = 5
   * array => {a: {b: 3, c: 5}}
	 */
	// public function set_value_deep(&$array, $keys, $value) {
  //
	// 	if (isset($keys[0])) {
  //
	// 		$key = $keys[0];
  //
	// 		if (isset($keys[1])) {
  //
	// 			if (empty($array[$key]) || !is_array($array[$key])) {
  //
	// 				$array[$key] = array();
  //
	// 			}
  //
	// 			$this->set_value_deep($array[$key], array_slice($keys, 1), $value);
  //
	// 		} else {
  //
	// 			$array[$key] = $value;
  //
	// 		}
  //
	// 	}
  //
	// }


	/**
	 * parse deep query object
   * object = {"a/b/c": 3, "a/b/d": 4}
   * return {a: {b: c: 3, d: 4}}
	 */
	public static function parse_query_object($object) {

		$results = array();

		foreach ($object as $key => $value) {

			$path = explode('/', $key);

      self::set($results, $path, $value);

		}

		return $results;
	}

	// /**
	//  *	parse_object
	//  */
	// public function parse_request_object($request) {
  //
	// 	$params = $request->get_params();
  //
	// 	return $this->parse_query_object($params);
  //
	// }




	/**
	 * clean and clone array
   * obj = {a: {b: {c: {}}, d:null, e: 5}}
   * return {a: {e: 5}}
	 */
	public static function clean($obj) {

		$clone = array();

		foreach ($obj as $key => $child) {

			if (is_array($child)) {

				$child = self::clean($child);

				if (!empty($child)) {

					$clone[$key] = $child;

				}

			} else if ($child !== null) {

				$clone[$key] = $child;

			}

		}

		return $clone;
	}

	/**
	 * merge_object_deep
   * var array1 = {a: {b: 3}}
   * var array2 = {a: {c: 4}}
   * array1 => {a: {b: 3, c: 4}}
	 */
	public static function merge(&$array1, $array2) {

		if (is_array($array2)) {

			if (!is_array($array1)) {

				$array1 = array();

			}

		  foreach ($array2 as $key => $value) {

				self::merge($array1[$key], $value);

		  }

		} else {

			$array1 = $array2;

		}

	}

	/**
	 * unset_value_deep
   * array = {a: {b: 3, c: 5}}
   * keys = ["a", "c"]
   * array => {a: {b: 3}}
	 */
	public static function remove(&$array, $keys) {

		if (isset($keys[0])) {

			$key = $keys[0];

			if (isset($keys[1])) {

				if (isset($array[$key]) && is_array($array[$key])) {

					self::remove($array[$key], array_slice($keys, 1));

				}

			} else if (isset($array[$key])) {

				unset($array[$key]);

			}

		}

	}



  /**
	 * pad_object // why??
   * obj = {a: {b: {c: 5, d: 6}}}
   * value = 3
   * -> {a: {b: {c: 3, d: 3}}}
	 */
	public static function pad_object($obj, $value = 0) {

		$paths = array();

		foreach ($obj as $key => $child) {

			if (is_array($child) || is_object($child)) {

				$paths[$key] = self::pad_object($child, $value);

			} else {

				$paths[$key] = $value;
			}

		}

		return $paths;
	}



  /**
   *	parse_object Why??
   *
   *
   * obj = {a: {b: {c: 3, d: 4}}}
   * -> [["a", "b", "c"], ["a", "b", "d"]]
   */
  public static function parse_object($obj) {

    $paths = array();

    foreach ($obj as $key => $child) {

      if (is_array($child) || is_object($child)) {

        $child_paths = self::parse_object($child);

        foreach ($child_paths as &$child_path) {

          array_unshift($child_path, $key);

        }

        $paths = array_merge($paths, $child_paths);

      } else {

        $paths[] = array($key);
      }

    }

    return $paths;
  }






}
