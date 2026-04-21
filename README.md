# Shift8 ScrollShot for Bricks

A WordPress plugin that creates a scrolling tall-screenshot viewport effect, designed for use with Bricks Builder but compatible with any theme or page builder.

A tall image is clipped by a fixed-height viewport and animates vertically inside it, giving the appearance of someone scrolling through a webpage.

## Requirements

- WordPress 5.8+
- PHP 7.4+
- Bricks Builder (recommended, not required)

## Installation

1. Upload the `shift8-scrollshot-bricks` folder to `/wp-content/plugins/`.
2. Activate the plugin in the WordPress admin.

## Quick Start

In Bricks Builder:

1. Add a **Container** element. Give it the CSS class `s8-scrollshot`.
2. Inside the container, add an **Image** element. Give it the CSS class `s8-scrollshot__image`.
3. Use a tall image (for example, a full-page screenshot).
4. Optionally add data attributes to the container or image to configure behavior.

The plugin automatically detects elements with these classes and applies the scroll effect.

## How It Works

The plugin scans the page for `.s8-scrollshot` wrappers on DOMContentLoaded. For each wrapper, it:

1. Locates the `.s8-scrollshot__image` inside it.
2. Reads configuration from `data-*` attributes on the wrapper and image.
3. Injects a `.s8-scrollshot__viewport` div with overflow hidden and a fixed height.
4. Measures the image and calculates the maximum vertical travel distance.
5. Starts the chosen animation mode (auto or scroll-linked).

Animations only run when the element is visible in the browser viewport (via IntersectionObserver). The image is moved using `transform: translateY()` for GPU-accelerated rendering.

## Data Attributes

Configuration is done entirely through HTML data attributes. Place them on the outer `.s8-scrollshot` container or on the `.s8-scrollshot__image` element. If the same attribute exists on both, the wrapper value wins.

| Attribute              | Type    | Default        | Description                                         |
|------------------------|---------|----------------|-----------------------------------------------------|
| `data-mode`            | string  | `auto`         | `auto` for looping animation, `scroll` for scroll-linked |
| `data-duration`        | integer | `12000`        | Total cycle time in milliseconds (auto mode)        |
| `data-end-pause`       | integer | `1500`         | Hold time at top and bottom in ms (auto mode)       |
| `data-pause-on-hover`  | boolean | `true`         | Pause auto animation on mouse hover                 |
| `data-reverse`         | boolean | `true`         | Bounce back to top after reaching bottom             |
| `data-frame`           | string  | `none`         | `browser` adds a chrome bar with traffic-light dots  |
| `data-viewport-height` | integer | `700`          | Visible viewport height in pixels                   |
| `data-viewport-width`  | integer | `0`            | Viewport width in pixels. 0 = fill container width  |
| `data-easing`          | string  | `ease-in-out`  | CSS easing function for motion segments              |

### Example

```html
<div class="s8-scrollshot"
     data-mode="auto"
     data-duration="15000"
     data-end-pause="2000"
     data-frame="browser"
     data-viewport-height="600">
  <img class="s8-scrollshot__image"
       src="full-page-screenshot.png"
       alt="Website screenshot">
</div>
```

## Modes

### Auto Mode (default)

The image scrolls from top to bottom and back on a continuous loop. The `data-duration` attribute controls the total cycle time. The `data-end-pause` attribute adds a configurable hold at the top and bottom before the image reverses direction.

Set `data-reverse="false"` to scroll in one direction only (top to bottom, then jump back to top).

### Scroll-Linked Mode

Set `data-mode="scroll"` to tie the image position to the page scroll. As the visitor scrolls past the element, the image pans from top to bottom. This requires enough page content to allow scrolling.

## Browser Frame

Set `data-frame="browser"` to add a simple browser-style chrome bar above the viewport with three colored dots (close, minimize, maximize). The frame is rendered with CSS only, no image assets required.

## Controlling Width

The image fills the viewport width by default. To control the overall width:

- Set a width on the Bricks container element (recommended), or
- Use `data-viewport-width="500"` to set a fixed pixel width.

For best image quality, use the **Full** image size in Bricks rather than Large or Medium, so the browser has a high-resolution source to work with.

## Accessibility

- Respects `prefers-reduced-motion: reduce`. When active, animation is disabled and the image displays statically.
- Does not interfere with keyboard navigation.
- Images retain their `alt` attribute for screen readers.
- Hover-pause is optional and does not affect keyboard users.

## Performance

- Vanilla JavaScript, no jQuery or third-party libraries.
- Animations use `transform: translateY()` with `will-change` for GPU compositing.
- IntersectionObserver pauses animations when the element is off-screen.
- Scroll mode uses `requestAnimationFrame` with a single passive scroll listener.
- Resize handling is debounced.
- Assets are only ~4 KB combined and the JS exits immediately if no matching elements are found.

## Plugin Structure

```
shift8-scrollshot-bricks/
  shift8-scrollshot-bricks.php   # Plugin bootstrap, constants, autoload
  includes/
    class-plugin.php             # Singleton class, frontend asset enqueueing
  assets/
    css/scrollshot.css            # Viewport, frame, reduced-motion styles
    js/scrollshot.js              # Frontend controller
  languages/
    readme.txt                   # Placeholder for translation files
  tests/
    bootstrap.php                # PHPUnit bootstrap with Brain/Monkey
    unit/
      PluginTest.php             # Unit tests for the PHP class
  composer.json                  # Dev dependencies (phpunit, brain/monkey)
  phpunit.xml                    # PHPUnit configuration
  readme.txt                     # WordPress.org readme
  README.md                      # This file
```

## Development

### Running Tests

```bash
composer install
./vendor/bin/phpunit --testdox
```

### CSS and JS

Edit files in `assets/css/` and `assets/js/` directly. After modifying assets, bump the version constant in `shift8-scrollshot-bricks.php` to bust browser caches.

## License

GPL-2.0-or-later. See [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html).
