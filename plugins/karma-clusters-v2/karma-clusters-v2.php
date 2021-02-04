<?php
/**
 * @package Clusters
 */
/*
Plugin Name: Karma Clusters
Version: 2.0
*/




class Karma_Clusters {

  public function __construct() {
    // global $karma_cache;

    require_once dirname(__FILE__) . '/plugins/karma-cache/karma-cache-v2.php';  //KARMA_CACHE_PATH . '/karma-cache.php';

//     $karma_cache->path = 'wp-content/clusters';


  }

  public function get_post_cluster($post) {
    global $karma_cache_posts;

    $post = get_post($post);

    $value = $karma_cache_posts->request($post->ID, 'data.json');

    return $value;

  }

  public function get_cluster($uri) {
    global $karma_cache;

    $value = $karma_cache->request("posts/{$uri}/data.json");

    return $value;

  }

  public function get_path($post) {
    global $karma_cache_posts;

    $post = get_post($post);

    return $karma_cache_posts->get_uri($post->ID);

  }

}


global $karma_clusters;
$karma_clusters = new Karma_Clusters;

function karma_register_cluster($post_type, $callback) {



  $hook = function($post, $post_cache) use($callback) {
  
    $cluster = new stdClass();
    call_user_func($callback, $cluster, $post, $post_cache);
    $post_cache->update($post->ID, 'data.json', $cluster);
  };

  add_action('karma_cache_posts_request_post_'.$post_type, $hook, 10, 2);
  add_action('karma_cache_posts_save_post_'.$post_type, $hook, 10, 2);

}


function karma_get_cluster($post_id, $post_type = null) {
  global $karma_cache_posts;

  return $karma_cache_posts->request($post_id, 'data.json');

  
}
