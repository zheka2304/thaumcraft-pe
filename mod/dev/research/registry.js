var RESEARCH_PROGRESS_MULTIPLIER = .5;

var ResearchRegistry = {
	researches: {},
	uniqueID: 1,
	
	registerResearch: function(name, research){
		research.progress = {};
		research.name = name;
		research.uniqueID = this.uniqueID++;
		if (!research.aspectNames){
			research.aspectNames = [];
		}
		if (!research.aspectAmounts){
			research.aspectAmounts = {};
		}
		if (!research.coords){
			research.coords = {x: 0, y: 0};
		}
		if (!research.icon){
			research.icon = "aspectIcon_unknown";
		}
		this.researches[name] = research;
	},
	
	getResearch: function(name){
		return this.researches[name];
	},
	
	getResearchParent: function(research){
		if (research.parent){
			return this.getResearch(research.parent);
		}
	},
	
	isResearched: function(name){
		var research = this.getResearch(name);
		if (research){
			if (research.isBasic){
				return true;
			}
			for (var i in research.aspectNames){
				if (!research.progress[research.aspectNames[i]] || research.progress[research.aspectNames[i]] < 1){
					return false;
				}
			}
			return true;
		}
		return false;
	},
	
	isVisible: function(name){
		var research = this.getResearch(name);
		if (research){
			if (research.parent){
				return this.isResearched(research.parent);
			}
			else{
				return true;
			}
		}
	},
	
	getAll: function(){
		return this.researches;
	},
	
	getAllVisible: function(){
		var visible = [];
		for (var name in this.researches){
			if (this.isVisible(name)){
				visible.push(this.researches[name]);
			}
		}
		return visible;
	},
	
	getResearchPosition: function(research){
		for (var i in research.aspectNames){
			var amount = research.progress[research.aspectNames[i]];
			if (!amount || amount < 1){
				return i;
			}
		}
		return research.aspectNames.length - 1;
	},
	
	
	
	getAspectAtPosition: function(research, position){
		return research.aspectNames[position];
	},
	
	advanceResearch: function(research, position, amount){
		var aspectName = this.getAspectAtPosition(research, position);
		research.progress[aspectName] = Math.min(1, (research.progress[aspectName] || 0) + amount / research.aspectAmounts[aspectName] * RESEARCH_PROGRESS_MULTIPLIER);
	},
	
	isResearchPositionComplete: function(research, position){
		return research.progress[research.aspectNames[position]] >= 1;
	},
	
	
	
	
	
	giveResearchPageToPlayer: function(research){
		if (research.uniqueID){
			Player.getInventory().addItem(IDData.item.itemResearchBookPage, 1, research.uniqueID);
		}
	},
	
	getResearchByID: function(id){
		for (var name in this.researches){
			if (this.researches[name].uniqueID == id){
				return this.researches[name];
			}
		}
		return null;
	}
}

Saver.addSavesScope("ThaumcraftResearches",
	function read(scope){
		for (var name in scope){
			var research = ResearchRegistry.getResearch(name);
			if (research){
				research.progress = scope[name];
			}
		}
	},
	
	function save(){
		var scope = {};
		for (var name in ResearchRegistry.researches){
			scope[name] = ResearchRegistry.getResearch(name).progress;
		}
		return scope;
	}
);








