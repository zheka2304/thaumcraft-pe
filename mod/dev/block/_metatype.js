var BLOCK_TYPE_LOW_LIGHT = Block.createSpecialType({
	lightlevel: 11,
	lightopacity: 0
});

var BLOCK_TYPE_SOLID_ORE = Block.createSpecialType({
	renderlayer: 0,
	lightopacity: 15
});

/*
function dumpAPI (apiname, api, depth){
	if (depth < 0){
		return "";
	}
	var log = "";
	
	for (var name in api){
		var prop = api[name];
		if (typeof(prop) == "object"){
			log += dumpAPI(apiname + "." + name, prop, depth - 1) + "\n";
		}
		if (typeof(prop) == "function"){
			log += apiname + "." + name + "(...)" + "\n";
		}
	}
	
	return log;
}


Game.dialogMessage(dumpAPI("UI", UI, 3));*/