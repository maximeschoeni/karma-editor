<?php
/**
 * @package Clusters
 */
/*
Plugin Name: Clusters
Version: 1.0
*/


define('KARMA_CLUSTER_URL', WP_PLUGIN_URL . '/' . basename(dirname(__FILE__)));
define('KARMA_CLUSTER_PATH', dirname(__FILE__));

require_once KARMA_CLUSTER_PATH . '/class-clusters.php';

global $karma_clusters;
$karma_clusters = new Karma_Clusters;
