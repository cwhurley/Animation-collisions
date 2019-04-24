import utils from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

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
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

let boxx = utils.randomIntFromRange(0, canvas.width - 400)
let boxy = utils.randomIntFromRange(0, canvas.height - 400)
let boxwidth = utils.randomIntFromRange(100, 400)
let boxheight = utils.randomIntFromRange(100, 400)
/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {

  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

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

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

const colors = ["#1cb3c8", "#dfe2e2", "#738598"];

// Event Listeners
addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener(
  "touchstart",
  function (e) {
    // Cache the client X/Y coordinates
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  },
  false
);

addEventListener(
  "touchend",
  function (e) {
    var deltaX, deltaY;

    // Compute the change in X and Y coordinates.
    // The first touch point in the changedTouches
    // list is the touch point that was just removed from the surface.
    mouse.x = e.changedTouches[0].clientX - clientX;
    mouse.y = e.changedTouches[0].clientY - clientY;

    // Process the data ...
  },
  false
);

addEventListener("resize", () => {
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

Object.prototype.update = particles = function () {
  this.draw();

  for (let i = 0; i < particles.length; i++) {
    if (this === particles[i]) continue;
    if (
      utils.distance(this.x, this.y, particles[i].x, particles[i].y) -
      this.radius * 2 <
      0
    ) {
      //this.radius = this.radius + 1

      resolveCollision(this, particles[i]);
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

  if (
    this.x + this.radius >= boxx &&
    this.x - this.radius <= boxx + boxwidth &&
    this.y - this.radius <= boxy + boxheight &&
    this.y + this.radius >= boxy
  ) {
    this.opacity = 1;
    //this.radius = this.radius + 0.1
  } else {
    this.opacity = 0;
  }


  // Mouse stuff
  if (
    utils.distance(mouse.x, mouse.y, this.x, this.y) < 80 &&
    this.opacity < 0.2
  ) {
    this.opacity += 0.02;
  } else if (this.opacity > 0) {
    this.opacity -= 0.02;
    this.opacity = Math.max(0, this.opacity);
  }

  this.x += this.velocity.x;
  this.y += this.velocity.y;
};

// Implementation
let particles;
function init() {
  particles = [];
  for (let i = 0; i < 50; i++) {
    let radius = 15;
    let x = utils.randomIntFromRange(radius, canvas.width - radius);
    let y = utils.randomIntFromRange(radius, canvas.height - 60 - radius);
    const color = utils.randomColor(colors);

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          utils.distance(x, y, particles[j].x, particles[j].y) - radius * 2 <
          0
        ) {
          x = utils.randomIntFromRange(radius, canvas.width - radius);
          y = utils.randomIntFromRange(radius, canvas.height - 60 - radius);

          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, index) => {
    particle.update(particles);
  });
}

init();
animate();
