var ecsVec2 = function(x, y) {
  return {
    x : (typeof x !== "undefined") ? x : 0,
    y : (typeof y !== "undefined") ? y : 0
  };
};
var vectorMath = {
  // Add a vector to another
  add : function(vectorA, vectorB) {
    return ecsVec2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
  },

  // Gets the length of the vector
  getMagnitude : function (vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  },

  // Gets the angle accounting for the quadrant we're in
  getAngle : function (vector) {
    return Math.atan2(vector.y,vector.x);
  },

// Allows us to get a new vector from angle and magnitude
  fromAngle : function (angle, magnitude) {
    return ecsVec2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }
};

ECS.Component("Position", function(){
  this.x = 0;
  this.y = 0;
});

ECS.Component("Rotation", function(){
  this.radians = 0;
});

ECS.Component("PhysicsShape", function(){
  this.type = "";
});

ECS.Component("BoundingBox", function(){
  this.width = 0;
  this.height = 0;
});

ECS.Component("MouseControl", function(){
  this.position = ecsVec2();
  this.velocity = ecsVec2();
  this.accel = ecsVec2();
});

ECS.Component("ParticleSystem", function(){
  this.emitter = null;
  this.offset = ecsVec2();
  this.particles = [];
});

ECS.Component("Fillable", function(){
  this.fillLevel = 0;
});

ECS.Component("AutoForce", function(){
  this.type = "";
});

ECS.Component("Sprite", function(){
  this.imgSrc = "";
  this.scale = 0.4;
  this.renderRef = null;
  this.parent = null;
});

ECS.Component("Stage", function(){
  this.renderRef = null;
  this.root = null;
});
