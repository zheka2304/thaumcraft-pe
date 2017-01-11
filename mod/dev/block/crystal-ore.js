IDRegistry.genBlockID("blockOreCrystal");

Block.createBlock("blockOreCrystal", [
	{name: "crystal ore", texture: [["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5]], inCreative: true},
], BLOCK_TYPE_SOLID_ORE);

ToolAPI.registerBlockMaterial(BlockID.blockOreCrystal, "stone");

Block.registerDropFunction("blockOreCrystal", function(coords, blockID, blockData, level){
	if (level < 2){
		return [];
	}
	var count = parseInt(1 + Math.random() * 2);
	switch (parseInt(blockData)){
		case 0:
		return [[IDData.item.itemCrystalAer, count, 0]];
		case 1:
		return [[IDData.item.itemCrystalTerra, count, 0]];
		case 2:
		return [[IDData.item.itemCrystalDark, count, 0]];
		case 3:
		return [[IDData.item.itemCrystalOrdo, count, 0]];
		case 4:
		return [[IDData.item.itemCrystalIgnis, count, 0]];
		case 5:
		return [[IDData.item.itemCrystalAqua, count, 0]];
	}
	return [];
}, 2);

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	for (var i = 0; i < 4 + Math.random() * 6; i++){
		var data = parseInt(Math.random() * 6);
		var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 12, 56);
		GenerationUtils.genMinable(coords.x, coords.y, coords.z, {size: 1, ratio: 1, checkerMode: 1, id: IDData.block.blockOreCrystal, data: data});
	}
});

Callback.addCallback("NativeGuiChanged", function(name){
	//alert(name);
})