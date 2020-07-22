<?php


Class Karma_Fields_Middleware {

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

					return $driver;

				}

			}

		}

	}



}
