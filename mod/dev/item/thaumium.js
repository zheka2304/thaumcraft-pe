// ingot
IDRegistry.genItemID("itemThaumIngot");
Item.createItem("itemThaumIngot", "thaumium ingot", {name: "thaum_ingot"});

// armor
IDRegistry.genItemID("itemThaumHelmet");
IDRegistry.genItemID("itemThaumChestplate");
IDRegistry.genItemID("itemThaumLeggings");
IDRegistry.genItemID("itemThaumBoots");

// full set gives 19 armor
Item.createArmorItem("itemThaumHelmet", "thaumium helmet", {name: "thaum_helmet"}, {type: "helmet", armor: 4, durability: 812, texture: "armor/thaum_armor_1.png"});
Item.createArmorItem("itemThaumChestplate", "thaumium chestplate", {name: "thaum_chest"}, {type: "chestplate", armor: 6, durability: 812, texture: "armor/thaum_armor_1.png"});
Item.createArmorItem("itemThaumLeggings", "thaumium leggings", {name: "thaum_leggins"}, {type: "leggings", armor: 5, durability: 812, texture: "armor/thaum_armor_2.png"});
Item.createArmorItem("itemThaumBoots", "thaumium boots", {name: "thaum_boots"}, {type: "boots", armor: 4, durability: 812, texture: "armor/thaum_armor_1.png"});

var THAUM_ARMOR_INTERACT_FUNCS = {
	hurt: function(attacker, damage, slot, inventory, index){
		if (attacker && Math.random() < .25){
			ParticleAnimation.FadeBolt.connectingBolt(Player.getPosition(), Entity.getPosition(attacker), 4, 4, 2);
			Entity.damageEntity(attacker, damage + 1);
			World.playSoundAtEntity(attacker, "random.explode", 100);
		}
	}
};

Armor.registerFuncs("itemThaumHelmet", THAUM_ARMOR_INTERACT_FUNCS);
Armor.registerFuncs("itemThaumChestplate", THAUM_ARMOR_INTERACT_FUNCS);
Armor.registerFuncs("itemThaumLeggings", THAUM_ARMOR_INTERACT_FUNCS);
Armor.registerFuncs("itemThaumBoots", THAUM_ARMOR_INTERACT_FUNCS);
