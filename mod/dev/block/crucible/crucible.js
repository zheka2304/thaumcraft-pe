IDRegistry.genBlockID("blockThaumCrucible");

Block.createBlock("blockThaumCrucible", [
	{name: "magic crucible", texture: [["crucible", 0], ["crucible", 1], ["crucible", 2], ["crucible", 2], ["crucible", 2], ["crucible", 2]], inCreative: true},
	{name: "magic crucible", texture: [["crucible", 0], ["crucible", 3], ["crucible", 2], ["crucible", 2], ["crucible", 2], ["crucible", 2]]},
	{name: "magic crucible", texture: [["crucible", 0], ["crucible", 4], ["crucible", 2], ["crucible", 2], ["crucible", 2], ["crucible", 2]]},
]);







TileEntity.registerPrototype(IDData.block.blockThaumCrucible, {
	defaultValues: {
		liquid: 0,
		temp: 0
	},
	
	checkStorage: function(){
		if (!this.aspectStorage){
			this.aspectStorage = new AspectStorage();
			this.aspectStorage.syncWithTileEntity(this);
		}
	},
	
	init: function(){
		this.checkStorage();
	},
	
	tick: function(){		
		this.checkStorage();
	
		var time = World.getThreadTime();
		
		var content = this.container.getGuiContent();
		if (content){
			this.refreshUI(content);
		}
		
		if (time % 4 == 0){
			if (this.data.liquid == 1 && this.data.temp > 380){
				var item = Entity.findNearest({x: this.x + .5, y: this.y + 1, z: this.z + .5}, 64, .8);
				if (item){
					this.addItemEntity(item);
				}
			}
		}
		
		if (time % 20 == 0){
			this.refreshTile();
			this.refreshHeating();
		}
		
		if (this.data.liquid > 0){
			if (this.heating){
				this.data.temp += this.heating;
			}
			else{
				this.data.temp -= .2;
			}
		}
		else{
			this.data.temp = 0;
		}
		
		if (this.data.temp > 400){
			this.data.temp = 400;
			this.animate(3);
		}
	},
	
	
	animate: function(amount, lightnings){
		for (var i = 0; i < amount; i++){
			Particles.addParticle(this.x + Math.random(), this.y + .9 + Math.random() * .2, this.z + Math.random(), 31, 0, 0, 0, 0);
			if (lightnings && Math.random() < .05){
				ParticleAnimation.FadeBolt.randomBolt({x: this.x + .5, y: this.y + 1.1, z: this.z + .5}, .7, 2, 1);
			}
		}
	},
	
	click: function(id, count, data){
		Game.prevent();
		if (this.data.liquid == 0){
			if (id == 325 && data == 8){
				this.data.liquid = 1;
				this.refreshTile();
				Player.setCarriedItem(id, count, 0);
			}
			
			return true;
		}
	},
	
	
	refreshTile: function(){
		var tile = World.getBlock(this.x, this.y, this.z);
		if (tile.id == IDData.block.blockThaumCrucible && tile.data != this.data.liquid){
			World.setBlock(this.x, this.y, this.z, tile.id, this.data.liquid);
		}
	},
	
	refreshHeating: function(){
		var tile = World.getBlock(this.x, this.y - 1, this.z);
		this.heating = CrucibleHandler.getHeatingPower(tile.id);
	},
	
	
	
	addItemEntity: function(item){
		var container = Entity.getInventory(item);
		container.refreshItem();
		var slot = container.getSlot("item");
		if (slot.id != IDData.block.blockThaumCrucible){
			this.addItem(slot.id, slot.count, slot.data);
			Entity.remove(item);
		}
	},
	
	addItem: function(id, count, data){
		this.checkStorage();
		var result = CrucibleHandler.provideRecipe(id, count, data, this.aspectStorage.aspectAmounts);
		if (result){
			World.drop(this.x + .5, this.y + 1.1, this.z + .5, result.id, result.count, result.data);
			if (result.activatorLeft){
				World.drop(this.x + .5, this.y + 1.1, this.z + .5, id, result.activatorLeft, data);
			}
			this.data.liquid = 0;
			this.leakAllEssence();
			this.refreshTile();
			this.animate(100, true);
		}
		else {
			var aspects = AspectRegistry.getAspectsForItem(id, data);
			for (var name in aspects){
				this.aspectStorage.addEssenceByName(name, aspects[name] * count);
			}
			this.animate(60);
		} 
	},
	
	leakAllEssence: function(fluxAmount){
		var essences = this.aspectStorage.aspectAmounts;
		essences.flux = fluxAmount || 0;
		Aura.leakEssenceStack({x: this.x + .5, y: this.y + 1.1, z: this.z + .5}, essences, true);
		this.aspectStorage.clear();
		this.checkStorage();
	},
	
	
	
	
	
	
	
	
	
	/* ----------------------- UI -------------------------- */
	
	getGuiScreen: function(){
		if (this.data.liquid == 1 && this.data.temp >= 380){
			return crucibleGui;
		}
	},
	
	refreshUI: function(content){
		this.refreshAspectIcons(content.elements, this.aspectStorage.aspectAmounts);
	},
	
	refreshAspectIcons: function(elements, aspectAmounts){
		for (var name in elements){
			if (name.startsWith("IAspect")){
				elements[name] = null;
			}
		}
		
		var minors = [];
		var majors = [];
		for (var name in aspectAmounts){
			var amount = aspectAmounts[name];
			if (amount > 0){
				if (amount >= 6){
					majors.push(name);
				}
				else{
					minors.push(name);
				}
			}
		}
		
		this.showCircleOfAspects(elements, majors, {x: 500, y: 292, radius: 160, scale: 2}, "IAspectA");
		this.showCircleOfAspects(elements, minors, {x: 500, y: 292, radius: 100, scale: 1.5}, "IAspectB");
	},
	
	
	showCircleOfAspects: function(elements, array, coords, prefix){
		var size = Math.min(coords.scale * 32, coords.radius * Math.PI * 2 / (array.length * 1.3));
		for (var i in array){
			var angle = i / array.length * Math.PI * 2;
			var x = parseInt(coords.x + Math.sin(angle) * coords.radius);
			var y = parseInt(coords.y + Math.cos(angle) * coords.radius);
			var element = {type: "image", x: x - size / 2, y: y - size / 2, bitmap: AspectRegistry.getAspectIcon(array[i]), scale: size / 32};
			elements[prefix + "" + i] = element;
		}
	},
});