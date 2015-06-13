//ECS.System(name, components, systemStepFunc, systemInitFunc)

ecsPixiGetContainer = function(entity) {
  if(typeof entity.components.Stage !== "undefined") {
    return entity.components.Stage.root;
  }
  if(typeof entity.components.Sprite !== "undefined") {
    return entity.components.Sprite.renderRef;
  }
  return null;
};

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
