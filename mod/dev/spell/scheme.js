function SpellScheme(name){
	this.name = name;
	this.actions = [];
	
	this.addAction = function(func){
		this.actions.push(func);
	}
	
	this.addActions = function(arr){
		for (var i in arr){
			this.addAction(arr[i]);
		}
	}
	
	this.execForSpell = function(spell, params){
		var instance = new SpellSchemeInstance(spell, this, params);
		UpdatableAPI.addUpdatable(instance);
	}
}

function SpellSchemeInstance(spell, scheme, params){
	this.spell = spell;
	this.scheme = scheme;
	this.params = params;
	
	this.getParam = function(name){
		if (this.params){
			return this.params[name];
		}
		return null;
	}
	
	this.delay = 1;
	this.currentDelay = 0;
	this.position = 0;
	
	this.setDelay = function(delay){
		this.delay = delay - 1;
	}
	
	this.update = function(){
		if (this.currentDelay-- <= 0){
			this.spell.__shemeAction = this.scheme.actions[this.position++];
			if (this.spell.__shemeAction){
				this.currentDelay = delay;
				this.spell.__shemeAction(this);
			}
			else{
				this.remove = true;
			}
		}
	}
	
	/* modifiers */
	this.modifiers = [];
	
	this.clearModifiers = function(){
		this.modifiers = [];
	}
	
	this.addModifier = function(value){
		this.modifiers.push(value);
	}
	
	this.getModifier = function(index, max){
		var value = this.modifiers[index] || 0;
		if (max){
			return value % max;
		}
		return value;
	}
	
	this.setModifier = function(index, value){
		this.modifiers[index] = value;
	}
	
	this.mergeModifier = function(index, value){
		this.setModifier(index, this.getModifier(index) + value);
	}
}