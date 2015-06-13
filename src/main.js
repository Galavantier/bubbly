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
                   .addComponent( new ECS.Components.ParticleSystem() );

  game.tray    = ECS.Assemblages.PhysicalThing(new ECS.Entity());

  game.hand    = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                   .addComponent( new ECS.Components.MouseControl() );

  //Init All Entities
  game.world.components.BoundingBox.width = window.innerWidth - 20;
  game.world.components.BoundingBox.height = window.innerHeight - 20;

  var initComponents = function(entity, settings) {
    entity.components.Sprite.imgSrc = settings.imgSrc;
    entity.components.Position.x = settings.position.x;
    entity.components.Position.y = settings.position.y;
    entity.components.Rotation.radians = (typeof settings.rotation !== "undefined") ? settings.rotation : entity.components.Rotation.radians;
    entity.components.Sprite.scale = (typeof settings.scale !== "undefined") ? settings.scale : entity.components.Sprite.scale;
    entity.components.Sprite.parent = (typeof settings.parent !== "undefined") ? settings.parent : game.world;
  };

  var gameDims = game.world.components.BoundingBox;

  initComponents(game.bottle, {
    imgSrc : "ChampagneBottle.png",
    position : {
      x : gameDims.width / 2,
      y : 100
    },
    rotation : Math.PI / -2
  });

  initComponents(game.tray, {
    imgSrc : "Tray.png",
    scale : 0.5,
    position : {
      x : (gameDims.width / 2),
      y : gameDims.height - 150
    }
  });
  var trayBounds = {x: 750, y: 616, width: 396, height: 16.799999999999955, type: 1};

  initComponents(game.hand, {
    imgSrc : "Hand.png",
    scale : 0.25,
    position : {
      x : gameDims.width / 2,
      y : gameDims.height - 135
    }
  });

  game.glasses = [];
  var i = 0;
  var newGlass = null;

  for(i = 4; i > 0; i--){
    newGlass = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                      .addComponent( new ECS.Components.Fillable() );

    initComponents(newGlass, {
      imgSrc : "ChampagneGlass.png",
      position : {
        x : trayBounds.x + 55 + (i * 55),
        y : gameDims.height - 270
      }
    });

    game.glasses.push(newGlass);
  }
  for(i = 3; i > 0; i--){
    newGlass = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                      .addComponent( new ECS.Components.Fillable() );

    initComponents(newGlass, {
      imgSrc : "ChampagneGlass.png",
      position : {
        x : trayBounds.x + 83 + (i * 55),
        y : gameDims.height - 390
      }
    });

    game.glasses.push(newGlass);
  }
  for(i = 2; i > 0; i--){
    newGlass = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                      .addComponent( new ECS.Components.Fillable() );

    initComponents(newGlass, {
      imgSrc : "ChampagneGlass.png",
      position : {
        x : trayBounds.x + 110 + (i * 55),
        y : gameDims.height - 510
      }
    });

    game.glasses.push(newGlass);
  }
  for(i = 1; i > 0; i--){
    newGlass = ECS.Assemblages.PhysicalThing(new ECS.Entity())
                      .addComponent( new ECS.Components.Fillable() );

    initComponents(newGlass, {
      imgSrc : "ChampagneGlass.png",
      position : {
        x : trayBounds.x + 138 + (i * 55),
        y : gameDims.height - 630
      }
    });

    game.glasses.push(newGlass);
  }

  //Init All the Systems
  for (var name in ECS.Systems) {
    game.iterate(ECS.Systems[name].init);
  }

  console.log(game);

  // Game Loop
  var tick = function() {
    requestAnimationFrame(tick);
    for (var name in ECS.Systems) {
      game.iterate(ECS.Systems[name].step);
    }
  };
  tick();

    // // You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
    // // which will try to choose the best renderer for the environment you are in.
    // var renderer = new PIXI.autoDetectRenderer(800, 600);
    //
    // // The renderer will create a canvas element for you that you can then insert into the DOM.
    // document.body.appendChild(renderer.view);
    //
    // // You need to create a root container that will hold the scene you want to draw.
    // var stage = new PIXI.Container();
    //
    // // This creates a texture from a 'bunny.png' image.
    // var bunnyTexture = PIXI.Texture.fromImage("imgs/Hand.png");
    // var bunny = new PIXI.Sprite(bunnyTexture);
    //
    // // Setup the position and scale of the bunny
    // bunny.position.x = 400;
    // bunny.position.y = 300;
    //
    // bunny.scale.x = 0.5;
    // bunny.scale.y = 0.5;
    //
    // // Add the bunny to the scene we are building.
    // stage.addChild(bunny);
    //
    // function animate() {
    //     // start the timer for the next animation loop
    //     requestAnimationFrame(animate);
    //
    //     // each frame we spin the bunny around a bit
    //     bunny.rotation += 0.01;
    //
    //     // this is the main render call that makes pixi draw your container and its children.
    //     renderer.render(stage);
    // }
    //
    // // kick off the animation loop (defined below)
    // animate();
})();
