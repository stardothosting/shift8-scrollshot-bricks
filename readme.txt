=== Shift8 ScrollShot ===
Contributors: shift8web
Tags: scrollshot, screenshot, animation, scroll, viewport
Requires at least: 5.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Scrolling tall-screenshot viewport effect. Makes a tall image appear to scroll inside a fixed-height container.

== Description ==

Shift8 ScrollShot creates a scrolling screenshot viewport effect. Drop a tall image inside a container, add two CSS classes, and the plugin handles the rest. Works with any theme, page builder, or hand-coded HTML.

**Features:**

* Auto-scroll mode: the image scrolls up and down automatically on a loop
* Scroll-linked mode: image position follows the page scroll
* Configurable pause at top and bottom of the scroll cycle
* Optional browser-style frame with traffic-light dots
* Per-instance configuration via data attributes
* Multiple independent instances on one page
* Respects `prefers-reduced-motion`
* Vanilla JS with no jQuery or external libraries
* Lightweight assets (under 5 KB combined)

== Installation ==

1. Upload the `shift8-scrollshot` folder to `/wp-content/plugins/`.
2. Activate the plugin through the Plugins screen in WordPress.

== Usage ==

1. Add a container element (a div, section, or page builder container). Give it the CSS class `s8-scrollshot`.
2. Inside that container, add an image element. Give it the CSS class `s8-scrollshot__image`.
3. (Optional) Add data attributes to the container or image to configure the behavior.

Data attributes can be placed on either the wrapper or the image. If the same attribute appears on both, the wrapper value takes priority.

= Page Builder Setup =

In Bricks Builder, Elementor, or other visual builders:

1. Add a container or section element and apply the CSS class `s8-scrollshot`.
2. Add an image element inside it and apply the CSS class `s8-scrollshot__image`.
3. Use the builder's custom attributes panel to add any `data-*` attributes.

= Plain HTML Example =

    <div class="s8-scrollshot" data-mode="auto" data-duration="15000">
      <img class="s8-scrollshot__image" src="screenshot.png" alt="Screenshot">
    </div>

== Data Attributes ==

All configuration is done through HTML data attributes on the `.s8-scrollshot` container or the `.s8-scrollshot__image` element. Wrapper values take priority over image values.

* `data-mode` - `auto` or `scroll` (default: `auto`)
* `data-duration` - Total cycle time in milliseconds (default: `12000`)
* `data-end-pause` - Hold time at top and bottom in milliseconds (default: `1500`)
* `data-pause-on-hover` - `true` or `false` (default: `true`)
* `data-reverse` - `true` or `false`, controls bounce direction (default: `true`)
* `data-frame` - `none` or `browser` (default: `none`)
* `data-viewport-height` - Visible area height in pixels (default: `700`)
* `data-viewport-width` - Viewport width in pixels, `0` for auto (default: `0`)
* `data-easing` - Any CSS easing string (default: `ease-in-out`)

== Frequently Asked Questions ==

= Does it require a specific page builder? =

No. The plugin scans the DOM for `.s8-scrollshot` and `.s8-scrollshot__image` classes regardless of which theme or page builder rendered them. It works with Bricks, Elementor, Gutenberg blocks, hand-coded HTML, or any other setup.

= Can I have multiple instances on one page? =

Yes. Each `.s8-scrollshot` instance is independent.

= What happens if my image is shorter than the viewport? =

The plugin detects this and does nothing. No errors are thrown.

= How do I control the width? =

Set a width on the container element, or use the `data-viewport-width` attribute with a pixel value. The image fills the viewport width automatically.

= How do I make the scroll slower? =

Increase `data-duration`. For a slow scroll, try `15000` or `20000` (15-20 seconds per cycle). Also increase `data-end-pause` for longer holds at each end.

== Changelog ==

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.0.0 =
Initial release.
