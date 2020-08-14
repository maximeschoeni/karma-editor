<?php
/**
 * @package karma-fields
 */
/*
Plugin Name: Karma Fields
Version: 1.0
*/



define('KARMA_FIELD_URL', WP_PLUGIN_URL . '/' . basename(dirname(__FILE__)));
define('KARMA_FIELD_PATH', dirname(__FILE__));


if (is_admin()) {

	require_once dirname(__FILE__) . '/class-field.php';

	// $karma_field = new Karma_Field;
	//
	// $karma_field->url = WP_PLUGIN_URL . '/' . basename(dirname(__FILE__));

}
