IDRegistry.genItemID("itemResearchBook");
Item.createItem("itemResearchBook", "thaumonomicon", {name: "thaumonomicon"});

Item.registerUseFunctionForID(IDData.item.itemResearchBook, function(coords, item, block){
	ResearchBookUIBuilder.openMainScreen();
});