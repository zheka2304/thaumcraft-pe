IDRegistry.genItemID("itemQuill");
Item.createItem("itemQuill", "quill", {name: "quill"});


IDRegistry.genItemID("itemScribingTools");
Item.createItem("itemScribingTools", "scribing tools", {name: "scribing_tools"}, {stack: 1});

Recipes.addShapeless({id: IDData.item.itemScribingTools, count: 1, data: 0}, [{id: 288, data: 0}, {id: 351, data: 0}, {id: 374, data: 0}]);

Item.registerUseFunction("itemScribingTools", function(coords, item, block){
	if (block.id == IDData.block.blockThaumTable && block.data > 0){
		var offsets = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		];
		var canActivate = false;
		for (var i in offsets){
			var offset = offsets[i];
			var tile = World.getBlock(coords.x + offset[0], coords.y, coords.z + offset[1]);
			if (tile.data == getTableMetaByOffset(-offset[0], -offset[1])){
				if (tile.id == IDData.block.blockResTable){
					canActivate = false;
					break;
				}
				if (tile.id == IDData.block.blockThaumTable && block.data == getTableMetaByOffset(offset[0], offset[1])){
					canActivate = true;
				}
			}
		}
		
		if (canActivate && !World.getTileEntity(coords.x, coords.y, coords.z)){
			World.setBlock(coords.x, coords.y, coords.z, IDData.block.blockResTable, block.data);
			var resTable = World.addTileEntity(coords.x, coords.y, coords.z);
			var toolSlot = resTable.container.getSlot("toolSlot");
			toolSlot.id = item.id;
			toolSlot.count = item.count;
			toolSlot.data = item.data;
			Player.setCarriedItem(0, 0, 0);
		}
	}
});
