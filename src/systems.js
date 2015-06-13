//ECS.System(name, components, systemStepFunc, systemInitFunc)

ecsPixiGetContainer = function(entity) {
  if(typeof entity.components.Stage !== "undefined") {
    return entity.components.Stage.root;
  }
  if(typeof entity.components.Sprite !== "undefined") {
    return entity.components.Sprite.renderRef.sprite;
  }
  return null;
};

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

ECS.System("UserInput", ["MouseControl", "Position", "BoundingBox"],
  //Step
  function(entity){
    if(entity.oldX !== entity.components.MouseControl.position.x) {
      entity.components.Position.x += entity.components.MouseControl.velocity.x; //+ entity.components.MouseControl.accel.x / 2;
      if(entity.components.Position.x > entity.components.BoundingBox.width) {
        entity.components.Position.x = entity.components.BoundingBox.width;
      }
      if(entity.components.Position.x < 0){
        entity.components.Position.x = 0;
      }
    }
    entity.oldX = entity.components.MouseControl.position.x;
  },
  //Init
  function(entity) {
    var down = false;
    document.body.addEventListener("mousedown", function(e){
      entity.components.MouseControl.position.x = e.x;
      entity.components.MouseControl.position.y = e.y;
      down = true;
    });
    document.body.addEventListener("mousemove", function(e){
      if(down) {
        var oldPos = entity.components.MouseControl.position;
        var oldVel = entity.components.MouseControl.velocity;
        var oldAccel = entity.components.MouseControl.accel;

        var newPos = ecsVec2(e.x, e.y);
        var newVel = ecsVec2(newPos.x - oldPos.x, newPos.y - oldPos.y);
        var newAccel = ecsVec2(newVel.x - oldVel.x, newVel.y - oldVel.y);

        entity.components.MouseControl.position = newPos;
        entity.components.MouseControl.velocity = newVel;
        entity.components.MouseControl.accel = newAccel;
      }
    });
    document.body.addEventListener("mouseup", function(e){
      entity.components.MouseControl.velocity.x = 0;
      entity.components.MouseControl.velocity.y = 0;
      entity.components.MouseControl.accel.x = 0;
      entity.components.MouseControl.accel.y = 0;
      down = false;
    });
  }
);

ECS.System("PIXIRenderStage", ["BoundingBox", "Stage"],
  //Step
  function(entity){
    entity.components.Stage.renderRef.render(entity.components.Stage.root);
  },
  //Init
  function(entity){
    entity.components.Stage.renderRef = new PIXI.autoDetectRenderer(entity.components.BoundingBox.width, entity.components.BoundingBox.height);
    entity.components.Stage.renderRef.autoResize = true;
    entity.components.Stage.root = new PIXI.Container();

    document.body.appendChild(entity.components.Stage.renderRef.view);
  }
);

ECS.System("PIXIRenderSprite", ["Sprite", "Position", "Rotation"],
  //Step
  function(entity) {
    entity.components.Sprite.renderRef.sprite.scale.x = entity.components.Sprite.scale;
    entity.components.Sprite.renderRef.sprite.scale.y = entity.components.Sprite.scale;
    entity.components.Sprite.renderRef.sprite.position.x = entity.components.Position.x;
    entity.components.Sprite.renderRef.sprite.position.y = entity.components.Position.y;
    entity.components.Sprite.renderRef.sprite.rotation = entity.components.Rotation.radians;
  },
  //Init
  function(entity) {
    entity.components.Sprite.renderRef = {};
    entity.components.Sprite.renderRef.texture = PIXI.Texture.fromImage("imgs/" + entity.components.Sprite.imgSrc);
    entity.components.Sprite.renderRef.sprite = new PIXI.Sprite(entity.components.Sprite.renderRef.texture);

    // Set the Anchor to the center of the sprite.
    entity.components.Sprite.renderRef.sprite.anchor.x = 0.5;
    entity.components.Sprite.renderRef.sprite.anchor.x = 0.5;

    entity.components.Sprite.renderRef.sprite.scale.x = entity.components.Sprite.scale;
    entity.components.Sprite.renderRef.sprite.scale.y = entity.components.Sprite.scale;
    entity.components.Sprite.renderRef.sprite.position.x = entity.components.Position.x;
    entity.components.Sprite.renderRef.sprite.position.y = entity.components.Position.y;

    var parent = ecsPixiGetContainer(entity.components.Sprite.parent);
    if(parent !== null) {
      parent.addChild(entity.components.Sprite.renderRef.sprite);
    }
  }
);

// Particle System
var EcsParticle = function(parentRenderRef, pos, vel, accel) {
  this.position = pos || ecsVec2(0, 0);
  this.velocity = vel || ecsVec2(0, 0);
  this.acceleration = accel || ecsVec2(0, 0);
  this.renderRef = new PIXI.Graphics();
  parentRenderRef.addChild(this.renderRef);
};
EcsParticle.prototype.move = function () {
  // Add our current acceleration to our current velocity
  this.velocity = vectorMath.add(this.velocity, this.acceleration);

  // Add our current velocity to our position
  this.position = vectorMath.add(this.position, this.velocity);
};
EcsParticle.prototype.draw = function() {
  this.renderRef.clear();
  this.renderRef.lineStyle(0);
  this.renderRef.beginFill(0xF7E7CE, 0.15);
  this.renderRef.drawCircle(this.position.x, this.position.y, 6);
  this.renderRef.endFill();

  this.renderRef.lineStyle(0);
  this.renderRef.beginFill(0xF7EEE1, 0.1);
  this.renderRef.drawCircle(this.position.x + getRandomArbitrary(-3, 3), this.position.y + getRandomArbitrary(-3, 3), 4);
  this.renderRef.endFill();

  this.renderRef.lineStyle(0);
  this.renderRef.beginFill(0xcdf4f1, 0.2);
  this.renderRef.drawCircle(this.position.x + getRandomArbitrary(-4, 4), this.position.y + getRandomArbitrary(-4, 4), 3);
  this.renderRef.endFill();
};

var EcsParticleEmitter = function(renderRef, point, velocity, spread) {
  this.position = point; // Vector
  this.velocity = velocity; // Vector
  this.spread = spread || Math.PI / 24; // possible angles = velocity +/- spread
  this.renderRef = ecsPixiGetContainer(renderRef);
};

EcsParticleEmitter.prototype.emitParticle = function() {
  // Use an angle randomized over the spread so we have more of a "spray"
  var angle = vectorMath.getAngle(this.velocity) + this.spread - (Math.random() * this.spread * 2);

  // The magnitude of the emitter's velocity
  var magnitude = vectorMath.getMagnitude(this.velocity);

  // The emitter's position
  var position = ecsVec2(this.position.x, this.position.y);

  // New velocity based off of the calculated angle and magnitude
  var velocity = vectorMath.fromAngle(angle, magnitude);

  // return our new Particle!
  return new EcsParticle(this.renderRef, position, velocity, ecsVec2(0,0.05));
};

var plotParticles = function(particles, boundsX, boundsY) {
  // a new array to hold particles within our bounds
  var currentParticles = [];

  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    var pos = particle.position;

    // If we're out of bounds, drop this particle and move on to the next
    if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

    // Move our particles
    particle.move();

    // Add this particle to the list of current particles
    currentParticles.push(particle);
  }

  // Update our global particles, clearing room for old particles to be collected
  return currentParticles;
};

var maxParticles = 4000; // experiment! 20,000 provides a nice galaxy
var emissionRate = 2; // how many particles are emitted each frame

ECS.System("PIXIRenderParticles", ["ParticleSystem", "BoundingBox"],
  //Step
  function(entity) {
    // Update the emitter position.
    var emitterPos = vectorMath.add(
      entity.components.ParticleSystem.emitter.components.Position,
      entity.components.ParticleSystem.offset
    );
    entity.components.ParticleSystem.emitter.EcsParticleEmitter.position = emitterPos;

    var particles = entity.components.ParticleSystem.particles;

    // if we're at our max, stop emitting.
    if (particles.length < maxParticles){
      // for [emissionRate], emit a particle
      for (var j = emissionRate; j >= 0; j--) {
        particles.push(entity.components.ParticleSystem.emitter.EcsParticleEmitter.emitParticle());
      }
    }

    particles = plotParticles(particles, entity.components.BoundingBox.width, entity.components.BoundingBox.height);

    for (var i = particles.length -1; i >= 0; i--) {
      particles[i].draw();
    }
  },
  //Init
  function(entity) {
    var emitterPos = vectorMath.add(
      entity.components.ParticleSystem.emitter.components.Position,
      entity.components.ParticleSystem.offset
    );
    entity.components.ParticleSystem.emitter.EcsParticleEmitter = new EcsParticleEmitter(entity.components.ParticleSystem.emitter.components.Sprite.parent, emitterPos, vectorMath.fromAngle(0, -2));
  }
);
