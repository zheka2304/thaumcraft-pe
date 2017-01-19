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

__config__.checkAndRestore({
	graphics: {
		advanced_shaders: false
	}
})

if (getCoreAPILevel() >= 6){
	var resources = Resources.getResourceList();
	resources["shaders_ultra.zip"] = __config__.access("graphics.advanced_shaders");
	Resources.setResourceList(resources);
}
