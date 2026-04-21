<?php
/**
 * PHPUnit bootstrap for Shift8 ScrollShot.
 *
 * Uses Brain/Monkey to mock WordPress functions so the plugin
 * can be loaded and tested without a full WordPress installation.
 *
 * @package Shift8\ScrollShot\Tests
 */

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

Brain\Monkey\setUp();

use Brain\Monkey\Functions;

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', '/tmp/wordpress/' );
}

Functions\when( 'plugin_dir_path' )->justReturn( dirname( __DIR__ ) . '/' );
Functions\when( 'plugin_dir_url' )->justReturn( 'http://example.com/wp-content/plugins/shift8-scrollshot/' );
Functions\when( 'plugin_basename' )->justReturn( 'shift8-scrollshot/shift8-scrollshot.php' );
Functions\when( 'add_action' )->justReturn( true );
Functions\when( 'add_filter' )->justReturn( true );
Functions\when( 'wp_enqueue_style' )->justReturn( true );
Functions\when( 'wp_enqueue_script' )->justReturn( true );

require dirname( __DIR__ ) . '/shift8-scrollshot.php';
