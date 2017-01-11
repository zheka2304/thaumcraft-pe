IDRegistry.genBlockID("blockArcaneWorkbench");

Block.createBlock("blockArcaneWorkbench", [
	{name: "archane workbench", texture: [["research_table", 2], ["magic_craft", 0], ["magic_craft", 1], ["magic_craft", 1], ["magic_craft", 1], ["magic_craft", 1]], inCreative: true}
]);

var arcaneWorkbenchGui = new UI.StandartWindow();
arcaneWorkbenchGui.setContent({
	standart: {
		header: {
			text: {
				text: "Arcane workbench"
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
			slot: "arcane_workbench_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", x: 365, y: 42, bitmap: "arcane_workbench_background", scale: 2.55}    
	],
	elements: {
		"slot0": {type: "slot", x: 467, y: 146, size: 60},
		"slot1": {type: "slot", x: 537, y: 146, size: 60},
		"slot2": {type: "slot", x: 607, y: 146, size: 60},
		"slot3": {type: "slot", x: 467, y: 214, size: 60},
		"slot4": {type: "slot", x: 537, y: 214, size: 60},
		"slot5": {type: "slot", x: 607, y: 214, size: 60},
		"slot6": {type: "slot", x: 467, y: 283, size: 60},
		"slot7": {type: "slot", x: 537, y: 283, size: 60},
		"slot8": {type: "slot", x: 607, y: 283, size: 60},
		"resultSlot": {type: "slot", x: 698, y: 212, size: 60, clicker: {
				onClick: function(position, container, tileEntity){
					var result = Recipes.provideRecipe(container, tileEntity.getCraftPrefix());
					if (result){
						Player.getInventory().addItem(result.id, result.count, result.data);
					}
				},
				onLongClick: function(position, container, tileEntity){
					this.onClick(position, container, tileEntity);
				}
			}
		},
	}
});

//UI.testUI(arcaneWorkbenchGui);


var ArcaneWorkbenchHelper = {
	BASIC_PREFIX: "thArcane",
	affectedResearches: {},
	
	addRecipe: function(result, mask, items, researchName, func){
		if (researchName){
			this.affectedResearches[researchName] = true;
		}
		Recipes.addShaped(result, mask, items, func, this.BASIC_PREFIX + (researchName || ""));
	},
	
	getCraftPrefix: function(){
		var researchNames = [];
		for (var name in this.affectedResearches){
			if (ResearchRegistry.isResearched(name)){
				researchNames.push(name);
			}
		}
		return this.BASIC_PREFIX + researchNames.join("," + this.BASIC_PREFIX);
	}
}




TileEntity.registerPrototype(IDData.block.blockArcaneWorkbench, {
	tick: function(){
		if (this.container.isOpened()){
			var res = Recipes.getRecipeResult(this.container, this.getCraftPrefix());
			if (res){
				this.container.setSlot("resultSlot", res.id, res.count, res.data);
			}
			else{
				this.container.setSlot("resultSlot", 0, 0, 0);
			}
		}
		else{
			this.craftPrefix = null;
		}
	},
	
	getGuiScreen: function(){
		return arcaneWorkbenchGui;
	},
	
	getCraftPrefix: function(){
		if (!this.craftPrefix){
			this.craftPrefix = ArcaneWorkbenchHelper.getCraftPrefix();
		}
		return this.craftPrefix;
	}
});