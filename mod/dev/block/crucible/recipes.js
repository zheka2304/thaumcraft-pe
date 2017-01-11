Callback.addCallback("PostLoaded", function(){
	CrucibleHandler.registerRecipe({id: 263, data: -1}, {id: IDData.item.itemNitor, count: 1, data: 0}, {lux: 4, nitor: 2, ordo: 2}, "nitor");
	CrucibleHandler.registerRecipe({id: 289, data: 1}, {id: IDData.item.itemAlumentum, count: 1, data: 0}, {potentia: 3, ignis: 1, perditio: 2}, "alumentum"); 
	CrucibleHandler.registerRecipe({id: 265, data: 1}, {id: IDData.item.itemThaumIngot, count: 1, data: 0}, {praecantatio: 3, ordo: 3}, "thaum metal"); 
	CrucibleHandler.registerRecipe({id: 331, data: 0}, {id: IDData.item.positivePowerCrystal, count: 1, data: 0}, {ordo: 10, auram: 20}, "positive crystal");
	CrucibleHandler.registerRecipe({id: 331, data: 0}, {id: IDData.item.negativePowerCrystal, count: 1, data: 0}, {ordo: 5, flux: 10}, "negative crystal");
})