<?php

/*
Plugin Name: Karma Cheat
Version: 1.0
*/


define('KARMA_CACHE_URL', WP_PLUGIN_URL . '/' . basename(dirname(__FILE__)));
define('KARMA_CACHE_PATH', dirname(__FILE__));

require_once KARMA_CACHE_PATH . '/class-cache.php';

global $karma_cache;
$karma_cache = new Karma_Cache;
