Callback.addCallback("NativeCommand", function(command){
	var splitted = command.split(" ");
	if (splitted.shift() == "thaum"){
		if (__config__.access("enable_cheats")){
			Callback.invokeCallback("ThaumcraftCommand", splitted.shift(), splitted);
		}
		else{
			Game.message("Thaumcraft PE cheats are disabled");
			Game.message("enable_cheats:true in mod config to enable");
		}
	}
});

Callback.addCallback("ThaumcraftCommand", function(name, params){
	switch(name){
		case "help":
			Game.message("----- thaumcraft pe help -----");
			Game.message("/thaum research <aspects|book>");
			break;
		case "research":
			if (params[0] == "aspects"){
				for (var name in AspectRegistry.aspects){
					AspectRegistry.setResearched(name);
				}
				Game.message("all aspects pages researched");
			}
			else if (params[0] == "book"){
				for (var name in ResearchRegistry.researches){
					ResearchRegistry.setResearched(name);
				}
				Game.message("all book pages researched");
			}
			else{
				Game.message("use /thaum research <aspects|book>");
			}
			break;
	}
});