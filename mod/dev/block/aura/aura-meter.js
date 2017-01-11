IDRegistry.genBlockID("blockAuraMeter");

Block.createBlock("blockAuraMeter", [
	{name: "aura'o'meter", texture: [["aura_meter", 2], ["aura_meter", 0], ["aura_meter", 1], ["aura_meter", 1], ["aura_meter", 1], ["aura_meter", 1]], inCreative: true}
]);

var auraMeterGui = new UI.StandartWindow();
auraMeterGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aura-meter"
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
		{type: "bitmap", bitmap: "paper_background", x: 336, y: 36, scale: 3.333},
		{type: "bitmap", bitmap: "aura_meter_overlay", x: 336, y: 36, scale: 3.3333},
		{type: "bitmap", x: 842, y: 73, bitmap: "aspect_scale_background", scale: 4},
	],
	elements: {
		"aspectScale": {type: "scale", x: 850, y: 89, direction: 1, scale: 8, value: 0.7, bitmap: "aspectScale_nitor", overlay: "aspect_scale_overlay_1", overlayScale: 4}
	}
});


TileEntity.registerPrototype(IDData.block.blockAuraMeter, {
	node: null,
	
	tick: function(){
		if (!this.node){
			this.node = Aura.getNearestAuraNode(this);
		}
		var content = this.container.getGuiContent();
		if (content){
			if (this.node){
				var aspectStorage = this.node.aspectStorage;
				this.refreshAspectIcons(content.elements, aspectStorage.aspectAmounts);
				this.refreshScale(content.elements, this.selectedAspect, aspectStorage.aspectAmounts[this.selectedAspect]);
			}
			else{
				this.refreshAspectIcons(content.elements, {});
				this.refreshScale(content.elements, null);
			}
		}
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
		
		this.showCircleOfAspects(elements, majors, {x: 550, y: 250, radius: 180, scale: 2}, "IAspectA");
		this.showCircleOfAspects(elements, minors, {x: 550, y: 250, radius: 90, scale: 1.5}, "IAspectB");
	},
	
	refreshScale: function(elements, aspectName, aspectAmount){
		if (aspectName && aspectAmount){
			elements.aspectScale.bitmap = AspectRegistry.getAspectScale(aspectName);
			this.container.setScale("aspectScale", aspectAmount / 50);
		}
		else{
			this.container.setScale("aspectScale", 0);
		}
	},
	
	createIconClicker: function(aspectName){
		return {
			onClick: function(position, container, tileEntity){
				tileEntity.selectedAspect = aspectName;
			}
		};
	},
	
	showCircleOfAspects: function(elements, array, coords, prefix){
		var size = Math.min(coords.scale * 32, coords.radius * Math.PI * 2 / (array.length * 1.3));
		for (var i in array){
			var angle = i / array.length * Math.PI * 2;
			var x = parseInt(coords.x + Math.sin(angle) * coords.radius);
			var y = parseInt(coords.y + Math.cos(angle) * coords.radius);
			var element = {type: "image", x: x - size / 2, y: y - size / 2, bitmap: AspectRegistry.getAspectIcon(array[i]), scale: size / 32, clicker: this.createIconClicker(array[i])};
			if (this.selectedAspect == array[i]){
				element.overlay = "aspect_selection";
			}
			elements[prefix + "" + i] = element;
		}
	},
	
	getGuiScreen: function(){
		return auraMeterGui;
	}
});


