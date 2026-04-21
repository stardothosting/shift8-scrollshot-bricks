<?php
/**
 * Core plugin class. Handles asset enqueueing for the frontend.
 *
 * Bricks stores page content as JSON in postmeta, so we cannot reliably
 * inspect post_content for the marker class. Assets are enqueued
 * unconditionally on the frontend (they are small) and the JS exits
 * immediately when no .s8-scrollshot elements exist on the page.
 *
 * @package Shift8_ScrollShot
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Shift8_ScrollShot_Plugin {

	/** @var self|null */
	private static $instance = null;

	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
	}

	public function load_textdomain(): void {
		load_plugin_textdomain(
			'shift8-scrollshot-bricks',
			false,
			dirname( SHIFT8_SCROLLSHOT_BASENAME ) . '/languages'
		);
	}

	/**
	 * Enqueue frontend CSS and JS.
	 *
	 * We intentionally skip is_admin() checks because wp_enqueue_scripts
	 * only fires on the frontend. Assets are lightweight (~3 KB combined)
	 * and the JS bails out instantly if no matching DOM nodes are found.
	 */
	public function enqueue_assets(): void {
		wp_enqueue_style(
			'shift8-scrollshot',
			SHIFT8_SCROLLSHOT_URL . 'assets/css/scrollshot.css',
			array(),
			SHIFT8_SCROLLSHOT_VERSION
		);

		wp_enqueue_script(
			'shift8-scrollshot',
			SHIFT8_SCROLLSHOT_URL . 'assets/js/scrollshot.js',
			array(),
			SHIFT8_SCROLLSHOT_VERSION,
			true
		);
	}
}
