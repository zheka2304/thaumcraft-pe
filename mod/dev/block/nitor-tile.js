IDRegistry.genBlockID("blockNitor");

Block.createBlock("blockNitor", [
	{name: "nitor.tile", texture: [["empty"], ["empty"], ["empty"], ["empty"], ["empty"], ["empty"]]}
], BLOCK_TYPE_LOW_LIGHT);

Block.registerDropFunction("blockNitor", function(){
	return [[IDData.item.itemNitor, 1, 0]];
});

TileEntity.registerPrototype(IDData.block.blockNitor, {
	tick: function(){
		ParticleAnimation.animateNitor(this.x + .5, this.y + .2, this.z + .5, .6);
	}
});

CrucibleHandler.registerHeatTile(IDData.block.blockNitor, .8);