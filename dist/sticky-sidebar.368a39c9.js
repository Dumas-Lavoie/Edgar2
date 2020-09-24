// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/sticky-sidebar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Sticky Sidebar JavaScript Plugin.
 * @version 3.3.4
 * @author Ahmed Bouhuolia <a.bouhuolia@gmail.com>
 * @license The MIT License (MIT)
 */
var StickySidebar = function () {
  // ---------------------------------
  // # Define Constants
  // ---------------------------------
  //
  var EVENT_KEY = '.stickySidebar';
  var VERSION = '3.3.4';
  var DEFAULTS = {
    /**
     * Additional top spacing of the element when it becomes sticky.
     * @type {Numeric|Function}
     */
    topSpacing: 0,

    /**
     * Additional bottom spacing of the element when it becomes sticky.
     * @type {Numeric|Function}
     */
    bottomSpacing: 0,

    /**
     * Container sidebar selector to know what the beginning and end of sticky element.
     * @type {String|False}
     */
    containerSelector: false,

    /**
     * Inner wrapper selector.
     * @type {String}
     */
    innerWrapperSelector: '.inner-wrapper-sticky',

    /**
     * The name of CSS class to apply to elements when they have become stuck.
     * @type {String|False}
     */
    stickyClass: 'is-affixed',

    /**
     * Detect when sidebar and its container change height so re-calculate their dimensions.
     * @type {Boolean}
     */
    resizeSensor: true,

    /**
     * The sidebar returns to its normal position if its width below this value.
     * @type {Numeric}
     */
    minWidth: false
  }; // ---------------------------------
  // # Class Definition
  // ---------------------------------
  //

  /**
   * Sticky Sidebar Class.
   * @public
   */

  var StickySidebar = /*#__PURE__*/function () {
    /**
     * Sticky Sidebar Constructor.
     * @constructor
     * @param {HTMLElement|String} sidebar - The sidebar element or sidebar selector.
     * @param {Object} options - The options of sticky sidebar.
     */
    function StickySidebar(sidebar) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, StickySidebar);

      this.options = StickySidebar.extend(DEFAULTS, options); // Sidebar element query if there's no one, throw error.

      this.sidebar = 'string' === typeof sidebar ? document.querySelector(sidebar) : sidebar;
      if ('undefined' === typeof this.sidebar) throw new Error("There is no specific sidebar element.");
      this.sidebarInner = false;
      this.container = this.sidebar.parentElement; // Current Affix Type of sidebar element.

      this.affixedType = 'STATIC';
      this.direction = 'down';
      this.support = {
        transform: false,
        transform3d: false
      };
      this._initialized = false;
      this._reStyle = false;
      this._breakpoint = false; // Dimensions of sidebar, container and screen viewport.

      this.dimensions = {
        translateY: 0,
        maxTranslateY: 0,
        topSpacing: 0,
        lastTopSpacing: 0,
        bottomSpacing: 0,
        lastBottomSpacing: 0,
        sidebarHeight: 0,
        sidebarWidth: 0,
        containerTop: 0,
        containerHeight: 0,
        viewportHeight: 0,
        viewportTop: 0,
        lastViewportTop: 0
      }; // Bind event handlers for referencability.

      ['handleEvent'].forEach(function (method) {
        _this[method] = _this[method].bind(_this);
      }); // Initialize sticky sidebar for first time.

      this.initialize();
    }
    /**
     * Initializes the sticky sidebar by adding inner wrapper, define its container, 
     * min-width breakpoint, calculating dimensions, adding helper classes and inline style.
     * @private
     */


    _createClass(StickySidebar, [{
      key: "initialize",
      value: function initialize() {
        var _this2 = this;

        this._setSupportFeatures(); // Get sticky sidebar inner wrapper, if not found, will create one.


        if (this.options.innerWrapperSelector) {
          this.sidebarInner = this.sidebar.querySelector(this.options.innerWrapperSelector);
          if (null === this.sidebarInner) this.sidebarInner = false;
        }

        if (!this.sidebarInner) {
          var wrapper = document.createElement('div');
          wrapper.setAttribute('class', 'inner-wrapper-sticky');
          this.sidebar.appendChild(wrapper);

          while (this.sidebar.firstChild != wrapper) {
            wrapper.appendChild(this.sidebar.firstChild);
          }

          this.sidebarInner = this.sidebar.querySelector('.inner-wrapper-sticky');
        } // Container wrapper of the sidebar.


        if (this.options.containerSelector) {
          var containers = document.querySelectorAll(this.options.containerSelector);
          containers = Array.prototype.slice.call(containers);
          containers.forEach(function (container, item) {
            if (!container.contains(_this2.sidebar)) return;
            _this2.container = container;
          });
          if (!containers.length) throw new Error("The container does not contains on the sidebar.");
        } // If top/bottom spacing is not function parse value to integer.


        if ('function' !== typeof this.options.topSpacing) this.options.topSpacing = parseInt(this.options.topSpacing) || 0;
        if ('function' !== typeof this.options.bottomSpacing) this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0; // Breakdown sticky sidebar if screen width below `options.minWidth`.

        this._widthBreakpoint(); // Calculate dimensions of sidebar, container and viewport.


        this.calcDimensions(); // Affix sidebar in proper position.

        this.stickyPosition(); // Bind all events.

        this.bindEvents(); // Inform other properties the sticky sidebar is initialized.

        this._initialized = true;
      }
      /**
       * Bind all events of sticky sidebar plugin.
       * @protected
       */

    }, {
      key: "bindEvents",
      value: function bindEvents() {
        window.addEventListener('resize', this, {
          passive: true,
          capture: false
        });
        window.addEventListener('scroll', this, {
          passive: true,
          capture: false
        });
        this.sidebar.addEventListener('update' + EVENT_KEY, this);

        if (this.options.resizeSensor && 'undefined' !== typeof ResizeSensor) {
          new ResizeSensor(this.sidebarInner, this.handleEvent);
          new ResizeSensor(this.container, this.handleEvent);
        }
      }
      /**
       * Handles all events of the plugin.
       * @param {Object} event - Event object passed from listener.
       */

    }, {
      key: "handleEvent",
      value: function handleEvent(event) {
        this.updateSticky(event);
      }
      /**
       * Calculates dimensions of sidebar, container and screen viewpoint
       * @public
       */

    }, {
      key: "calcDimensions",
      value: function calcDimensions() {
        if (this._breakpoint) return;
        var dims = this.dimensions; // Container of sticky sidebar dimensions.

        dims.containerTop = StickySidebar.offsetRelative(this.container).top;
        dims.containerHeight = this.container.clientHeight;
        dims.containerBottom = dims.containerTop + dims.containerHeight; // Sidebar dimensions.

        dims.sidebarHeight = this.sidebarInner.offsetHeight;
        dims.sidebarWidth = this.sidebarInner.offsetWidth; // Screen viewport dimensions.

        dims.viewportHeight = window.innerHeight; // Maximum sidebar translate Y.

        dims.maxTranslateY = dims.containerHeight - dims.sidebarHeight;

        this._calcDimensionsWithScroll();
      }
      /**
       * Some dimensions values need to be up-to-date when scrolling the page.
       * @private
       */

    }, {
      key: "_calcDimensionsWithScroll",
      value: function _calcDimensionsWithScroll() {
        var dims = this.dimensions;
        dims.sidebarLeft = StickySidebar.offsetRelative(this.sidebar).left;
        dims.viewportTop = document.documentElement.scrollTop || document.body.scrollTop;
        dims.viewportBottom = dims.viewportTop + dims.viewportHeight;
        dims.viewportLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        dims.topSpacing = this.options.topSpacing;
        dims.bottomSpacing = this.options.bottomSpacing;
        if ('function' === typeof dims.topSpacing) dims.topSpacing = parseInt(dims.topSpacing(this.sidebar)) || 0;
        if ('function' === typeof dims.bottomSpacing) dims.bottomSpacing = parseInt(dims.bottomSpacing(this.sidebar)) || 0;

        if ('VIEWPORT-TOP' === this.affixedType) {
          // Adjust translate Y in the case decrease top spacing value.
          if (dims.topSpacing < dims.lastTopSpacing) {
            dims.translateY += dims.lastTopSpacing - dims.topSpacing;
            this._reStyle = true;
          }
        } else if ('VIEWPORT-BOTTOM' === this.affixedType) {
          // Adjust translate Y in the case decrease bottom spacing value.
          if (dims.bottomSpacing < dims.lastBottomSpacing) {
            dims.translateY += dims.lastBottomSpacing - dims.bottomSpacing;
            this._reStyle = true;
          }
        }

        dims.lastTopSpacing = dims.topSpacing;
        dims.lastBottomSpacing = dims.bottomSpacing;
      }
      /**
       * Determine whether the sidebar is bigger than viewport.
       * @public
       * @return {Boolean}
       */

    }, {
      key: "isSidebarFitsViewport",
      value: function isSidebarFitsViewport() {
        var dims = this.dimensions;
        var offset = this.scrollDirection === 'down' ? dims.lastBottomSpacing : dims.lastTopSpacing;
        return this.dimensions.sidebarHeight + offset < this.dimensions.viewportHeight;
      }
      /**
       * Observe browser scrolling direction top and down.
       */

    }, {
      key: "observeScrollDir",
      value: function observeScrollDir() {
        var dims = this.dimensions;
        if (dims.lastViewportTop === dims.viewportTop) return;
        var furthest = 'down' === this.direction ? Math.min : Math.max; // If the browser is scrolling not in the same direction.

        if (dims.viewportTop === furthest(dims.viewportTop, dims.lastViewportTop)) this.direction = 'down' === this.direction ? 'up' : 'down';
      }
      /**
       * Gets affix type of sidebar according to current scroll top and scrolling direction.
       * @public
       * @return {String|False} - Proper affix type.
       */

    }, {
      key: "getAffixType",
      value: function getAffixType() {
        this._calcDimensionsWithScroll();

        var dims = this.dimensions;
        var colliderTop = dims.viewportTop + dims.topSpacing;
        var affixType = this.affixedType;

        if (colliderTop <= dims.containerTop || dims.containerHeight <= dims.sidebarHeight) {
          dims.translateY = 0;
          affixType = 'STATIC';
        } else {
          affixType = 'up' === this.direction ? this._getAffixTypeScrollingUp() : this._getAffixTypeScrollingDown();
        } // Make sure the translate Y is not bigger than container height.


        dims.translateY = Math.max(0, dims.translateY);
        dims.translateY = Math.min(dims.containerHeight, dims.translateY);
        dims.translateY = Math.round(dims.translateY);
        dims.lastViewportTop = dims.viewportTop;
        return affixType;
      }
      /**
       * Get affix type while scrolling down.
       * @private
       * @return {String} - Proper affix type of scrolling down direction.
       */

    }, {
      key: "_getAffixTypeScrollingDown",
      value: function _getAffixTypeScrollingDown() {
        var dims = this.dimensions;
        var sidebarBottom = dims.sidebarHeight + dims.containerTop;
        var colliderTop = dims.viewportTop + dims.topSpacing;
        var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
        var affixType = this.affixedType;

        if (this.isSidebarFitsViewport()) {
          if (dims.sidebarHeight + colliderTop >= dims.containerBottom) {
            dims.translateY = dims.containerBottom - sidebarBottom;
            affixType = 'CONTAINER-BOTTOM';
          } else if (colliderTop >= dims.containerTop) {
            dims.translateY = colliderTop - dims.containerTop;
            affixType = 'VIEWPORT-TOP';
          }
        } else {
          if (dims.containerBottom <= colliderBottom) {
            dims.translateY = dims.containerBottom - sidebarBottom;
            affixType = 'CONTAINER-BOTTOM';
          } else if (sidebarBottom + dims.translateY <= colliderBottom) {
            dims.translateY = colliderBottom - sidebarBottom;
            affixType = 'VIEWPORT-BOTTOM';
          } else if (dims.containerTop + dims.translateY <= colliderTop && 0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) {
            affixType = 'VIEWPORT-UNBOTTOM';
          }
        }

        return affixType;
      }
      /**
       * Get affix type while scrolling up.
       * @private
       * @return {String} - Proper affix type of scrolling up direction.
       */

    }, {
      key: "_getAffixTypeScrollingUp",
      value: function _getAffixTypeScrollingUp() {
        var dims = this.dimensions;
        var sidebarBottom = dims.sidebarHeight + dims.containerTop;
        var colliderTop = dims.viewportTop + dims.topSpacing;
        var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
        var affixType = this.affixedType;

        if (colliderTop <= dims.translateY + dims.containerTop) {
          dims.translateY = colliderTop - dims.containerTop;
          affixType = 'VIEWPORT-TOP';
        } else if (dims.containerBottom <= colliderBottom) {
          dims.translateY = dims.containerBottom - sidebarBottom;
          affixType = 'CONTAINER-BOTTOM';
        } else if (!this.isSidebarFitsViewport()) {
          if (dims.containerTop <= colliderTop && 0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) {
            affixType = 'VIEWPORT-UNBOTTOM';
          }
        }

        return affixType;
      }
      /**
       * Gets inline style of sticky sidebar wrapper and inner wrapper according 
       * to its affix type.
       * @private
       * @param {String} affixType - Affix type of sticky sidebar.
       * @return {Object}
       */

    }, {
      key: "_getStyle",
      value: function _getStyle(affixType) {
        if ('undefined' === typeof affixType) return;
        var style = {
          inner: {},
          outer: {}
        };
        var dims = this.dimensions;

        switch (affixType) {
          case 'VIEWPORT-TOP':
            style.inner = {
              position: 'fixed',
              top: dims.topSpacing,
              left: dims.sidebarLeft - dims.viewportLeft,
              width: dims.sidebarWidth
            };
            break;

          case 'VIEWPORT-BOTTOM':
            style.inner = {
              position: 'fixed',
              top: 'auto',
              left: dims.sidebarLeft,
              bottom: dims.bottomSpacing,
              width: dims.sidebarWidth
            };
            break;

          case 'CONTAINER-BOTTOM':
          case 'VIEWPORT-UNBOTTOM':
            var translate = this._getTranslate(0, dims.translateY + 'px');

            if (translate) style.inner = {
              transform: translate
            };else style.inner = {
              position: 'absolute',
              top: dims.translateY,
              width: dims.sidebarWidth
            };
            break;
        }

        switch (affixType) {
          case 'VIEWPORT-TOP':
          case 'VIEWPORT-BOTTOM':
          case 'VIEWPORT-UNBOTTOM':
          case 'CONTAINER-BOTTOM':
            style.outer = {
              height: dims.sidebarHeight,
              position: 'relative'
            };
            break;
        }

        style.outer = StickySidebar.extend({
          height: '',
          position: ''
        }, style.outer);
        style.inner = StickySidebar.extend({
          position: 'relative',
          top: '',
          left: '',
          bottom: '',
          width: '',
          transform: ''
        }, style.inner);
        return style;
      }
      /**
       * Cause the sidebar to be sticky according to affix type by adding inline
       * style, adding helper class and trigger events.
       * @function
       * @protected
       * @param {string} force - Update sticky sidebar position by force.
       */

    }, {
      key: "stickyPosition",
      value: function stickyPosition(force) {
        if (this._breakpoint) return;
        force = this._reStyle || force || false;
        var offsetTop = this.options.topSpacing;
        var offsetBottom = this.options.bottomSpacing;
        var affixType = this.getAffixType();

        var style = this._getStyle(affixType);

        if ((this.affixedType != affixType || force) && affixType) {
          var affixEvent = 'affix.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
          StickySidebar.eventTrigger(this.sidebar, affixEvent);
          if ('STATIC' === affixType) StickySidebar.removeClass(this.sidebar, this.options.stickyClass);else StickySidebar.addClass(this.sidebar, this.options.stickyClass);

          for (var key in style.outer) {
            var unit = 'number' === typeof style.outer[key] ? 'px' : '';
            this.sidebar.style[key] = style.outer[key] + unit;
          }

          for (var _key in style.inner) {
            var _unit = 'number' === typeof style.inner[_key] ? 'px' : '';

            this.sidebarInner.style[_key] = style.inner[_key] + _unit;
          }

          var affixedEvent = 'affixed.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
          StickySidebar.eventTrigger(this.sidebar, affixedEvent);
        } else {
          if (this._initialized) this.sidebarInner.style.left = style.inner.left;
        }

        this.affixedType = affixType;
      }
      /**
       * Breakdown sticky sidebar when window width is below `options.minWidth` value.
       * @protected
       */

    }, {
      key: "_widthBreakpoint",
      value: function _widthBreakpoint() {
        if (window.innerWidth <= this.options.minWidth) {
          this._breakpoint = true;
          this.affixedType = 'STATIC';
          this.sidebar.removeAttribute('style');
          StickySidebar.removeClass(this.sidebar, this.options.stickyClass);
          this.sidebarInner.removeAttribute('style');
        } else {
          this._breakpoint = false;
        }
      }
      /**
       * Switches between functions stack for each event type, if there's no 
       * event, it will re-initialize sticky sidebar.
       * @public
       */

    }, {
      key: "updateSticky",
      value: function updateSticky() {
        var _this3 = this;

        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (this._running) return;
        this._running = true;

        (function (eventType) {
          requestAnimationFrame(function () {
            switch (eventType) {
              // When browser is scrolling and re-calculate just dimensions
              // within scroll. 
              case 'scroll':
                _this3._calcDimensionsWithScroll();

                _this3.observeScrollDir();

                _this3.stickyPosition();

                break;
              // When browser is resizing or there's no event, observe width
              // breakpoint and re-calculate dimensions.

              case 'resize':
              default:
                _this3._widthBreakpoint();

                _this3.calcDimensions();

                _this3.stickyPosition(true);

                break;
            }

            _this3._running = false;
          });
        })(event.type);
      }
      /**
       * Set browser support features to the public property.
       * @private
       */

    }, {
      key: "_setSupportFeatures",
      value: function _setSupportFeatures() {
        var support = this.support;
        support.transform = StickySidebar.supportTransform();
        support.transform3d = StickySidebar.supportTransform(true);
      }
      /**
       * Get translate value, if the browser supports transfrom3d, it will adopt it.
       * and the same with translate. if browser doesn't support both return false.
       * @param {Number} y - Value of Y-axis.
       * @param {Number} x - Value of X-axis.
       * @param {Number} z - Value of Z-axis.
       * @return {String|False}
       */

    }, {
      key: "_getTranslate",
      value: function _getTranslate() {
        var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        if (this.support.transform3d) return 'translate3d(' + y + ', ' + x + ', ' + z + ')';else if (this.support.translate) return 'translate(' + y + ', ' + x + ')';else return false;
      }
      /**
       * Destroy sticky sidebar plugin.
       * @public
       */

    }, {
      key: "destroy",
      value: function destroy() {
        window.removeEventListener('resize', this, {
          capture: false
        });
        window.removeEventListener('scroll', this, {
          capture: false
        });
        this.sidebar.classList.remove(this.options.stickyClass);
        this.sidebar.style.minHeight = '';
        this.sidebar.removeEventListener('update' + EVENT_KEY, this);
        var styleReset = {
          inner: {},
          outer: {}
        };
        styleReset.inner = {
          position: '',
          top: '',
          left: '',
          bottom: '',
          width: '',
          transform: ''
        };
        styleReset.outer = {
          height: '',
          position: ''
        };

        for (var key in styleReset.outer) {
          this.sidebar.style[key] = styleReset.outer[key];
        }

        for (var _key2 in styleReset.inner) {
          this.sidebarInner.style[_key2] = styleReset.inner[_key2];
        }

        if (this.options.resizeSensor && 'undefined' !== typeof ResizeSensor) {
          ResizeSensor.detach(this.sidebarInner, this.handleEvent);
          ResizeSensor.detach(this.container, this.handleEvent);
        }
      }
      /**
       * Determine if the browser supports CSS transform feature.
       * @function
       * @static
       * @param {Boolean} transform3d - Detect transform with translate3d.
       * @return {String}
       */

    }], [{
      key: "supportTransform",
      value: function supportTransform(transform3d) {
        var result = false,
            property = transform3d ? 'perspective' : 'transform',
            upper = property.charAt(0).toUpperCase() + property.slice(1),
            prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            support = document.createElement('support'),
            style = support.style;
        (property + ' ' + prefixes.join(upper + ' ') + upper).split(' ').forEach(function (property, i) {
          if (style[property] !== undefined) {
            result = property;
            return false;
          }
        });
        return result;
      }
      /**
       * Trigger custom event.
       * @static
       * @param {DOMObject} element - Target element on the DOM.
       * @param {String} eventName - Event name.
       * @param {Object} data - 
       */

    }, {
      key: "eventTrigger",
      value: function eventTrigger(element, eventName, data) {
        try {
          var event = new CustomEvent(eventName, {
            detail: data
          });
        } catch (e) {
          var event = document.createEvent('CustomEvent');
          event.initCustomEvent(eventName, true, true, data);
        }

        element.dispatchEvent(event);
      }
      /**
       * Extend options object with defaults.
       * @function
       * @static
       */

    }, {
      key: "extend",
      value: function extend(defaults, options) {
        var results = {};

        for (var key in defaults) {
          if ('undefined' !== typeof options[key]) results[key] = options[key];else results[key] = defaults[key];
        }

        return results;
      }
      /**
       * Get current coordinates left and top of specific element.
       * @static
       */

    }, {
      key: "offsetRelative",
      value: function offsetRelative(element) {
        var result = {
          left: 0,
          top: 0
        };

        do {
          var offsetTop = element.offsetTop;
          var offsetLeft = element.offsetLeft;
          if (!isNaN(offsetTop)) result.top += offsetTop;
          if (!isNaN(offsetLeft)) result.left += offsetLeft;
          element = 'BODY' === element.tagName ? element.parentElement : element.offsetParent;
        } while (element);

        return result;
      }
      /**
       * Add specific class name to specific element.
       * @static 
       * @param {ObjectDOM} element 
       * @param {String} className 
       */

    }, {
      key: "addClass",
      value: function addClass(element, className) {
        if (!StickySidebar.hasClass(element, className)) {
          if (element.classList) element.classList.add(className);else element.className += ' ' + className;
        }
      }
      /**
       * Remove specific class name to specific element
       * @static
       * @param {ObjectDOM} element 
       * @param {String} className 
       */

    }, {
      key: "removeClass",
      value: function removeClass(element, className) {
        if (StickySidebar.hasClass(element, className)) {
          if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      }
      /**
       * Determine weather the element has specific class name.
       * @static
       * @param {ObjectDOM} element 
       * @param {String} className 
       */

    }, {
      key: "hasClass",
      value: function hasClass(element, className) {
        if (element.classList) return element.classList.contains(className);else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
      }
      /**
       * Gets default values of configuration options.
       * @static
       * @return {Object} 
       */

    }, {
      key: "defaults",
      get: function get() {
        return DEFAULTS;
      }
    }]);

    return StickySidebar;
  }();

  return StickySidebar;
}();

var _default = StickySidebar; // Global
// -------------------------

exports.default = _default;
window.StickySidebar = StickySidebar;
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57420" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/sticky-sidebar.js"], null)
//# sourceMappingURL=/sticky-sidebar.368a39c9.js.map