Callback.addCallback("PostLoaded", function(){
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalAer, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalTerra, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalDark, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalOrdo, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalIgnis, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalAqua, 0, "A", 334, 0], "googles");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumBoots, count: 1, data: 0}, ["X X", "X X"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumLeggings, count: 1, data: 0}, ["XXX", "X X", "X X"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumChestplate, count: 1, data: 0}, ["X X", "XXX", "XXX"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumHelmet, count: 1, data: 0}, ["XXX", "X X"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockHellFurnaceCore, count: 1, data: 0}, ["X#X", "#A#", "X#X"], ["#", 49, 0, "X", 112, 0, "A", IDData.item.itemNitor, 0], "hell furnace");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockAuraMeter, count: 1, data: 0}, ["#", "A", "X"], ["A", 339, 0, "X", BlockID.blockThaumTable, 0, "#", IDData.item.itemNitor, 0], "aura recognition");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockAuraExtractor, count: 1, data: 0}, ["A", "#", "X"], ["A", 374, 0, "X", BlockID.blockAuraMeter, 0, "#", IDData.item.itemThaumIngot, 0], "aura extractor");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockAuraCleaner, count: 1, data: 0}, ["A", "#", "X"], ["A", 374, 0, "X", BlockID.blockAuraMeter, 0, "#", 49, 0], "aura cleaner");
})