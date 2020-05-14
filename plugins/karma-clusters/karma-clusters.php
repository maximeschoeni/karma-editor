<?php
/**
 * @package Clusters
 */
/*
Plugin Name: Karma Clusters
Version: 2.0
*/


// define('KARMA_CACHE_URL', WP_PLUGIN_URL . '/' . basename(dirname(__FILE__)).'/plugins/karma-cache');
//
//
// define('KARMA_CACHE_PATH', dirname(__FILE__).'/plugins/karma-cache');





class Karma_Clusters {

  public function __construct() {
    global $karma_cache;

    require_once dirname(__FILE__) . '/plugins/karma-cache/karma-cache.php';  //KARMA_CACHE_PATH . '/karma-cache.php';

    $karma_cache->path = 'wp-content/clusters';

    add_filter('karma_cache_get_uri', function($path, $post) {
      return (string) $post->ID;
    }, 10, 2);

    add_filter('karma_cache_get_post', function($post, $uri) {
      return get_post($uri);
    }, 10, 2);


  }


}

function karma_register_cluster($post_type, $callback) {

  add_action('karma_cache_'.$post_type, function($post, $cache) use($callback) {

    $cluster = new stdClass();
    call_user_func($callback, $cluster, $post, null);

    $cache->update($post, 'data.json', $cluster);
  }, 10, 2);

}

function karma_get_cluster($typeface_id, $post_type = null) {
  global $karma_cache;

  $typeface = get_post($typeface_id);

  if ($typeface) {

    return $karma_cache->get_value($typeface, 'data.json');

  }

}


global $karma_clusters;
$karma_clusters = new Karma_Clusters;
