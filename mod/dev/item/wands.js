IDRegistry.genItemID("itemThaumWand");
Item.createItem("itemThaumWand", "wand", {name: "wand", meta: 0});

IDRegistry.genItemID("itemThaumWandCap");
Item.createItem("itemThaumWandCap", "wand cap", {name: "wand_cap", meta: 0});

Recipes.addShaped({id: IDData.item.itemThaumWandCap, count: 4, data: 0}, [" X ", "X X"], ["X", 265, 0]);
Recipes.addShaped({id: IDData.item.itemThaumWand, count: 1, data: 0}, ["  X", " # ", "X  "], ["X", IDData.item.itemThaumWandCap, 0, "#", 280, 0]);
Recipes.addShaped({id: IDData.item.itemThaumWand, count: 1, data: 0}, ["X  ", " # ", "  X"], ["X", IDData.item.itemThaumWandCap, 0, "#", 280, 0]);

Item.registerUseFunctionForID(IDData.item.itemThaumWand, function(coords, item, block){
	if (block.id == 47){
		var drop = World.drop(coords.x + .5, coords.y + .5, coords.z + .5, IDData.item.itemResearchBook, 1, 0);
		UpdatableAPI.addUpdatable({
			dropEntity: drop,
			update: function(){
				if (!Entity.isExist(this.dropEntity)){
					this.remove = true;
					return;
				}
				var pos = Entity.getPosition(this.dropEntity);
				pos.y += .26;
				ParticleAnimation.particleSplash(pos, {id: 31}, {offset: true, vel: .3, count: 6});
				
				if (Math.random() < .1){
					ParticleAnimation.FadeBolt.randomBolt(pos, .7, 2, 1);
				}
			}
		});
		World.setBlock(coords.x, coords.y, coords.z, 0);
	}
	
	if (block.id == 118 && ResearchRegistry.isResearched("alchemy")){
		World.setBlock(coords.x, coords.y, coords.z, IDData.block.blockThaumCrucible, 0);
		var tileEntity = World.addTileEntity(coords.x, coords.y, coords.z);
		tileEntity.animate(100);
	}
	
	if (block.id == IDData.block.blockThaumTable && block.data == 0 && ResearchRegistry.isResearched("arcane workbench")){
		World.setBlock(coords.x, coords.y, coords.z, IDData.block.blockArcaneWorkbench, 0);
		var tileEntity = World.addTileEntity(coords.x, coords.y, coords.z);
	}
})

