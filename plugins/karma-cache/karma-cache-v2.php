<?php

/**
 *	Class Karma_Cache
 */
class Karma_Cache {

	var $version = '1';
	var $path = 'wp-content/caches';


	/**
	 *	Constructor
	 */
	public function __construct() {

		require_once plugin_dir_path( __FILE__ ) . 'class-posts.php';


		add_action('wp_ajax_karma_cache_flush', array($this, 'ajax_flush_cache'));

		add_action('parse_request', array($this, 'parse_request'), 11);

		// add_action('save_post', array($this, 'save_post'), 20, 3);
		// add_action('karma_cache_save_post', array($this, 'save_post'), 10, 3);

		if (is_admin()) {


			// add_action('before_delete_post', array($this, 'delete_post'), 99);
			add_action('admin_bar_menu', array($this, 'add_toolbar_button'), 999);

		}

		// add_action('sublanguage_init', array($this, 'sublanguage_init'), 11);
		// add_action('sublanguage_init', array($this, 'sublanguage_admin_init'));


		// add_action('karma_fields_parse_uri', array($this, 'get_post')); // deprecated!

		// Public API
		// add_filter('karma_cache_parse_uri', array($this, 'parse_post'), 10, 2);
		// add_filter('karma_cache_format_uri', array($this, 'format_uri'), 10, 2);
		add_filter('karma_cache_url', array($this, 'get_url'));
		add_action('karma_cache_update', array($this, 'karma_cache_update'), 10, 4);

		// karma fields
		// add_filter('karma_fields_id', array($this, 'karma_fields_get_id'));

		add_action('init', array($this, 'init'));


	}


	/**
	 * @hook 'parse_request'
	 */
	// public function sublanguage_init() {
	//
	// 	require_once plugin_dir_path( __FILE__ ) . 'class-multilanguage.php';
	//
	// }

	/**
	 * get post value
	 */
	// public function get_value($post, $filename) {
	//
	// 	$value = $this->get($post, $filename);
	//
	// 	if (!$value) {
	//
	// 		do_action('karma_cache_'.$post->post_type, $post, $this);
	// 		do_action('karma_cache', $post, $this);
	//
	// 		$value = $this->get($post, $filename);
	//
	// 	}
	//
	// 	return $value;
	//
	// }

	/**
	 * parse_path
	 */
	// public function parse_path($path) {
	//
	// 	$parts = explode('/', $path);
	//
	// 	$locator = new stdClass();
	// 	$locator->path = $path;
	// 	$locator->middleware = array_shift($parts);
	// 	$locator->key = array_pop($parts);
	// 	$locator->uri = implode('/', $parts);
	//
	//
	// 	// $file_parts = explode('.', $locator->filename);
	// 	//
	// 	// $locator->extension = array_pop($file_parts);
	// 	// $locator->key = array_pop($file_parts);
	// 	// $locator->group = array_pop($file_parts);
	//
	// 	// if (isset($this->middlewares[$middleware])) {
	// 	//
	// 	// 	$locator->object = $this->middlewares[$middleware]->get_object($locator->uri);
	// 	//
	// 	// }
	//
	// 	return $locator;
	//
	// }


	/**
	 * @hook 'parse_request'
	 */
	public function parse_request($wp) {

		if (strpos($wp->request, $this->path) === 0) {

			$path = trim(substr($wp->request, strlen($this->path)), '/');

			$value = $this->request($path);

			if (isset($value)) {

				if (pathinfo($path, PATHINFO_EXTENSION) === 'json') {

					$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

					header('Content-Type: application/json');

				}

				echo $value;

			} else {

				header('HTTP/1.1 404 Not Found');

			}

			exit;



			// $locator = $this->parse_path($path);
			//
			// // $object = $this->get_object($locator->middleware, $locator->uri);
			// //
			// // if ($object) {
			//
			// 	// do_action('karma_cache_request', $object, $locator, $this);
			// 	do_action('karma_cache_request', $locator->middleware, $locator->uri, $locator->key, $this);
			// 	do_action("karma_cache_{$locator->middleware}_request", $locator->uri, $locator->key, $this);
			//
			// 	$value = $this->get($path);
			//
			// 	if (isset($value)) {
			//
			// 		if (pathinfo($locator->key, PATHINFO_EXTENSION) === 'json') {
			//
			// 			$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
			//
			// 		}
			//
			// 		echo $value;
			// 		exit;
			//
			// 	} else {
			//
			// 		header('HTTP/1.1 404 Not Found');
			// 		exit;
			//
			// 	}

			// } else {
			//
			// 	header('HTTP/1.1 404 Not Found');
			// 	die('karma cache error: post not found');
			//
			// }

		}

	}

	/**
	 * get
	 */
	public function request($path) {

		$value = $this->get($path);

		if (!isset($value)) {

			$parts = explode('/', $path);

			$middleware = array_shift($parts);
			$file = array_pop($parts);
			$uri = implode('/', $parts);

			// $extension = pathinfo($file, PATHINFO_EXTENSION);
			// $key = pathinfo($file, PATHINFO_FILENAME);

			do_action('karma_cache_request', $middleware, $uri, $file, $this);
			do_action("karma_cache_{$middleware}_request", $uri, $file, $this);

			$value = $this->get($path);

		}

		return $value;

	}

	// /**
	//  * @hook 'parse_request'
	//  */
	// public function flush($middleware, $uri, $key, $extension) {
	//
	// 	do_action('karma_cache_request', $middleware, $uri, $key, $extension, $this);
	//
	// }
	//
	// /**
	//  * get
	//  */
	// public function has($path) {
	//
	// 	$file = ABSPATH.$this->path.'/'.$path;
	//
	// 	return glob($path);
	//
	// }

	/**
	 * get
	 */
	public function get($path) {

		$file = ABSPATH.$this->path.'/'.$path;

		if (file_exists($file)) {

			$value = file_get_contents($file);

			if (pathinfo($path, PATHINFO_EXTENSION) === 'json') {

				$value = json_decode($value);

			}

			return $value;
		}

	}

	/**
	 * delete
	 */
	public function delete($path) {

		$file = ABSPATH.$this->path.'/'.$path;

		if (file_exists($file)) {

			unlink($file);

		}

	}

	/**
	 * delete
	 */
	public function delete_dir($path) {

		$file = ABSPATH.$this->path.'/'.$path;

		$this->rrmdir($file);

	}

	/**
	 * update
	 */
	public function update($path, $value) {

		if (pathinfo($path, PATHINFO_EXTENSION) === 'json') {

			$value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

		}

		$file = ABSPATH.$this->path.'/'.$path;

		if (!file_exists(dirname($file))) {

			mkdir(dirname($file), 0777, true);

		}

		file_put_contents($file, $value);

	}

	/**
	 * Remove directory and all content
	 */
	private function rrmdir($dir) {

		if (is_dir($dir)) {

			$objects = scandir($dir);

			foreach ($objects as $object) {

				if ($object != "." && $object != "..") {

					$this->rrmdir($dir."/".$object);

				}

			}

			rmdir($dir);

		} else if (is_file($dir)) {

			unlink($dir);

		}

	}

	// /**
	//  * @hook "save_post"
	//  */
	// public function save_post($post_id, $post, $update = null) {
	//
	// 	do_action('karma_cache_'.$post->post_type, $post, $this);
	// 	do_action('karma_cache', $post, $this);
	//
	// }

	/**
	 * @hook "karma_cache_save_object"
	 */
	// public function save_object($middleware, $object) {
	//
	// 	do_action('karma_cache_'.$middleware, $object, $this);
	//
	// }
	//
	// /**
	//  * @hook "karma_cache_delete_object"
	//  */
	// public function delete_object($middleware, $object) {
	//
	// 	if (isset($this->middlewares[$middleware])) {
	//
	// 		$slug = $this->middlewares[$middleware]->get_slug($object);
	//
	// 		$this->delete_object($slug);
	//
	// 	}
	//
	// 	do_action('karma_cache_'.$middleware, $object, $this);
	//
	// }



	/**
	 * @ajax 'karma_cache_flush'
	 */
	public function ajax_flush_cache() {

		$this->rrmdir(ABSPATH.$this->path);

		do_action('karma_cache_flush'); // -> clear posts dependancies

		echo json_encode('ok');
		exit;

	}

	/**
	 * @callbak 'admin_bar_menu'
	 */
	public function add_toolbar_button( $wp_admin_bar ) {

		if (current_user_can('manage_options')) {

			$wp_admin_bar->add_node(array(
				'id'    => 'karma-cache-flush',
				// 'parent' => 'clusters-group',
				'title' => 'Delete Cache',
				'href'  => '#',
				'meta'  => array(
					'onclick' => 'var link = this;fetch("'.admin_url('admin-ajax.php').'", {method: "post", headers: {"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"}, body: "action=karma_cache_flush", credentials: "same-origin"}).then(function(response) {link.innerText="Delete Cache"});link.innerText="...";link.blur();return false;'
				)
			));

		}

	}





	// /**
	//  * Public API
	//  * @filter 'karma_cache_parse_uri'
	//  */
	// public function parse_uri($post, $uri) {
	//
	// 	return $this->get_post($uri);
	//
	// }

	/**
	 * get_middleware
	 */
	// public function get_middleware($middleware_name) {
	//
	// 	foreach ($this->middlewares as $middleware) {
	//
	// 		if ($middleware->name === $middleware_name) {
	//
	// 			return $middleware;
	//
	// 		}
	//
	// 	}
	//
	// }

	/**
	 * get_object
	 */
	// public function get_object($middleware_name, $uri) {
	//
	// 	// $middleware = $this->get_middleware($middleware_name);
	// 	$middleware = $this->middlewares[$middleware_name];
	//
	// 	if ($middleware) {
	//
	// 		return $middleware->get_object($uri);
	//
	// 	}
	//
	// }



	/**
	 * Public API
	 * @filter 'karma_cache_object_url'
	 */
	public function get_url($path) {

		return home_url($this->path);

	}

	// /**
	//  * Public API
	//  * @filter 'karma_fields_object_url'
	//  */
	// public function karma_fields_object_url($url, $middleware_name, $object) {
	//
	// 	$location = get_object_location($middleware_name, $object);
	//
	// 	if ($location) {
	//
	// 		return home_url($location);
	//
	// 	}
	//
	// 	return $url;
	// }

	// /**
	//  * Karma Fields
	//  * @filter 'karma_field_id'
	//  */
	// public function karma_fields_get_id($uri) {
	//
	// 	$post = $this->get_post($uri);
	//
	// 	if ($post) {
	//
	// 		 $uri = $post->ID;
	//
	// 	}
	//
	// 	return $uri;
	// }

	/**
	 * Karma Fields
	 * @hook 'karma_cache_update'
	 */
	public function karma_cache_update($middleware, $uri, $key, $value) {

		$this->update("$middleware/$uri/$key", $value);

	}


	/**
	 * @hook init
	 */
	public function init() {

		// $this->register_middleware(array(
		// 	'slug' => 'posts',
		// 	'get_object' => function($slug) {
		//
		// 	},
		// 	'get_slug' => function($object) {
		//
		// 	}
		//
		// );


		do_action('karma_cache_init', $this);

	}

	/**
	 * register_middleware
	 */
	public function register_middleware($name, $args) {

		$this->middlewares[$name] = $args;

	}

}

global $karma_cache;
$karma_cache = new Karma_Cache;
