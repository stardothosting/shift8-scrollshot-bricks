<?php
/**
 * Plugin Name: Shift8 ScrollShot for Bricks
 * Plugin URI:  https://shift8web.ca
 * Description: Scrolling tall-screenshot viewport effect for use with Bricks Builder. Add the class s8-scrollshot to a container and s8-scrollshot__image to an image inside it.
 * Version:     1.0.0
 * Author:      Shift8 Web
 * Author URI:  https://shift8web.ca
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: shift8-scrollshot-bricks
 * Domain Path: /languages
 * Requires at least: 5.8
 * Tested up to: 6.8
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SHIFT8_SCROLLSHOT_VERSION', '1.0.0' );
define( 'SHIFT8_SCROLLSHOT_PATH', plugin_dir_path( __FILE__ ) );
define( 'SHIFT8_SCROLLSHOT_URL', plugin_dir_url( __FILE__ ) );
define( 'SHIFT8_SCROLLSHOT_BASENAME', plugin_basename( __FILE__ ) );

require_once SHIFT8_SCROLLSHOT_PATH . 'includes/class-plugin.php';

Shift8_ScrollShot_Plugin::get_instance();
