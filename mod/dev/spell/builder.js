var SpellBuilder = {
	buildSpell: function(sourceGroup){
		var spellID = 1;
		for (var i in sourceGroup){
			var source = sourceGroup[i];
			if (source.aspect().spellID){
				spellID *= source.aspect().type;
			}
		}
		
		var properties = [];
		while(true){
			var property = SpellPropertyRegistry.nextProperty(spellID);
			if (!property){
				break;
			}
			Debug.warning("added property: " + property.name + ", d=" + property.devider);
			for (var type in property.actions){
				properties.push({type: type, func: property.actions[type]});
			}
			spellID /= property.devider;
		}
		
		var spell = new Spell(sourceGroup);
		spell.setScheme("move", this.buildScheme("move"));
		spell.setScheme("animate", this.buildScheme("animate"));
		spell.setScheme("interact", this.buildScheme("interact"));
		return spell;
	},
	
	buildScheme: function(schemeName, spellID){
		var scheme = new SpellScheme(schemeName);
		while(true){
			var action = SpellActionRegistry.nextAction(schemeName, spellID);
			if (!action){
				break;
			}
			scheme.addAction(action.func);
			spellID /= action.devider;
			if (action.devider <= 1){
				break;
			}
		}
		return scheme;
	}
}


var SpellUpdatableRegistry = {
	spellID: 1,
	registredSpells: [],
	
	isSpellRegistred: function(spell){
		return spell.__registryID > 0;
	},
	
	registerSpell: function(spell){
		if (!this.isSpellRegistred(spell)){
			spell.__registryID = this.spellID++;
			this.registredSpells[spell.__registryID] = spell;
		}
	},
	
	unregisterSpell: function(spell){
		delete this.registredSpells[spell.__registryID];
		delete spell.__registryID;
	},
	
	getAll: function(){
		return this.registredSpells;
	}
}