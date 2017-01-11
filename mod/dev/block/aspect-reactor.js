IDRegistry.genBlockID("blockAspectReactor");

Block.createBlockWithRotation("blockAspectReactor", [
	{name: "aspect reactor", texture: [["aspect_reactor", 3], ["aspect_reactor", 3], ["aspect_reactor", 3], ["aspect_reactor", 0], ["aspect_reactor", 1], ["aspect_reactor", 2]], inCreative: true}
]);

Recipes.addShaped({id: IDData.block.blockAspectReactor, count: 1, data: 0}, ["#XA", "#CB", "#XA"], ["X", 374, 0, "#", 5, -1, "A", 265, 0, "B", 20, 0]);


var aspectReactorGui = new UI.StandartWindow();
aspectReactorGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aspect reactor"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		},
		minHeight: 600
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
		{type: "bitmap", x: 842, y: 104, bitmap: "aspect_scale_background", scale: 4},
		{type: "bitmap", x: 560, y: 100, bitmap: "aspect_reactor_background", scale: 360 / 128},
	],
	elements: {
		"slot1": {type: "slot", x: 400, y: 100, size: 160},
		"slot2": {type: "slot", x: 400, y: 300, size: 160},
		"aspectScale": {type: "scale", x: 850, y: 120, direction: 1, scale: 8, value: 1, bitmap: "aspectScale_nitor", overlay: "aspect_scale_overlay_1", overlayScale: 4},
		"stateText": {type: "text", x: 625, y: 227, width: 90, height: 100, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6, size: 25}}
	}
});

TileEntity.registerPrototype(IDData.block.blockAspectReactor, {
	defaultValues: {
		resultAspectName: null,
		resultAspectAmount: 0,
		aspectSelection: {},
		leaking: 0,
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if (content){ 
			this.updateItemsInSlots(content.elements);
			var result = this.getResult();
			if (result){
				if (this.data.resultAspectName != result.name){
					var essences = {};
					essences[this.data.resultAspectName] = this.data.resultAspectAmount;
					Aura.leakEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, true);
					this.data.resultAspectName = result.name;
					this.data.resultAspectAmount = 0;
				}
				this.updateResultIcon(content.elements, this.data.resultAspectName, this.data.resultAspectAmount);
			}
			else{
				this.updateResultIcon(content.elements, null);
			}
		}
		if (this.data.leaking > 0 && World.getThreadTime() % 20 == 0) {
			this.data.leaking--;
			var essences = {flux: .015 * Math.random()};
			essences[this.data.resultAspectName] = .07 * Math.random();
			Aura.leakEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, true);
		}
	},
	
	getResult: function(){
		if (this.data.aspectSelection["slot1"] && this.data.aspectSelection["slot2"]){
			var aspect1 = this.data.aspectSelection["slot1"];
			var aspect2 = this.data.aspectSelection["slot2"];
			return AspectRegistry.getReactionResult(aspect1, aspect2);
		}
		return null;
	},
	
	onResearched: function(){
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		if (slot1.count > 0 && slot2.count > 0){
			var aspects1 = AspectRegistry.getAspectsForItem(slot1.id, slot1.data);
			var aspects2 = AspectRegistry.getAspectsForItem(slot2.id, slot2.data);
			var essenceAmount = (aspects1[this.data.aspectSelection.slot1] || 0) + (aspects2[this.data.aspectSelection.slot1] || 0);
			AspectRegistry.researchAspect(this.data.resultAspectName, essenceAmount, 2.5);
			this.data.resultAspectAmount += essenceAmount * .4;
			slot1.count--;
			slot2.count--;
			if (slot1.count < 1){
				slot1.id = slot1.count = slot1.data = 0;
			}
			if (slot2.count < 1){
				slot2.id = slot2.count = slot2.data = 0;
			}
			this.data.leaking += 7;
		}
	},
	
	
	
	
	
	
	
	
	
	
	
	getGuiScreen: function(){
		return aspectReactorGui;
	},

	updateResultIcon: function(elements, aspectName, aspectAmount){
		if (aspectName){
			var researchProgress = AspectRegistry.getResearchProgress(aspectName);
			// set elements
			elements.resultIcon = {type: "image", x: 717, y: 235, bitmap: AspectRegistry.getAspectIcon(aspectName), scale: 2.8125, overlay: "aspect_reactor_overlay", clicker: {
					onClick: function(position, container, tileEntity){
						tileEntity.onResearched();
					}
				}
			};
			elements.aspectScale.bitmap = AspectRegistry.getAspectScale(aspectName);
			// set element values
			this.container.setScale("aspectScale", aspectAmount / 50);
			this.container.setText("stateText", parseInt(researchProgress * 100) + "%");
		}
		else{
			elements.resultIcon = {type: "image", x: 717, y: 235, scale: 2.8125, bitmap: "aspect_reactor_overlay"};
			this.container.setScale("aspectScale", 0);
			this.container.setText("stateText", "");
		}
	},
	
	updateItemsInSlots: function(elements){
		for (var name in elements){
			if (name.startsWith("IAspect")){
				elements[name] = null;
			}
		}
		this.updateSlot(elements, "slot1", {x: 567, y: 180});
		this.updateSlot(elements, "slot2", {x: 567, y: 380});
	},
	
	createClicker: function(aspectName, slotName){
		return {
			onClick: function(position, container, tileEntity){
				if (!AspectRegistry.isResearched(aspectName)){
					tileEntity.data.aspectSelection[slotName] = null;
				}
				else{
					tileEntity.data.aspectSelection[slotName] = aspectName;
				}
			}
		};
	},
	
	updateSlot: function(elements, slotName, coords){
		var slot = this.container.getSlot(slotName);
		var aspects = AspectRegistry.getAspectsForItem(slot.id, slot.data);
		var aspectNames = [];
		for (var name in aspects){
			aspectNames.push(name);
		}
		
		if (!aspects[this.data.aspectSelection[slotName]]){
			this.data.aspectSelection[slotName] = null;
		}
		
		var iconSize = Math.min(aspectNames.length * 44, 140) / aspectNames.length;
		var offsetY = coords.y - iconSize * .5 * aspectNames.length;
		for (var i in aspectNames){
			var aspectName = aspectNames[i];
			var aspectIcon = {type: "image", x: coords.x + (44 - iconSize) * .5, y: offsetY + i * iconSize, bitmap: AspectRegistry.getAspectIcon(aspectName), scale: iconSize / 32, clicker: this.createClicker(aspectName, slotName)};
			if (aspectName == this.data.aspectSelection[slotName]){
				aspectIcon.overlay = "aspect_selection";
			}
			elements["IAspect" + slotName + i] = aspectIcon;
		}
	}
});