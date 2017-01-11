IDRegistry.genBlockID("blockThaumTable");
Block.createBlock("blockThaumTable", [
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 1], ["research_table", 1], ["research_table", 1], ["research_table", 1]], inCreative: true}, // full
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 1], ["empty", 0], ["research_table", 4], ["research_table", 5]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["empty", 0], ["research_table", 1], ["research_table", 5], ["research_table", 4]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 5], ["research_table", 4], ["research_table", 1], ["empty", 0]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 4], ["research_table", 5], ["empty", 0], ["research_table", 1]]},
]);

IDRegistry.genBlockID("blockResTable");
Block.createBlock("blockResTable", [
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 1], ["research_table", 1], ["research_table", 1], ["research_table", 1]]}, // full
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 1], ["empty", 0], ["research_table", 4], ["research_table", 5]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["empty", 0], ["research_table", 1], ["research_table", 5], ["research_table", 4]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 5], ["research_table", 4], ["research_table", 1], ["empty", 0]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 4], ["research_table", 5], ["empty", 0], ["research_table", 1]]},
]);


Recipes.addShaped({id: IDData.block.blockThaumTable, count: 1, data: 0}, ["XXX", "# #"], ["X", 158, -1, "#", 5, -1]);

function getTableMetaByOffset(x, z){
	var key = x + ":" + z;
	switch (key){
		case "1:0":
		return 3;
		case "-1:0":
		return 4;
		case "0:1":
		return 1;
		case "0:-1":
		return 2;
	}
	return 0;
}

function isTableTile(id){
	return id == IDData.block.blockThaumTable || id == IDData.block.blockResTable;
}

function thaumTablePlaceFunc(coords, item, data){
	var pos = coords.relative;
	var block = World.getBlock(pos.x, pos.y, pos.z);
	if (block.id == 0){
		var offsets = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		];
		for (var i in offsets){
			var offset = offsets[i];
			var tile = World.getBlock(pos.x + offset[0], pos.y, pos.z + offset[1]);
			if (isTableTile(tile.id)){
				World.setBlock(pos.x, pos.y, pos.z, item.id, getTableMetaByOffset(offset[0], offset[1]));
				World.setBlock(pos.x + offset[0], pos.y, pos.z + offset[1], tile.id, getTableMetaByOffset(-offset[0], -offset[1]));
				return;
			}
		};
		
		World.setBlock(pos.x, pos.y, pos.z, item.id, 0);
	}
	return pos;
}

function thaumTableDropFunc(coords, blockID, blockData){
	var offsets = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];
	for (var i in offsets){
		var offset = offsets[i];
		var tile = World.getBlock(coords.x + offset[0], coords.y, coords.z + offset[1]);
		if (isTableTile(tile.id)){
			if (getTableMetaByOffset(-offset[0], -offset[1]) == tile.data && tile.data > 0){
				World.setBlock(coords.x + offset[0], coords.y, coords.z + offset[1], IDData.block.blockThaumTable, 0);
			} 
		}
	}
	return [[IDData.block.blockThaumTable, 1, 0]];
}

Block.registerPlaceFunction("blockThaumTable", thaumTablePlaceFunc);
Block.registerDropFunction("blockThaumTable", thaumTableDropFunc);
Block.registerPlaceFunction("blockResTable", thaumTablePlaceFunc);
Block.registerDropFunction("blockResTable", thaumTableDropFunc);












var researchTableGui = new UI.StandartWindow();
researchTableGui.setContent({
	standart: {
		header: {
			text: {
				text: "Research table"
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
		minHeight: 650
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
		{type: "bitmap", x: 634, y: 88, bitmap: "aspect_scale_background", scale: 3},
		{type: "frame", x: 618, y: 72, width: 340, height: 304, bitmap: "thaum_frame_tin", scale: 5},
		{type: "frame", x: 695, y: 422, width: 172, height: 172, bitmap: "thaum_frame_tin", scale: 5}
	],
	elements: {
		"researchSlot": {type: "slot", x: 340, y: 60, size: 200},
		"pageSlot": {type: "slot", x: 340, y: 275, size: 100},
		"toolSlot": {type: "slot", x: 838, y: 220, size: 108},
		"aspectScale": {type: "scale", x: 640, y: 100, direction: 1, scale: 6, value: 1, bitmap: "aspectScale_nitor", overlay: "aspect_scale_overlay_1", overlayScale: 3},
		"aspectText1": {type: "text", x: 720, y: 90, width: 300, height: 50, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6}},
		"aspectText2": {type: "text", x: 720, y: 130, width: 300, height: 50, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6}},
		"pageName": {type: "text", x: 340, y: 375, width: 400, height: 50, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6}},
	}
});


//(new UI.Container()).openAs(researchTableGui);

TileEntity.registerPrototype(IDData.block.blockResTable, {
	age: 0,
	tick: function(){
		var content = this.container.getGuiContent();
		if (content){
			/* refresh icons */
			var researchSlot = this.container.getSlot("researchSlot");
			var aspects = AspectRegistry.getAspectsForItem(researchSlot.id, researchSlot.data);
			var aspectNames = [];
			for (var name in aspects){
				aspectNames.push(name);
			}
			var selectedAmount = aspects[this.selectedAspect];
			if (!selectedAmount){
				this.selectedAspect = null;
			}
			
			/* */
			this.refreshIcons(content.elements, aspectNames, this.selectedAspect);
			this.refreshAspectData(content.elements, this.selectedAspect, selectedAmount);
			
			var pageSlot = this.container.getSlot("pageSlot");
			var research = null;
			if (pageSlot.id == IDData.item.itemResearchBookPage){
				research = ResearchRegistry.getResearchByID(pageSlot.data);
				if (research){
					this.container.setText("pageName", research.name);
				}
				else{
					this.container.setText("pageName", "corrupted page " + pageSlot.data);
				}
			}
			else{
				this.container.setText("pageName", "");
			}
			
			if (research){
				this.drawResearchLine(content.elements, research.aspectNames, research.progress, ResearchRegistry.getResearchPosition(research));
			}
			else{
				this.drawResearchLine(content.elements, [], {}, 0);
			}
			
			this.currentResearch = research;
		}
		
		if (this.animationQuill){
			//ParticleAnimation.particleSplash(this.animationQuill.coords, {id: 31}, {offset: true, vel: .3, count: 2});
		}
	},
	
	
	
	/* ------------ animation ------------ */
	
	init: function(){
		this.animationQuill = new Animation.item(this.x + parseInt(Math.random() * 2) * .4 + .3, this.y + 1.2, this.z + parseInt(Math.random() * 2) * .4 + .3);
		this.animationQuill.describeItem({id: IDData.item.itemScribingTools, count: 1, data: 0, size: .45, rotation: Math.random() > .5 ? "x" : "z"});
		this.animationQuill.load();
		
		ParticleAnimation.particleSplash(this.animationQuill.coords, {id: 31}, {offset: true, vel: .3, count: 100});
	},
	
	destroy: function(){
		if (this.animationQuill){
			this.animationQuill.destroy();
			ParticleAnimation.particleSplash(this.animationQuill.coords, {id: 31}, {offset: true, vel: .3, count: 100});
		}
		return false;
	},
	
	
	
	/* --------------- UI ---------------- */
	getClickerForAspect: function(aspectName){
		return {
			onClick: function(position, container, tileEntity){
				if (AspectRegistry.isResearched(aspectName)){
					tileEntity.selectedAspect = aspectName;
				}
				else{
					tileEntity.selectedAspect = null;
				}
			}
		};
	},
	
	refreshIcons: function(elements, aspects, selected){
		for (var name in elements){
			if (name.startsWith("IAspect")){
				elements[name] = null;
			}
		}
		var offsetY = 160 - 24 * aspects.length;
		for (var i in aspects){
			var aspectName = aspects[i];
			var aspectIcon = {type: "image", x: 560, y: offsetY + i * 48 + 32 * .05, bitmap: AspectRegistry.getAspectIcon(aspectName), scale: 1.4, clicker: this.getClickerForAspect(aspectName)};
			if (aspectName == selected){
				aspectIcon.overlay = "aspect_selection";
			}
			elements["IAspect" + i] = aspectIcon;
		}
	},
	
	refreshAspectData: function(elements, aspect, amount){
		if (aspect){
			// set scale
			elements.aspectScale.bitmap = "aspectScale_" + aspect;
			this.container.setScale("aspectScale", amount / 8);
			// set button
			elements.aspectButton = {type: "image", bitmap: "aspect_button_bg", x: 718, y: 220, scale: 6, overlay: AspectRegistry.getAspectIcon(aspect), overlayScale: 2, overlayOffset: {x: 22, y: 22}, clicker: {
					onClick: function(position, container, tileEntity){
						if (container.getSlot("toolSlot").id != IDData.item.itemScribingTools){
							return;
						}
						var research = tileEntity.currentResearch;
						if (research){
							var position = ResearchRegistry.getResearchPosition(research);
							var aspect = ResearchRegistry.getAspectAtPosition(research, position);
							
							if (tileEntity.selectedAspect == aspect && !ResearchRegistry.isResearchPositionComplete(research, position)){
								var slot = container.getSlot("researchSlot");
								var aspects = AspectRegistry.getAspectsForItem(slot.id, slot.data);
								if (aspects[aspect]){
									ResearchRegistry.advanceResearch(research, position, aspects[aspect]);
									slot.count--;
									container.validateSlot("researchSlot");
								}
							}
						}
					}
				}
			};
			// set text
			this.container.setText("aspectText1", amount + " of");
			this.container.setText("aspectText2", aspect);
		}
		else{
			// remove scale
			this.container.setScale("aspectScale", 0);
			// remove button
			elements.aspectButton = null;
			// remove text
			this.container.setText("aspectText1", "");
			this.container.setText("aspectText2", "");
		}
	},
	
	renderResearchPosition: 0,
	drawResearchLine: function(elements, aspectNames, aspectResearches, position){
		for (var name in elements){
			if (name.startsWith("RAspect")){
				elements[name] = null;
			}
		}
		
		var add = position - this.renderResearchPosition;
		this.renderResearchPosition += Math.min(.05, Math.max(-.05, add));
		
		for (var i in aspectNames){
			var name = aspectNames[i];
			var amount = aspectResearches[name];
			var stage = Math.min(4, Math.max(parseInt(amount * 4) || 0, 1)) - 1;
			elements["RAspect_bg" + i] = {type: "image", x: 709 + (i - this.renderResearchPosition) * 168, y: 436, bitmap: "research_unit_background_" + stage, scale: 2.25, overlay: AspectRegistry.getAspectIcon(name), overlayScale: 1.5, overlayOffset: {x: 12, y: 80}};
			elements["RAspect_text" + i] = {type: "text", isStatic: true, x: 779 + (i - this.renderResearchPosition) * 168, y: 548, text: parseInt(amount * 100 || 0) + "%", font: {color: android.graphics.Color.WHITE, shadow: .6, size: 17}};
		}
	},
	
	
	getGuiScreen: function(){
		return researchTableGui;
	}
});