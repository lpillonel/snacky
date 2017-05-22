module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tick = tick;
exports.uniqueId = uniqueId;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Promise returning function to delay execution
 * @param  {Number} [delay=0] Delay in ms before resolving promise
 * @return {Promise}          Promise chain object
 */
function tick() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return new Promise(function (resolve) {
    return setTimeout(resolve, delay);
  });
}

var id = 1;

/**
 * uniqueId
 * @param {String}  prefix  id prefix
 * @return {String} generated uniqueId
 */
function uniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return '' + prefix + id++;
}

/** Timer class allowing to pause / resume / cancel timeout execution */

var Timer =

/**
 * Constuctor
 * @param  {Function} callback Function to execute after delay
 * @param  {Number}   delay    delay to wait in ms before execution of callback function
 */


/**
 * Instance variables
 */
exports.Timer = function Timer(callback, delay) {
  var _this = this;

  _classCallCheck(this, Timer);

  this.pause = function () {
    clearTimeout(_this.timerId);
    _this.remaining -= new Date() - _this.start;
  };

  this.resume = function () {
    _this.start = new Date();
    clearTimeout(_this.timerId);
    _this.timerId = setTimeout(_this.callback, _this.remaining);
  };

  this.clear = function () {
    clearTimeout(_this.timerId);
    delete _this.callback;
  };

  this.remaining = delay;
  this.callback = callback;
  this.resume();
}

/**
 * Pause timer execution
 */


/**
 * Resume timer execution
 */


/**
 * Clear timeout execution
 */
;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TYPE = undefined;
exports.setDefaults = setDefaults;
exports.notify = notify;
exports.success = success;
exports.warn = warn;
exports.error = error;
exports.isNotificationVisible = isNotificationVisible;

var _util = __webpack_require__(0);

__webpack_require__(1);

/**
 * Notification type
 * @type {Object}
 */
var TYPE = exports.TYPE = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
};

/**
 * Default settings
 * @type {Object}
 */
var DEFAULTS = {
    type: TYPE.INFO,
    title: null,
    text: null,
    hideDelay: 6000,
    actionText: undefined,
    action: undefined,
    replace: 'soft', // {false|String} false, "soft" or "hard"
    replaceId: undefined,
    hideOnClick: true,
    keepOnOver: true
};

/**
 * Transition duration constant
 */
var TRANSITION_DURATION = 500;

/**
 * Runtime vars
 */
var settings = Object.assign({}, DEFAULTS);
var stack = [];
var currentNotification = null;
var timer = null;
var inTransition = null;

/**
 * Set global settings
 * @param {Object} defaults settings object of overrided values.
 *                          will be deep merged with DEFAULTS
 * @return {Object}         New settings
 */
function setDefaults(defaults) {
    return Object.assign({}, defaults, settings);
}

/**
 * Show a notification
 * @param  {String|Object} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
function notify(notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text: notification };
    }

    // Merge with all settings
    notification = Object.assign({}, settings, notification, {
        id: (0, _util.uniqueId)('inform_')
    });

    // Push message to stack
    return push(notification);
}

/**
 * Show a notification of type success
 * @param  {(String|Object)} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
function success(notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text: notification };
    }

    return notify(Object.assign({}, notification, {
        type: TYPE.SUCCESS
    }));
}

/**
 * Show a notification of type warning
 * @param  {(String|Object)} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
function warn(notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text: notification };
    }

    return notify(Object.assign({}, notification, {
        type: TYPE.WARN
    }));
}

/**
 * Show a notification of type error
 * @param  {(String|Object)} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
function error(notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text: notification };
    }

    return notify(Object.assign({
        hideDelay: 10000
    }, notification, {
        type: TYPE.ERROR
    }));
}

/**
 * Check if a notification is currently visible
 * @return {Boolean}
 */
function isNotificationVisible() {
    return !!currentNotification;
}

/**
 * Push a new notification to display.
 * Either replacing existing one or addingit to the stack
 * @param  {Object} notification notification object
 * @return {Object}              notification object
 */
function push(notification) {
    // Does this notification replace current stack ?
    if (notification.replace === true && stack.length) {
        stack = [stack[0], notification];
        // Replace last if same replace id
    } else if (notification.replaceId !== undefined && stack.length && stack[stack.length - 1].replaceId === notification.replaceId) {
        stack.splice(stack.length - 1, 1, notification);
        // Add to stack
    } else {
        stack.push(notification);
    }

    // Process stack
    digest();

    // Return notification
    return notification;
}

/**
 * Digest cycle to process waiting stack
 */
function digest() {
    timer && timer.clear();
    // Immediately "hard" hide current notif if replace
    if (currentNotification && stack.length && (stack[0].replace === 'hard' || stack[0].replaceId !== undefined && currentNotification.replaceId === stack[0].replaceId)) {
        hide(currentNotification, { hard: true }).then(function () {
            return show(stack.splice(0, 1)[0], { hard: true });
        });
    }
    // Animated transition? Deffer digest
    else {
            // Retry if running
            if (stack.length && inTransition) {
                timer = new _util.Timer(digest, TRANSITION_DURATION / 5);
                return;
            }

            // Soft hide current
            if (currentNotification && stack.length && stack[0].replace === 'soft') {
                hide(currentNotification).then(function () {
                    return show(stack.splice(0, 1)[0]);
                });
                // Nothing ? Normal show
            } else if (!currentNotification && stack.length) {
                show(stack.splice(0, 1)[0]);
            }
        }
}

/**
 * Hide currently displayed notification
 * @param  {Object} notification notification object
 * @param  {Object} params       additional params ({Boolean} hard)
 * @return {Promise}             Promise resolved when notification is hidden
 */
function hide(notification) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$hard = _ref.hard,
        hard = _ref$hard === undefined ? false : _ref$hard;

    if (!hard) {
        inTransition = true;
        notification.$$DOMNode.classList.add('transition');
        return (0, _util.tick)(TRANSITION_DURATION).then(function () {
            currentNotification = null;
            inTransition = false;
            if (notification.$$DOMNode.parentElement === container) {
                return container.removeChild(notification.$$DOMNode);
            }
        });
    } else {
        currentNotification = null;
        return Promise.resolve(container.removeChild(notification.$$DOMNode));
    }
}

/**
 * Show provided notification
 * @param  {Object} notification notification object
 * @param  {Object} params       additional params ({Boolean} hard)
 */
function show(notification) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$hard = _ref2.hard,
        hard = _ref2$hard === undefined ? false : _ref2$hard;

    // Set timer to remove call and digest next one
    timer = new _util.Timer(function () {
        return hide(notification).then(digest);
    }, notification.hideDelay);

    // Reference current
    currentNotification = notification;

    // Create html from template
    notification.$$DOMNode = createNotificationHTMLNode(notification);

    // Inject notification in page
    container.appendChild(notification.$$DOMNode);

    if (hard) {
        notification.$$DOMNode.classList.remove('transition');
    } else {
        // Animate
        inTransition = true;
        (0, _util.tick)(30).then(function () {
            notification.$$DOMNode.classList.remove('transition');
        }).then(function () {
            return (0, _util.tick)(TRANSITION_DURATION);
        }).then(function () {
            inTransition = false;

            // Do we need to digest some more notifications ?
            stack.length && digest();
        });
    }
}

/**
 * Create notification html
 * @param  {Object} notification notification object
 * @return {DOMNode}             DOM node
 */
function createNotificationHTMLNode(notification) {

    var notificationNode = document.createElement('div');
    notificationNode.classList.add('inform__notification', 'transition', 'inform__notification--' + notification.type.toLowerCase());
    var innerHTML = '<div class="inform__text">';

    // Do we have a title ?
    if (notification.title) {
        innerHTML += '<span class="inform__textTitle">' + notification.title + '</span>';
        notificationNode.classList.add('inform__notification--with-title');
    }

    // Construct inner html
    innerHTML += '<span class="inform__textContent">' + notification.text + '</span></div>';

    // Add action
    if (typeof notification.action === 'function') {
        innerHTML += '<button class="inform__button">' + (notification.actionText || 'Action') + '</button>';
    }

    notificationNode.innerHTML = innerHTML;

    // Bind actions
    if (notification.hideOnClick) {
        notificationNode.addEventListener('click', function () {
            timer.clear();
            hide(notification).then(digest);
        });
    }
    if (notification.keepOnOver) {
        notificationNode.addEventListener('mouseenter', timer.pause);
        notificationNode.addEventListener('mouseleave', timer.resume);
    }
    if (typeof notification.action === 'function') {
        notificationNode.querySelector('.inform__button').addEventListener('click', notification.action);
    }

    return notificationNode;
}

/**
 * Create a notification container in the document body
 */
var container = document.createElement('div');
container.className = 'inform__container';
document.body.appendChild(container);

/**
 * Export notify as default with assigned with preset
 */
exports.default = Object.assign(notify, { notify: notify, warn: warn, success: success, error: error, isNotificationVisible: isNotificationVisible });

/***/ })
/******/ ]);