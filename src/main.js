document.addEventListener('DOMContentLoaded', function(){
  // Returns a random number between min (inclusive) and max (exclusive)
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  var engine = Matter.Engine.create(
    document.body,
    {
        positionIterations: 6,
        velocityIterations: 4,
        enableSleeping: true,
        render : {
          options: {
            width: window.innerWidth - 20,
            height: window.innerHeight - 20
          }
        }
    }
  );

  var ground = Matter.Bodies.rectangle(window.innerWidth / 2 - 10, window.innerHeight - 60, window.innerWidth - 20, 60, { isStatic: true, friction: 1 });
  Matter.World.add(engine.world, [ground]);

  var fluid = [];
  var radius = 10;
  var options = {
    friction : 1,
    frictionStatic : 0.5,
    frictionAir : 0,
    density : 1,
    slop : 0,
    restitution : 0.4,
  };

  Matter.Engine.run(engine);

  var maxParticles = 1000;
  var flowRate = 1;
  var flowSkip = 10;
  var tickCount = 0;

  var fluidEmitterStep = function() {
    if(tickCount < flowSkip) {
      if(fluid.length < maxParticles) {
        for(var i = flowRate; i > 0; i--) {
          var pos = Matter.Vector.create(window.innerWidth / 2 + 200 + getRandomArbitrary(-10, 10), 40 + ((i * radius * 2) + 1) + getRandomArbitrary(-10, 10));
          var newParticle = Matter.Bodies.polygon(pos.x, pos.y, 5, radius, options);
          Matter.Body.applyForce(newParticle, {x:0, y:0}, Matter.Vector.create(-4,0));
          fluid.push(newParticle);
          Matter.World.add(engine.world, [newParticle]);
        }
      }
      tickCount ++;
    } else {
      tickCount = 0;
    }
  };
  var fluidForceStep = function() {
    for(i = fluid.length - 1; i >= 0; i--) {
      Matter.Body.applyForce(fluid[i], {x:0, y:0}, Matter.Vector.create(getRandomArbitrary(-0.5,0.5), getRandomArbitrary(-0.5,0.5)));
    }
  };

  Matter.Events.on(engine, "beforeTick",  function(){
    fluidEmitterStep();
    fluidForceStep();
  });
});
