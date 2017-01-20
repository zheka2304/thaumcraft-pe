/*
  _____   _                                                          __   _       ____    _____ 
 |_   _| | |__     __ _   _   _   _ __ ___     ___   _ __    __ _   / _| | |_    |  _ \  | ____|
   | |   | '_ \   / _` | | | | | | '_ ` _ \   / __| | '__|  / _` | | |_  | __|   | |_) | |  _|  
   | |   | | | | | (_| | | |_| | | | | | | | | (__  | |    | (_| | |  _| | |_    |  __/  | |___ 
   |_|   |_| |_|  \__,_|  \__,_| |_| |_| |_|  \___| |_|     \__,_| |_|    \__|   |_|     |_____|
   
   by zheka_smirnov
*/


var ParticleType = ModAPI.requireGlobal("ParticleType");
var MobEffect = ModAPI.requireGlobal("MobEffect");

var LOGGER_TAG = "THAUMCRAFT";

__config__.checkAndRestore({
	aura: {
		super_fast_evolution: false
	},
	graphics: {
		advanced_shaders: false,
		particle_detalization_level: 1,
		render_distance: {
			minor: 32,
			major: 64
		}
	},
	enable_cheats: false
})

if (getCoreAPILevel() >= 6){
	var resources = Resources.getResourceList();
	resources["shaders_ultra.zip"] = __config__.access("graphics.advanced_shaders");
	Resources.setResourceList(resources);
}
else {
	Logger.Log("Old Core Engine version detected (1.13 required), cannot apply some config settings.", LOGGER_TAG);
}