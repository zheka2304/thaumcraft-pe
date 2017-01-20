var ASPECT_REACTION_ITERATIONS = 2; // TODO: ballance (15-20% of all aspects)

var AspectRegistry = {
	aspects: {},
	aspectNames: [],
	
	/* -------------------------- aspect registry ------------------------- */
	
	/* registers aspect object */
	registerAspect: function(aspect){
		if (aspect && aspect.name){
			this.aspectNames.push(aspect.name);
			this.aspects[aspect.name] = aspect;
			LiquidRegistry.registerLiquid("essence_" + aspect.name, "essence of " + aspect.name, [this.getAspectScale(aspect.name, true)]);
		}
		else{
			Logger.Log("no aspect name attached", "ERROR");
		}
	},
	
	getAspect: function(name){
		return this.aspects[name];
	},
	
	getRandomAspect: function(){
		return this.getAspect(
			this.aspectNames[parseInt(this.getAspectCount() * Math.random())]
		);
	},
	
	getAll: function(){
		return this.aspects;
	},
	
	getAllNames: function(){
		return this.aspectNames;
	},
	
	getAspectCount: function(){
		return this.aspectNames.length;
	},
	
	findForType: function(type, returnClosest){
		var closest = {
			aspect: null, 
			dis: 99999999
		};
		for (var name in this.aspects){
			var aspect = this.aspects[name];
			var dis = Math.abs(type - aspect.type);
			if (closest.dis > dis){
				closest.aspect = aspect;
				closest.dis = dis;
			}
		}
		if (returnClosest || closest.dis == 0){
			return closest.aspect;
		}
		return null;
	},
	
	combineAspects: function(aspect1, aspect2){
		if (aspect1 && aspect2){
			return this.findForType(aspect1.type + aspect2.type, false);
		}
		return null;
	},
	
	getInifiniteSource: function(aspectName){
		var aspect = this.getAspect(aspectName);
		if (aspect){
			return {
				__aspect: aspect,
				__name: aspectName,
				__storage: null,
				
				/* returns aspect name */
				name: function(){
					return this.__name;
				},
				/* returns aspect object */
				aspect: function(){
					return this.__aspect;
				},
				/* returns aspect element */
				element: function(){
					return this.aspect().element;
				},
				/* returns parent storage object */
				storage: function(){
					return this.__storage;
				},
				/* adds essence to storage */
				add: function(amount){
					return true;
				},
				/* gets some essence from storage, returns amount got */
				get: function(amount){
					return amount;
				},
				/* returns amount of essence */
				amount: function(){
					return 0;
				},
			};
		}
	},
	
	
	/* -------------------- item registry --------------------- */
	aspectsForItem: {},
	registerAspectsForItem: function(id, data, aspects){
		var key = id + ":" + data;
		if (data == -1){
			key = id + "";
		}
		this.aspectsForItem[key] = aspects;
	},
	
	getAspectsForItem: function(id, data){
		var key1 = id + ":" + data;
		var key2 = id + "";
		if (this.aspectsForItem[key1]){
			return this.aspectsForItem[key1];
		}
		if (this.aspectsForItem[key2]){
			return this.aspectsForItem[key2];
		}
		return {};
	},
	
	getAspectNamesForItem: function(id, data){
		var aspectNames = [];
		var aspects = this.getAspectNamesForItem(id, data);
		for (var name in aspects){
			aspectNames.push(name);
		}
		return aspectNames;
	},
	
	findItemByAspects: function(aspectNames, getAll){
		var matched = [];
		for (var key in this.aspectsForItem){
			var splitted = key.split(":");
			var id = parseInt(splitted[0]) || 0;
			var data = parseInt(splitted[1]) || 0;
			var aspects = this.aspectsForItem[key];
			
			var allExist = true;
			for (var i in aspectNames){
				if (!aspects[aspectNames[i]]){
					allExist = false;
					break;
				}
			}
			if (allExist){
				matched.push({id: id, data: data});
			}
		}
		
		if (getAll){
			return matched;
		}
		else{
			return matched[parseInt(Math.random() * matched.length)];
		}
	},
	
	
	
	/* ------------------------------ research registry ------------------------------- */
	aspectResearchProgress: {},
	
	getResearchProgress: function(name){
		if (!this.aspectResearchProgress[name]){
			this.aspectResearchProgress[name] = 0;
		}
		return this.aspectResearchProgress[name];
	},
	
	isResearched: function(name){
		return this.aspectResearchProgress[name] >= 1; // TODO: RETURN
	},
	
	setResearchProgress: function(name, progress){
		this.aspectResearchProgress[name] = progress;
	},
	
	setResearched: function(name){
		this.setResearchProgress(name, 1);
	},
	
	researchAspect: function(name, essenceAmount, modifier){
		var aspect = this.getAspect(name);
		if (aspect){
			this.aspectResearchProgress[name] = Math.min(this.getResearchProgress(name) + essenceAmount * (modifier || 1) * .5 / aspect.type, 1);
		}
	},
	
	getAspectName: function(name, showUnknown){
		if (this.isResearched(name) || showUnknown){
			return name;
		}
		else {
			return "unknown";
		}
	},
	
	getAspectIcon: function(name, showUnknown){
		if (this.isResearched(name) || showUnknown){
			return "aspectIcon_" + name;
		}
		else {
			return "aspectIcon_" + "unknown";
		}
	},
	
	getAspectScale: function(name, showUnknown){
		if (this.isResearched(name) || showUnknown){
			return "aspectScale_" + name;
		}
		else {
			return "aspectScale_" + "unknown";
		}
	},
	
	initBasicResearches: function(){
		AspectRegistry.setResearched("flux");
		AspectRegistry.setResearched("aer");
		AspectRegistry.setResearched("aqua");
		AspectRegistry.setResearched("terra");
		AspectRegistry.setResearched("ignis");
		AspectRegistry.setResearched("ordo");
		AspectRegistry.setResearched("perditio");
	},
	
	
	
	
	aspectReactions: {},
	
	addReaction: function(name1, name2, result){
		this.aspectReactions[name1 + ":" + name2] = result;
		this.aspectReactions[name2 + ":" + name1] = result;
	},
	
	getReactionResult: function(name1, name2){
		return this.getAspect(this.aspectReactions[name1 + ":" + name2]);
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	/* ------------------- REACTIONS CALCULATION <TODO: REMOVE> --------------------- */
	
	/* returns random aspect as result of reaction for given type & stability */
	findForReaction: function(type, stability, powerModifier){
		/* is power modifier defined */
		var powerCap = 1;
		if (typeof(powerModifier) == "number"){
			powerCap = powerModifier;
		}
		/* init */
		var threshold = -1.0 + stability * 1.5;
		var range = 10.0 / (stability + .01) + 1.0;
		
		var closest = {
			aspect: null,
			distance: 9999999999
		};
		for (var i = 0; i < ASPECT_REACTION_ITERATIONS; i++){
			var name = this.aspectNames[parseInt(this.aspectNames.length * Math.random())];
			var aspect = this.aspects[name];
			var distance = Math.abs(aspect.type - type);
			if (distance < closest.distance && distance < range && aspect.power > threshold && aspect.power < powerCap){
				closest.aspect = aspect;
				closest.distance = distance;
			}
		}
		return closest.aspect;
	},
	
};


Saver.addSavesScope("ThaumcraftAspects",
	function read(scope){
		AspectRegistry.aspectResearchProgress = scope;
		AspectRegistry.initBasicResearches();
	},
	
	function save(){
		return AspectRegistry.aspectResearchProgress;
	}
);

