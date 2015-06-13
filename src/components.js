var ecsVec2 = function() {
  return {
    x : 0,
    y : 0
  };
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
  this.positions = null;
});

ECS.Component("Fillable", function(){
  this.fillLevel = 0;
});

ECS.Component("AutoForce", function(){
  this.forceType = "";
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
