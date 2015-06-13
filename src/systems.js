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

ECS.System("PIXIRenderStage", ["BoundingBox", "Stage"],
  //Step
  function(entity){
    entity.components.Stage.renderRef.render(entity.components.Stage.root);
  },
  //Init
  function(entity){
    entity.components.Stage.renderRef = new PIXI.autoDetectRenderer(entity.components.BoundingBox.width, entity.components.BoundingBox.height);
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
