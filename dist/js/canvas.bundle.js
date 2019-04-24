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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/canvas.js":
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
  var rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

var boxx = _utils2.default.randomIntFromRange(0, canvas.width - 400);
var boxy = _utils2.default.randomIntFromRange(0, canvas.height - 400);
var boxwidth = _utils2.default.randomIntFromRange(100, 400);
var boxheight = _utils2.default.randomIntFromRange(100, 400);
/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {

  var xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  var yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  var xDist = otherParticle.x - particle.x;
  var yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    var angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

    // Store mass in var for better readability in collision equation
    var m1 = particle.mass;
    var m2 = otherParticle.mass;

    // Velocity before equation
    var u1 = rotate(particle.velocity, angle);
    var u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    var v1 = {
      x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
      y: u1.y
    };
    var v2 = {
      x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
      y: u2.y
    };

    // Final velocity after rotating axis back to original location
    var vFinal1 = rotate(v1, -angle);
    var vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
    // if (particle.radius >= otherParticle.radius) {
    //     particle.radius += 30
    //     //otherParticle.radius = 0
    // }
  }
}

canvas.width = innerWidth;
canvas.height = innerHeight - 60;

var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

var colors = ["#1cb3c8", "#dfe2e2", "#738598"];

// Event Listeners
addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("touchstart", function (e) {
  // Cache the client X/Y coordinates
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, false);

addEventListener("touchend", function (e) {
  var deltaX, deltaY;

  // Compute the change in X and Y coordinates.
  // The first touch point in the changedTouches
  // list is the touch point that was just removed from the surface.
  mouse.x = e.changedTouches[0].clientX - clientX;
  mouse.y = e.changedTouches[0].clientY - clientY;

  // Process the data ...
}, false);

addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight - 60;

  init();
});

// Objects
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: Math.random() - 0.5 * 5,
    y: (Math.random() - 0.5) * 5
  };
  this.radius = radius;
  this.color = color;
  this.mass = 1;
  this.opacity = 0;
}

Object.prototype.draw = function () {
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.save();
  c.globalAlpha = this.opacity;
  c.fillStyle = this.color;
  c.fill();
  c.restore();
  c.strokeStyle = this.color;
  c.stroke();
  c.closePath();
  c.beginPath();
  c.rect(boxx, boxy, boxwidth, boxheight);
  c.stroke();
};

Object.prototype.update = _particles = function particles() {
  this.draw();

  for (var i = 0; i < _particles.length; i++) {
    if (this === _particles[i]) continue;
    if (_utils2.default.distance(this.x, this.y, _particles[i].x, _particles[i].y) - this.radius * 2 < 0) {
      //this.radius = this.radius + 1

      resolveCollision(this, _particles[i]);
      // this.radius = this.radius + 1
      // particles.splice(particles.index, i)
    }
  }

  if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
    this.velocity.x = -this.velocity.x;
  }
  if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight - 60) {
    this.velocity.y = -this.velocity.y;
  }

  if (this.x + this.radius >= boxx && this.x - this.radius <= boxx + boxwidth && this.y - this.radius <= boxy + boxheight && this.y + this.radius >= boxy) {
    this.opacity = 1;
    //this.radius = this.radius + 0.1
  } else {
    this.opacity = 0;
  }

  // Mouse stuff
  if (_utils2.default.distance(mouse.x, mouse.y, this.x, this.y) < 80 && this.opacity < 0.2) {
    this.opacity += 0.02;
  } else if (this.opacity > 0) {
    this.opacity -= 0.02;
    this.opacity = Math.max(0, this.opacity);
  }

  this.x += this.velocity.x;
  this.y += this.velocity.y;
};

// Implementation
var _particles = void 0;
function init() {
  _particles = [];
  for (var i = 0; i < 50; i++) {
    var radius = 15;
    var x = _utils2.default.randomIntFromRange(radius, canvas.width - radius);
    var y = _utils2.default.randomIntFromRange(radius, canvas.height - 60 - radius);
    var color = _utils2.default.randomColor(colors);

    if (i !== 0) {
      for (var j = 0; j < _particles.length; j++) {
        if (_utils2.default.distance(x, y, _particles[j].x, _particles[j].y) - radius * 2 < 0) {
          x = _utils2.default.randomIntFromRange(radius, canvas.width - radius);
          y = _utils2.default.randomIntFromRange(radius, canvas.height - 60 - radius);

          j = -1;
        }
      }
    }
    _particles.push(new Particle(x, y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  _particles.forEach(function (particle, index) {
    particle.update(_particles);
  });
}

init();
animate();

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
    var xDist = x2 - x1;
    var yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

module.exports = { randomIntFromRange: randomIntFromRange, randomColor: randomColor, distance: distance };

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map