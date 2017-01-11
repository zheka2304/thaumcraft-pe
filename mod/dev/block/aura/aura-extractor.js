IDRegistry.genBlockID("blockAuraExtractor");

Block.createBlock("blockAuraExtractor", [
	{name: "aura extractor", texture: [["aura_extractor", 2], ["aura_extractor", 0], ["aura_extractor", 1], ["aura_extractor", 1], ["aura_extractor", 1], ["aura_extractor", 1]], inCreative: true}
]);

var auraExtractorGui = new UI.StandartWindow();
auraExtractorGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aura extractor"
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
		"crystalScale": {type: "scale", x: 412, y: 54, direction: 3, scale: 6, invert: true, value: 0.7, bitmap: "aura_essence_crystal_1", overlay: "aspect_scale_overlay_2"},
		"crystalSlot": {type: "slot", x: 550, y: 210, size: 120}
	}
});

//UI.testUI(auraExtractorGui);




TileEntity.registerPrototype(IDData.block.blockAuraExtractor, {
	ASPECTS_PER_EXTRACTION: 4,
	EXTRACTION_AMOUNT: .1,
	ESSENCE_PER_ITEM: 24,
	defaultValues: {
		progress: 0,
	},
	
	recacheEssences: function(){
		var aspects = AspectRegistry.getAll();
		this.aspectCache = [];
		for (var name in aspects){
			var aspect = aspects[name];
			if (aspect.power > 0){
				this.aspectCache.push(name);
			}
		}
	},
	
	getRandomExtractData: function(){
		if (!this.aspectCache){
			this.recacheEssences();
		}
		var essence = {};
		for (var i = 0; i < this.ASPECTS_PER_EXTRACTION; i++){
			var name = this.aspectCache[parseInt(this.aspectCache.length * Math.random())];
			essence[name] = this.EXTRACTION_AMOUNT * Math.random();
		}
		return essence;
	},
	
	addExtractedEssence: function(essence){
		for (var name in essence){
			this.data.progress += essence[name] / this.ESSENCE_PER_ITEM;
		}
	},
	
	tick: function(){
		if (!this.connectionCache){
			this.connectionCache = Aura.createConnectionCache(this.x + .5, this.y + .5, this.z + .5);
		}
		if (World.getThreadTime() % 10 == 0){
			this.addExtractedEssence(Aura.extractEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, this.getRandomExtractData(), Math.random() < .16, this.connectionCache));
		}
		
		this.container.setScale("crystalScale", this.data.progress);
		if (this.data.progress >= 1){
			var slot = this.container.getSlot("crystalSlot");
			if (slot.count < 64 && (slot.id == ItemID.itemAuramEssence || slot.id == 0)){
				this.data.progress = 0;
				slot.id = ItemID.itemAuramEssence;
				slot.count++;
			}
			else{
				this.data.progress = 1;
			}
		}
	},
	
	getGuiScreen: function(){
		return auraExtractorGui;
	}
});