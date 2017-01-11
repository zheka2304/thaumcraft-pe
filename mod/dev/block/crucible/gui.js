
var crucibleGui = new UI.StandartWindow();
crucibleGui.setContent({
	standart: {
		header: {
			text: {
				text: "Crucible"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
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
		{type: "bitmap", bitmap: "crucible_background", x: 242, y: 36, scale: 4},
	],
	elements: {
		
	}
});
