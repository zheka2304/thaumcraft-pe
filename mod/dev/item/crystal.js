IDRegistry.genItemID("itemCrystalOrdo");
IDRegistry.genItemID("itemCrystalAer");
IDRegistry.genItemID("itemCrystalIgnis");
IDRegistry.genItemID("itemCrystalAqua");
IDRegistry.genItemID("itemCrystalTerra");
IDRegistry.genItemID("itemCrystalDark");

Item.createItem("itemCrystalAer", "aer shard", {name: "shard", meta: 0});
Item.createItem("itemCrystalTerra", "terra shard", {name: "shard", meta: 1});
Item.createItem("itemCrystalDark", "dark shard", {name: "shard", meta: 2});
Item.createItem("itemCrystalOrdo", "ordo shard", {name: "shard", meta: 3});
Item.createItem("itemCrystalIgnis", "ignis shard", {name: "shard", meta: 4});
Item.createItem("itemCrystalAqua", "aqua shard", {name: "shard", meta: 5});

/*
IDRegistry.genItemID("testPickaxe");
Item.createItem("testPickaxe", "test pickaxe", {name: "shard", meta: 0});
ToolAPI.registerTool(ItemID.testPickaxe, "iron", ["stone"], {damage: 2, onAttack: function(carried, entity){
		Entity.setFire(entity, 5);
	}
});*/