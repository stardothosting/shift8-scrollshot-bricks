<?php
/**
 * Unit tests for Shift8_ScrollShot_Plugin.
 *
 * @package Shift8\ScrollShot\Tests\Unit
 */

namespace Shift8\ScrollShot\Tests\Unit;

use Brain\Monkey;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;

class PluginTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();

		Functions\when( 'plugin_dir_path' )->justReturn( '/test/path/' );
		Functions\when( 'plugin_dir_url' )->justReturn( 'http://example.com/wp-content/plugins/shift8-scrollshot/' );
		Functions\when( 'plugin_basename' )->justReturn( 'shift8-scrollshot/shift8-scrollshot.php' );
		Functions\when( 'add_action' )->justReturn( true );
	}

	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}

	public function test_singleton_returns_same_instance(): void {
		$a = \Shift8_ScrollShot_Plugin::get_instance();
		$b = \Shift8_ScrollShot_Plugin::get_instance();

		$this->assertSame( $a, $b );
		$this->assertInstanceOf( \Shift8_ScrollShot_Plugin::class, $a );
	}

	public function test_class_is_final(): void {
		$ref = new \ReflectionClass( \Shift8_ScrollShot_Plugin::class );
		$this->assertTrue( $ref->isFinal() );
	}

	public function test_constructor_is_private(): void {
		$ref = new \ReflectionClass( \Shift8_ScrollShot_Plugin::class );
		$ctor = $ref->getConstructor();

		$this->assertTrue( $ctor->isPrivate() );
	}

	public function test_enqueue_assets_registers_style_and_script(): void {
		$enqueued = array();

		Functions\when( 'wp_enqueue_style' )->alias( function () use ( &$enqueued ) {
			$enqueued['style'] = func_get_args();
		} );

		Functions\when( 'wp_enqueue_script' )->alias( function () use ( &$enqueued ) {
			$enqueued['script'] = func_get_args();
		} );

		$plugin = \Shift8_ScrollShot_Plugin::get_instance();
		$plugin->enqueue_assets();

		$this->assertArrayHasKey( 'style', $enqueued );
		$this->assertArrayHasKey( 'script', $enqueued );

		// Handle: shift8-scrollshot
		$this->assertSame( 'shift8-scrollshot', $enqueued['style'][0] );
		$this->assertSame( 'shift8-scrollshot', $enqueued['script'][0] );

		// Version matches constant
		$this->assertSame( SHIFT8_SCROLLSHOT_VERSION, $enqueued['style'][3] );
		$this->assertSame( SHIFT8_SCROLLSHOT_VERSION, $enqueued['script'][3] );

		// Script loaded in footer with defer strategy
		$this->assertIsArray( $enqueued['script'][4] );
		$this->assertTrue( $enqueued['script'][4]['in_footer'] );
		$this->assertSame( 'defer', $enqueued['script'][4]['strategy'] );
	}

	public function test_enqueue_assets_uses_correct_file_paths(): void {
		$enqueued = array();

		Functions\when( 'wp_enqueue_style' )->alias( function () use ( &$enqueued ) {
			$enqueued['style_url'] = func_get_args()[1];
		} );

		Functions\when( 'wp_enqueue_script' )->alias( function () use ( &$enqueued ) {
			$enqueued['script_url'] = func_get_args()[1];
		} );

		$plugin = \Shift8_ScrollShot_Plugin::get_instance();
		$plugin->enqueue_assets();

		$this->assertStringContainsString( 'assets/css/scrollshot.css', $enqueued['style_url'] );
		$this->assertStringContainsString( 'assets/js/scrollshot.js', $enqueued['script_url'] );
	}

	public function test_enqueue_assets_has_no_dependencies(): void {
		$enqueued = array();

		Functions\when( 'wp_enqueue_style' )->alias( function () use ( &$enqueued ) {
			$enqueued['style_deps'] = func_get_args()[2];
		} );

		Functions\when( 'wp_enqueue_script' )->alias( function () use ( &$enqueued ) {
			$enqueued['script_deps'] = func_get_args()[2];
		} );

		$plugin = \Shift8_ScrollShot_Plugin::get_instance();
		$plugin->enqueue_assets();

		$this->assertEmpty( $enqueued['style_deps'] );
		$this->assertEmpty( $enqueued['script_deps'] );
	}

	public function test_version_constant_is_defined(): void {
		$this->assertTrue( defined( 'SHIFT8_SCROLLSHOT_VERSION' ) );
		$this->assertSame( '1.0.0', SHIFT8_SCROLLSHOT_VERSION );
	}

	public function test_path_constant_is_defined(): void {
		$this->assertTrue( defined( 'SHIFT8_SCROLLSHOT_PATH' ) );
		$this->assertNotEmpty( SHIFT8_SCROLLSHOT_PATH );
	}

	public function test_url_constant_is_defined(): void {
		$this->assertTrue( defined( 'SHIFT8_SCROLLSHOT_URL' ) );
		$this->assertNotEmpty( SHIFT8_SCROLLSHOT_URL );
	}

	public function test_public_methods_exist(): void {
		$ref = new \ReflectionClass( \Shift8_ScrollShot_Plugin::class );

		$this->assertTrue( $ref->hasMethod( 'get_instance' ) );
		$this->assertTrue( $ref->hasMethod( 'enqueue_assets' ) );

		$this->assertTrue( $ref->getMethod( 'get_instance' )->isPublic() );
		$this->assertTrue( $ref->getMethod( 'enqueue_assets' )->isPublic() );
	}

	public function test_css_file_exists(): void {
		$this->assertFileExists(
			dirname( __DIR__, 2 ) . '/assets/css/scrollshot.css'
		);
	}

	public function test_js_file_exists(): void {
		$this->assertFileExists(
			dirname( __DIR__, 2 ) . '/assets/js/scrollshot.js'
		);
	}

	public function test_languages_directory_exists(): void {
		$this->assertDirectoryExists(
			dirname( __DIR__, 2 ) . '/languages'
		);
	}
}
