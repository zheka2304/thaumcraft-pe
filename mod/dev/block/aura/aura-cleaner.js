IDRegistry.genBlockID("blockAuraCleaner");

Block.createBlock("blockAuraCleaner", [
	{name: "aura cleaner", texture: [["aura_cleaner", 2], ["aura_cleaner", 0], ["aura_cleaner", 1], ["aura_cleaner", 1], ["aura_cleaner", 1], ["aura_cleaner", 1]], inCreative: true}
]);

var auraCleanerGui = new UI.StandartWindow();
auraCleanerGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aura cleaner - dark extractor"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		}
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", x: 400, y: 30, bitmap: "aspect_scale_background", scale: 6}
	],
	elements: {
		"crystalScale": {type: "scale", x: 412, y: 54, direction: 3, scale: 6, invert: true, value: 0.7, bitmap: "aura_essence_crystal_2", overlay: "aspect_scale_overlay_2"},
		"crystalSlot": {type: "slot", x: 550, y: 210, size: 120}
	}
});

//UI.testUI(auraExtractorGui);




TileEntity.registerPrototype(IDData.block.blockAuraCleaner, {
	ASPECTS_PER_EXTRACTION: 4,
	EXTRACTION_AMOUNT: .2,
	ESSENCE_PER_ITEM: 24,
	REGEN_MULTIPLIER: .0125,
	REGEN_MAX_AMOUNT: .04,
	
	defaultValues: {
		progress: 0,
	},
	
	recacheEssences: function(){
		var aspects = AspectRegistry.getAll();
		this.positiveAspectCache = [];
		this.negativeAspectCache = [];
		for (var name in aspects){
			var aspect = aspects[name];
			if (aspect.power < -.2){
				this.negativeAspectCache.push(name);
			}
			else{
				this.positiveAspectCache.push(name);
			}
		}
	},
	
	getRandomEssenceData: function(positive){
		if (!this.positiveAspectCache || !this.negativeAspectCache){
			this.recacheEssences();
		}
		var cache = positive ? this.positiveAspectCache : this.negativeAspectCache;
		var essence = {};
		for (var i = 0; i < this.ASPECTS_PER_EXTRACTION; i++){
			var name = cache[parseInt(cache.length * Math.random())];
			essence[name] = this.EXTRACTION_AMOUNT * Math.random();
		}
		return essence;
	},
	
	addExtractedEssence: function(essence){
		for (var name in essence){
			this.data.progress += essence[name] / this.ESSENCE_PER_ITEM;
		}
	},
	
	regenEssence: function(essence){
		for (var name in essence){
			essence[name] += Math.min(essence[name] * this.REGEN_MULTIPLIER * Math.random(), this.REGEN_MAX_AMOUNT);
		}
	},
	
	moveNode: function(dist, animate){
		if (this.node){
			var target = {
				x: this.x + .5,
				y: this.y + 3.5,
				z: this.z + .5,
			};
			
			var delta = {
				x: target.x - this.node.coords.x,
				y: target.y - this.node.coords.y,
				z: target.z - this.node.coords.z,
			};
			
			var len = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z);
			var move = Math.min(len, dist);
			delta.x *= move / len;
			delta.y *= move / len;
			delta.z *= move / len;
			
			this.node.x += delta.x;
			this.node.y += delta.y;
			this.node.z += delta.z;
			
			if (this.animate){
				ParticleAnimation.FadeBolt.randomBolt(this.node.coords, dist / .5 * 1.5, 3, 2);
			}
		}
	},
	
	tick: function(){
		if (!this.node){
			this.node = Aura.getNearestAuraNode(this);
		}
		if (!this.connectionCache){
			this.connectionCache = Aura.createConnectionCache(this.x + .5, this.y + .5, this.z + .5);
		}
		
		var time = World.getThreadTime()
		if (time % 10 == 0){
			var essences = this.getRandomEssenceData(false);
			var extracted = Aura.extractEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, Math.random() < .16, this.connectionCache);
			this.addExtractedEssence(extracted);
			
			this.isDarkExtractorResearched = ResearchRegistry.isResearched("dark extractor");
			if (!this.isDarkExtractorResearched){
				this.data.progress = 0;
			}
			
			if (Math.random() < .25){
				this.moveNode(.25 * Math.random(), true);
			}
		}
		if (time % 10 == 5){
			var essences = this.getRandomEssenceData(true);
			var extracted = Aura.extractEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, Math.random() < .16, this.connectionCache);
			this.regenEssence(extracted);
			Aura.leakEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, extracted, Math.random() < .16, this.connectionCache)
		}
		
		this.container.setScale("crystalScale", this.data.progress);
		if (this.data.progress >= 1){
			var slot = this.container.getSlot("crystalSlot");
			if (this.isDarkExtractorResearched && slot.count < 64 && (slot.id == ItemID.itemFluxEssence || slot.id == 0)){
				this.data.progress = 0;
				slot.id = ItemID.itemFluxEssence;
				slot.count++;
			}
			else{
				this.data.progress = 1;
			}
		}
	},
	
	getGuiScreen: function(){
		if (this.isDarkExtractorResearched){
			return auraCleanerGui;
		}
	}
});