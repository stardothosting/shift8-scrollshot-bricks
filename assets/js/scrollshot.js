/**
 * Shift8 ScrollShot
 *
 * Vanilla JS, no dependencies. Supports auto-scroll and scroll-linked
 * modes with per-instance configuration via data-* attributes.
 *
 * @package Shift8_ScrollShot
 */
( function () {
	'use strict';

	var DEFAULTS = {
		mode:            'auto',
		duration:        12000,
		pauseOnHover:    true,
		reverse:         true,
		frame:           'none',
		viewportHeight:  700,
		viewportWidth:   0,
		endPause:        1500,
		easing:          'ease-in-out',
	};

	var reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );

	function debounce( fn, delay ) {
		var timer;
		return function () {
			clearTimeout( timer );
			timer = setTimeout( fn, delay );
		};
	}

	function clamp( val, min, max ) {
		return Math.min( Math.max( val, min ), max );
	}

	/* ------------------------------------------------------------------ */
	/* ScrollShot controller                                               */
	/* ------------------------------------------------------------------ */
	function ScrollShot( el ) {
		this.wrapper  = el;
		this.image    = null;
		this.viewport = null;
		this.settings = {};

		this._animation   = null;
		this._scrollBound = null;
		this._rafId       = null;
		this._observer    = null;
		this._visible     = false;
		this._maxTravel   = 0;
		this._destroyed   = false;

		this.init();
	}

	ScrollShot.prototype.init = function () {
		this.image = this.wrapper.querySelector( '.s8-scrollshot__image' );
		if ( ! this.image ) {
			return;
		}

		this.readSettings();
		this.buildDOM();

		var self = this;

		function isPlaceholder( img ) {
			var src = img.currentSrc || img.src || '';
			return src.indexOf( 'data:image/svg' ) === 0;
		}

		function onReady() {
			if ( isPlaceholder( self.image ) ) {
				self.image.addEventListener( 'load', onReady );
				return;
			}
			self.measure();
			self.start();
		}

		if ( this.image.complete && this.image.naturalHeight && ! isPlaceholder( this.image ) ) {
			onReady();
		} else {
			this.image.addEventListener( 'load', onReady );
		}

		this._onResize = debounce( function () {
			self.measure();
			self.restart();
		}, 200 );
		window.addEventListener( 'resize', this._onResize );

		if ( this.settings.pauseOnHover ) {
			this.wrapper.addEventListener( 'mouseenter', this.pause.bind( this ) );
			this.wrapper.addEventListener( 'mouseleave', this.play.bind( this ) );
		}
	};

	/**
	 * Read data-* attributes from the wrapper and the image. Wrapper
	 * values take priority, then image values, then built-in defaults.
	 * This supports page builders where attributes may be placed on
	 * either the container or the image element.
	 */
	ScrollShot.prototype.readSettings = function () {
		var imgD  = this.image ? this.image.dataset : {};
		var wrapD = this.wrapper.dataset;

		function attr( key ) {
			return wrapD[ key ] !== undefined ? wrapD[ key ]
			     : imgD[ key ]  !== undefined ? imgD[ key ]
			     : undefined;
		}

		function str( key, fallback ) {
			var v = attr( key );
			return v !== undefined ? v : fallback;
		}

		function num( key, fallback ) {
			var v = attr( key );
			var n = parseInt( v, 10 );
			return isNaN( n ) ? fallback : n;
		}

		function bool( key, fallback ) {
			var v = attr( key );
			if ( v === 'true' )  return true;
			if ( v === 'false' ) return false;
			return fallback;
		}

		this.settings = {
			mode:           str(  'mode',           DEFAULTS.mode ),
			duration:       num(  'duration',       DEFAULTS.duration ),
			pauseOnHover:   bool( 'pauseOnHover',   DEFAULTS.pauseOnHover ),
			reverse:        bool( 'reverse',         DEFAULTS.reverse ),
			frame:          str(  'frame',           DEFAULTS.frame ),
			viewportHeight: num(  'viewportHeight',  DEFAULTS.viewportHeight ),
			viewportWidth:  num(  'viewportWidth',   DEFAULTS.viewportWidth ),
			endPause:       num(  'endPause',        DEFAULTS.endPause ),
			easing:         str(  'easing',          DEFAULTS.easing ),
		};
	};

	ScrollShot.prototype.buildDOM = function () {
		var s = this.settings;

		var existingViewport = this.wrapper.querySelector( '.s8-scrollshot__viewport' );
		if ( existingViewport ) {
			this.viewport = existingViewport;
		} else {
			this.viewport = document.createElement( 'div' );
			this.viewport.className = 's8-scrollshot__viewport';

			while ( this.wrapper.firstChild ) {
				this.viewport.appendChild( this.wrapper.firstChild );
			}
			this.wrapper.appendChild( this.viewport );
		}

		if ( this.image && this.image.parentNode !== this.viewport ) {
			this.viewport.appendChild( this.image );
		}

		this.viewport.style.height = s.viewportHeight + 'px';

		if ( s.viewportWidth > 0 ) {
			this.wrapper.style.width = s.viewportWidth + 'px';
			this.wrapper.style.maxWidth = '100%';
		}

		if ( s.frame === 'browser' ) {
			this.wrapper.classList.add( 's8-scrollshot--frame-browser' );

			if ( ! this.wrapper.querySelector( '.s8-scrollshot__chrome' ) ) {
				var chrome = document.createElement( 'div' );
				chrome.className = 's8-scrollshot__chrome';
				chrome.innerHTML = '<span></span><span></span><span></span>';
				this.wrapper.insertBefore( chrome, this.viewport );
			}
		}
	};

	/**
	 * Calculate maximum vertical travel. Uses the aspect ratio and
	 * rendered width rather than offsetHeight, because parent overflow
	 * or page builder image styles may constrain the layout height.
	 */
	ScrollShot.prototype.measure = function () {
		if ( ! this.image || ! this.image.naturalWidth ) {
			return;
		}

		var renderedW = this.image.offsetWidth;
		if ( renderedW <= 0 ) {
			return;
		}

		var renderedH = this.image.naturalHeight * ( renderedW / this.image.naturalWidth );
		this._maxTravel = Math.max( 0, renderedH - this.settings.viewportHeight );
	};

	ScrollShot.prototype.start = function () {
		if ( this._maxTravel <= 0 ) {
			return;
		}
		if ( reducedMotion.matches ) {
			return;
		}

		this.setupObserver();

		if ( this.settings.mode === 'scroll' ) {
			this.setupScrollMode();
		} else {
			this.setupAutoMode();
		}
	};

	ScrollShot.prototype.restart = function () {
		this.teardownAnimation();
		this.start();
	};

	/**
	 * Auto mode: animate the image up and down on a loop using the
	 * Web Animations API. Keyframes include hold segments at each end
	 * controlled by the endPause setting.
	 */
	ScrollShot.prototype.setupAutoMode = function () {
		var s      = this.settings;
		var travel = this._maxTravel;
		var top    = 'translateY(0)';
		var bottom = 'translateY(-' + travel + 'px)';
		var keyframes;

		var holdFrac = clamp( s.endPause / s.duration, 0, 0.4 );

		if ( s.reverse ) {
			var motionFrac = ( 1 - 2 * holdFrac ) / 2;
			var p1 = holdFrac;
			var p2 = holdFrac + motionFrac;
			var p3 = holdFrac + motionFrac + holdFrac;

			keyframes = [
				{ transform: top,    offset: 0,  easing: 'linear' },
				{ transform: top,    offset: p1, easing: s.easing },
				{ transform: bottom, offset: p2, easing: 'linear' },
				{ transform: bottom, offset: p3, easing: s.easing },
				{ transform: top,    offset: 1 },
			];
		} else {
			keyframes = [
				{ transform: top,    offset: 0,        easing: 'linear' },
				{ transform: top,    offset: holdFrac,  easing: s.easing },
				{ transform: bottom, offset: 1 },
			];
		}

		this._animation = this.image.animate( keyframes, {
			duration:   s.duration,
			easing:     'linear',
			iterations: Infinity,
		} );

		if ( ! this._visible ) {
			this._animation.pause();
		}
	};

	ScrollShot.prototype.setupScrollMode = function () {
		var self = this;
		this._scrollBound = function () {
			if ( self._rafId ) return;
			self._rafId = requestAnimationFrame( function () {
				self._rafId = null;
				self.applyScrollProgress();
			} );
		};
		window.addEventListener( 'scroll', this._scrollBound, { passive: true } );
		this.applyScrollProgress();
	};

	ScrollShot.prototype.applyScrollProgress = function () {
		var rect     = this.wrapper.getBoundingClientRect();
		var winH     = window.innerHeight;
		var progress = clamp( ( winH - rect.top ) / ( winH + rect.height ), 0, 1 );
		var y        = progress * this._maxTravel;
		this.image.style.transform = 'translateY(-' + y + 'px)';
	};

	ScrollShot.prototype.play = function () {
		this.wrapper.classList.remove( 's8-scrollshot--paused' );
		if ( this._animation && this._visible ) {
			this._animation.play();
		}
	};

	ScrollShot.prototype.pause = function () {
		this.wrapper.classList.add( 's8-scrollshot--paused' );
		if ( this._animation ) {
			this._animation.pause();
		}
	};

	ScrollShot.prototype.setupObserver = function () {
		var self = this;
		this._observer = new IntersectionObserver( function ( entries ) {
			var visible = entries[0].isIntersecting;
			self._visible = visible;
			if ( self._animation ) {
				visible ? self._animation.play() : self._animation.pause();
			}
		}, { threshold: 0 } );
		this._observer.observe( this.wrapper );
	};

	ScrollShot.prototype.teardownAnimation = function () {
		if ( this._animation ) {
			this._animation.cancel();
			this._animation = null;
		}
		if ( this._scrollBound ) {
			window.removeEventListener( 'scroll', this._scrollBound );
			this._scrollBound = null;
		}
		if ( this._rafId ) {
			cancelAnimationFrame( this._rafId );
			this._rafId = null;
		}
		if ( this._observer ) {
			this._observer.disconnect();
			this._observer = null;
		}
		if ( this.image ) {
			this.image.style.transform = '';
		}
	};

	ScrollShot.prototype.destroy = function () {
		if ( this._destroyed ) return;
		this._destroyed = true;
		this.teardownAnimation();
		if ( this._onResize ) {
			window.removeEventListener( 'resize', this._onResize );
		}
	};

	/* ------------------------------------------------------------------ */
	/* Boot                                                                */
	/* ------------------------------------------------------------------ */
	function boot() {
		var wrappers = document.querySelectorAll( '.s8-scrollshot' );
		if ( ! wrappers.length ) return;
		for ( var i = 0; i < wrappers.length; i++ ) {
			new ScrollShot( wrappers[i] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
