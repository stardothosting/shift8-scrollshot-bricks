=== Shift8 ScrollShot for Bricks ===
Contributors: shift8web
Tags: bricks, scrollshot, screenshot, animation, scroll
Requires at least: 5.8
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Scrolling tall-screenshot viewport effect for Bricks Builder. Makes a tall image appear to scroll inside a fixed-height container.

== Description ==

Shift8 ScrollShot for Bricks creates a scrolling screenshot viewport effect. Drop a tall image inside a Bricks container, add two CSS classes, and the plugin handles the rest.

Features:

* Auto-scroll mode: the image scrolls up and down automatically on a loop
* Scroll-linked mode: image position follows the page scroll
* Configurable pause at top and bottom of the scroll cycle
* Optional browser-style frame with traffic-light dots
* Per-instance configuration via data attributes
* Multiple independent instances on one page
* Respects prefers-reduced-motion
* Vanilla JS with no jQuery or external libraries
* Lightweight assets (under 5 KB combined)

== Installation ==

1. Upload the shift8-scrollshot-bricks folder to /wp-content/plugins/.
2. Activate the plugin through the Plugins screen in WordPress.
3. Open a page in Bricks Builder and follow the usage guide below.

== Usage with Bricks Builder ==

Step 1: Add a Container element in Bricks. Under Style > CSS > CSS Classes, add: s8-scrollshot

Step 2: Inside that container, add an Image element. Under Style > CSS > CSS Classes, add: s8-scrollshot__image

Step 3 (optional): Select either the container or the image element and open Style > Attributes. Add data attributes to configure the behavior.

Note: Data attributes can be placed on either the wrapper or the image. If the same attribute appears on both, the wrapper value takes priority.

== Data Attributes ==

data-mode: auto or scroll (default: auto)
data-duration: total cycle time in milliseconds (default: 12000)
data-end-pause: hold time at top and bottom in milliseconds (default: 1500)
data-pause-on-hover: true or false (default: true)
data-reverse: true or false, controls bounce direction (default: true)
data-frame: none or browser (default: none)
data-viewport-height: visible area height in pixels (default: 700)
data-viewport-width: viewport width in pixels, 0 for auto (default: 0)
data-easing: any CSS easing string (default: ease-in-out)

== Frequently Asked Questions ==

= Does it work without Bricks? =

Yes. The plugin scans the DOM for .s8-scrollshot and .s8-scrollshot__image classes regardless of which theme or page builder rendered them.

= Can I have multiple instances on one page? =

Yes. Each .s8-scrollshot instance is independent.

= What happens if my image is shorter than the viewport? =

The plugin detects this and does nothing. No errors are thrown.

= How do I control the width? =

Set a width on the Bricks container element, or use the data-viewport-width attribute with a pixel value. The image fills the viewport width automatically.

= How do I make the scroll slower? =

Increase data-duration. For a slow scroll, try 15000 or 20000 (15-20 seconds per cycle). Also increase data-end-pause for longer holds at each end.

== Changelog ==

= 1.0.0 =
* Initial release.
