var researchBookGui = new UI.StandartWindow();
researchBookGui.setContent({
	standart: {
		header: {
			text: {
				text: "Thaumonomicon"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		background: {
			bitmap: "research_book_background"
		},
		minHeight: 2000
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
	}
});

var researchBookPageGui =  new UI.StandartWindow();
researchBookPageGui.setContent({
	standart: {
		header: {
			text: {
				text: "Research page"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		background: {
			bitmap: "research_page_background"
		},
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
	}
});
