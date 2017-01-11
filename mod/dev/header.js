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

if (__config__.access("debug.show_ram_usage")){
	var ctx = UI.getMcContext();
	var info = new android.app.ActivityManager.MemoryInfo();
	var activityManager = ctx.getSystemService(android.content.Context.ACTIVITY_SERVICE);
	var MEGABYTE = 1048576;
	Callback.addCallback("tick", function(){
		activityManager.getMemoryInfo(info);
		Game.tipMessage("RAM info: " + parseInt(info.availMem / MEGABYTE) + "/" + parseInt(info.totalMem / MEGABYTE));
	});
}



//UI.testUI(Recipes.getWorkbenchUI());