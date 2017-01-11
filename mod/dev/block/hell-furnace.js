IDRegistry.genBlockID("blockHellFurnaceCore");
IDRegistry.genBlockID("blockHellFurnaceDecor");

Block.createBlock("blockHellFurnaceCore", [
	{name: "hell furnace core", texture: [["hell_furnace", 2], ["hell_furnace", 0], ["hell_furnace", 2], ["hell_furnace", 2], ["hell_furnace", 2], ["hell_furnace", 2]], inCreative: true}
], BLOCK_TYPE_LOW_LIGHT);

Block.createBlock("blockHellFurnaceDecor", [
	{name: "tile.hellfurnace_decoration.name", texture: [["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1]]},
	{name: "tile.hellfurnace_decoration.name", texture: [["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1]]}
], BLOCK_TYPE_LOW_LIGHT);

Block.setBlockShape(IDData.block.blockHellFurnaceDecor, {x: .49, y: 0, z: 0}, {x: .51, y: 1, z: 1}, 0);
Block.setBlockShape(IDData.block.blockHellFurnaceDecor, {x: 0, y: 0, z: .49}, {x: 1, y: 1, z: .51}, 1);
Block.registerDropFunction("blockHellFurnaceDecor", function(coords, blockID, blockData, level){
	if (level > 2){
		return [[101, 1, 0]];
	}
	else{
		return [];
	}
});



var HELL_FURNACE_PATTERN = [
	// bot
	[-1, -2, -1, 112, 0],
	[-1, -2,  0,  49, 0],
	[-1, -2,  1, 112, 0],
	
	[ 0, -2, -1,  49, 0],
	[ 0, -2,  0, 112, 0],
	[ 0, -2,  1,  49, 0],
	
	[ 1, -2, -1, 112, 0],
	[ 1, -2,  0,  49, 0],
	[ 1, -2,  1, 112, 0],
	
	
	// mid
	[-1, -1, -1,  49, 0],
	[-1, -1,  0, 112, 0],
	[-1, -1,  1,  49, 0],
	
	[ 0, -1, -1, 112, 0],
	[ 0, -1,  0,  11, 0, 10],
	[ 0, -1,  1, 112, 0],
	
	[ 1, -1, -1,  49, 0],
	[ 1, -1,  0, 112, 0],
	[ 1, -1,  1,  49, 0],
	
	
	// top
	[-1,  0, -1, 112, 0],
	[-1,  0,  0,  49, 0],
	[-1,  0,  1, 112, 0],
	
	[ 0,  0, -1,  49, 0],
	[ 0,  0,  0, IDData.block.blockHellFurnaceCore, 0],
	[ 0,  0,  1,  49, 0],
	
	[ 1,  0, -1, 112, 0],
	[ 1,  0,  0,  49, 0],
	[ 1,  0,  1, 112, 0],
]

TileEntity.registerPrototype(IDData.block.blockHellFurnaceCore, {
	defaultValues: {
		stack: [],
		hasPattern: false,
		hasPatternTemp: false,
		checkingTick: 0,
	},
	
	tick: function(){
		this.continuouslyCheckPattern();
		
		if (this.data.hasPattern){
			if (World.getThreadTime() % 5 == 0){
				var drop = Entity.findNearest({x: this.x + .5, y: this.y + 1, z: this.z + .5}, 64, .8);
				if (drop){
					this.addItem(drop);
				}
			}
			
			var exitCoords = this.exitCoords;
			for (var i in this.data.stack){
				var item = this.data.stack[i];
				if (item.time++ > 200){
					this.data.stack.splice(i--, 1);
					if (exitCoords){
						Entity.setVelocity(World.drop(this.x + exitCoords.x * 1.5 + .5, this.y + exitCoords.y + .5, this.z + exitCoords.z * 1.5 + .5, item.id, item.count, item.data), exitCoords.x * .1, 0, exitCoords.z * .1);
						Aura.leakEssenceStack({x: this.x + exitCoords.x * 2 + .5, y: this.y + exitCoords.y + .5, z: this.z + exitCoords.z * 1.5 + .5}, {flux: item.count * .02, ignis: item.count * .08}, true);
					}
				}
			}
		}
		
	},
	
	addItem: function(item){
		var container = Entity.getInventory(item);
		container.refreshItem();
		var slot = container.getSlot("item");
		var result = Recipes.getFurnaceRecipeResult(slot.id, "hellish");
		if (result){
			Entity.remove(item);
			this.data.stack.push({id: result.id, count: slot.count, data: result.data, time: 0});
		}
	},
	
	destroy: function(){
		this.findRelativeExitCoords(false, true);
	},
	
	
	
	
	
	
	
	findRelativeExitCoords: function(replaceTile, replaceBack){
		var possibleCoords = [
			{x: -1, y: -1, z: 0, decor: 0},
			{x: 1, y: -1, z: 0, decor: 0},
			{x: 0, y: -1, z: -1, decor: 1},
			{x: 0, y: -1, z: 1, decor: 1},
		];
		for (var i in possibleCoords){
			var tile = World.getBlock(this.x + possibleCoords[i].x, this.y + possibleCoords[i].y, this.z + possibleCoords[i].z).id;
			if (tile == 101 || tile == IDData.block.blockHellFurnaceDecor){
				if (replaceTile && tile == 101){
					World.setBlock(this.x + possibleCoords[i].x, this.y + possibleCoords[i].y, this.z + possibleCoords[i].z, IDData.block.blockHellFurnaceDecor, possibleCoords[i].decor);
				}
				if (replaceBack){
					World.setBlock(this.x + possibleCoords[i].x, this.y + possibleCoords[i].y, this.z + possibleCoords[i].z, 101, 0);
				}
				return possibleCoords[i];
			}
		}
	},
	
	continuouslyCheckPattern: function(){
		if (!this.exitCoords || this.data.checkingTick == 0){
			this.exitCoords = this.findRelativeExitCoords(this.data.hasPattern);
		}
		if (!this.exitCoords){
			this.data.hasPattern = false;
			return;
		}
		
		if (this.data.checkingTick == 0){
			if (this.data.hasPattern && !this.data.hasPatternTemp){
				this.findRelativeExitCoords(false, true);
			}
			this.data.hasPattern = this.data.hasPatternTemp;
			this.data.hasPatternTemp = true;
		}
		
		var checking = HELL_FURNACE_PATTERN[this.data.checkingTick];
		if (!(checking[0] == this.exitCoords.x && checking[1] == this.exitCoords.y && checking[2] == this.exitCoords.z)){
			var tile = World.getBlock(this.x + checking[0], this.y + checking[1], this.z + checking[2]);
			if ((tile.id != checking[3] || tile.data != checking[4]) && tile.id != checking[5]){
				this.data.checkingTick = 0;
				this.data.hasPatternTemp = false;
				return;
			}
		}
		
		this.data.checkingTick++;
		this.data.checkingTick %= HELL_FURNACE_PATTERN.length;
	}
});
