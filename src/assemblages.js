ECS.Assemblages = {
  PhysicalThing : function(entity) {
    entity.addComponent( new ECS.Components.Position() );
    entity.addComponent( new ECS.Components.Rotation() );
    entity.addComponent( new ECS.Components.PhysicsShape() );
    entity.addComponent( new ECS.Components.Sprite() );
    return entity;
  }
};
