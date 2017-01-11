var ThaumAddonAPI = {
	registerAddon: function(name, author){
		Logger.Log("thaumcraft pe addon registred and loaded: " + name + (author ? " by " + author : "") + "\naddon core: thaumcraft addon API & Core Engine API\nCore Engine API level: " + getCoreAPILevel(), "THAUMCRAFT");
	},
	
	requireThaumcraftGlobal: function(name){
		return eval(name);
	},
	
	Aspect: {
		Registry: AspectRegistry,
		Storage: AspectStorage
	},
	
	Aura: {
		Core: Aura,
		Interaction: MagicInteraction
	},
	
	Research: {
		Registry: ResearchRegistry
	},
	
	Recipe: {
		Workbench: ArcaneWorkbenchHelper,
		Crucible: CrucibleHandler
	}
}

ModAPI.registerAPI("ThaumAPICore", ThaumAPI);
ModAPI.registerAPI("ThaumAPI", ThaumAddonAPI);

ModAPI.addAPICallback("ThaumAPI", function(){
	Logger.Log("Thaumсraft API is registred and can be accessed by ModAPI.requireAPI(\"ThaumAPI\")", "THAUMCRAFT");
});