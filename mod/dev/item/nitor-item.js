IDRegistry.genItemID("itemNitor");
Item.createItem("itemNitor", "nitor", {name: "nitor"});

Item.registerUseFunctionForID(IDData.item.itemNitor, function(coords, item, block){
	var place = coords.relative;
	if (World.getBlockID(place.x, place.y, place.z) == 0){
		World.setBlock(place.x, place.y, place.z, IDData.block.blockNitor);
		World.addTileEntity(place.x, place.y, place.z);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});