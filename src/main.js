(function () {

  //Create All our Objects
  window.game = {};
  game.iterate = function(callback) {
    for (var entity in this) {
      if(entity !== "iterate") {
        if(Array.isArray(this[entity])) {
          for(var i = this[entity].length - 1; i >= 0; i--) {
            callback(this[entity][i]);
          }
        } else {
          callback(this[entity]);
        }
      }
    }
  };

  game.world   = new ECS.Entity()
                .addComponent( new ECS.Components.BoundingBox() )
                .addComponent( new ECS.Components.Stage() );

  game.bottle  = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                   .addComponent( new ECS.Components.AutoForce() );

  game.fluid   = new ECS.Entity()
                   .addComponent( new ECS.Components.BoundingBox() )
                   .addComponent( new ECS.Components.ParticleSystem() );

  game.tray    = ECS.Assemblages.PhysicalThing(new ECS.Entity());

  game.hand    = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                    .addComponent( new ECS.Components.BoundingBox() )
                    .addComponent( new ECS.Components.MouseControl() );

  //Init All Entities
  game.world.components.BoundingBox.width = window.innerWidth - 20;
  game.world.components.BoundingBox.height = window.innerHeight - 20;
  var gameDims = game.world.components.BoundingBox;
  game.hand.components.BoundingBox = gameDims;
  game.fluid.components.BoundingBox = gameDims;

  var initComponents = function(entity, settings) {
    entity.components.Sprite.imgSrc = settings.imgSrc;
    entity.components.Position.x = settings.position.x;
    entity.components.Position.y = settings.position.y;
    entity.components.Rotation.radians = (typeof settings.rotation !== "undefined") ? settings.rotation : entity.components.Rotation.radians;
    entity.components.Sprite.scale = (typeof settings.scale !== "undefined") ? settings.scale : entity.components.Sprite.scale;
    entity.components.Sprite.parent = (typeof settings.parent !== "undefined") ? settings.parent : game.world;
    entity.components.PhysicsShape.type = (typeof settings.shape !== "undefined") ? settings.shape : entity.components.PhysicsShape.type;

  };

  game.bottle.components.AutoForce.type = "linear";
  initComponents(game.bottle, {
    imgSrc : "ChampagneBottle.png",
    shape : "bottle",
    position : {
      x : gameDims.width / 2,
      y : 100
    },
    rotation : Math.PI / -2
  });

  game.fluid.components.ParticleSystem.emitter = game.bottle;
  game.fluid.components.ParticleSystem.offset = ecsVec2(0, 0);

  var startingPos =  {
    x : gameDims.width / 2,
    y : gameDims.height - 115
  };

  initComponents(game.hand, {
    imgSrc : "Hand.png",
    shape : "hand",
    scale : 0.25,
    position : startingPos
  });


  initComponents(game.tray, {
    imgSrc : "Tray.png",
    shape : "tray",
    scale : 0.5,
    position : {
      x : startingPos.x,
      y : startingPos.y - 15
    }
  });
  var trayBounds = {x: 783, width: 330};

  game.glasses = [];

  var genGlassTower = function(numBase) {
    var i = 0;
    var newGlass = null;
    var glassWidth = 25;

    var calcOffset = function(numBase) {
      if(numBase === 1) { return 3; }
      else if(numBase === 2) { return 2.1; }
      else {
        var offsetA = calcOffset(numBase - 2);
        var offsetB = calcOffset(numBase - 1);
        var offsetDiff = (offsetA - offsetB) / 2.15;
        return offsetB - offsetDiff;
      }
    };
    var start = (gameDims.width / 2) - (glassWidth * numBase * calcOffset(numBase));

    for(i = numBase; i > 0; i--) {
      for(j = i; j > 0; j--) {
        newGlass = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                      .addComponent( new ECS.Components.Fillable() );
        initComponents(newGlass, {
          imgSrc : "ChampagneGlass.png",
          shape : "champagneGlass",
          position : {
            x : start + glassWidth - ((i - numBase) * glassWidth) + (j * glassWidth * 2),
            y : gameDims.height - 250 + (120 * (i - numBase) )
          }
        });

        game.glasses.push(newGlass);
      }
    }
  };
  genGlassTower(3);

  //Init All the Systems
  for (var name in ECS.Systems) {
    game.iterate(ECS.Systems[name].init);
  }

  // Game Loop
  var tick = function() {
    requestAnimationFrame(tick);
    for (var name in ECS.Systems) {
      game.iterate(ECS.Systems[name].step);
    }
  };
  tick();
})();
