IDRegistry.genItemID("itemAlumentum");
Item.createThrowableItem("itemAlumentum", "alumentum", {name: "alumentum"});

Item.registerThrowableFunction("itemAlumentum", function(projectile, item, target){
	World.explode(target.x, target.y, target.z, 2, true);
});
