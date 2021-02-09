<?php
/**
 * @package karma-editor
 */
/*
Plugin Name: Karma Editor
Version: 1.0
*/

define('KARMA_EDITOR_URL', WP_PLUGIN_URL . '/' . basename(dirname(__FILE__)));
define('KARMA_EDITOR_PATH', dirname(__FILE__));

define('KARMA_FIELDS_URL', WP_PLUGIN_URL . '/' . basename(dirname(__FILE__)).'/plugins/karma-fields-v10');
define('KARMA_FIELDS_PATH', dirname(__FILE__).'/plugins/karma-fields-v10');

require_once KARMA_EDITOR_PATH . '/class-editor.php';
