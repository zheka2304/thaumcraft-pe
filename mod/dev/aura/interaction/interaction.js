/*
 * power amount: 0-10 - extra rare spawn & effect interactions
 * power amount: 10-30 - rare spawn & effects, adding tile & grass interaction, weather affect
 * power amount: 30-60 - massive effects, spawns, tile interactions, grass color changing
 * power amount: 60+ - fast grass changing, endless weather interactions, affecting aura
 *
*/

var BasicWorldInteractor = {
	__power: 0,
	
	setPower: function(aspectPower, aspectAmount){
		this.__power = this.convertPowerValue(aspectPower * aspectAmount);
	},
	
	power: function(){
		return this.__power;
	},
	
	absPower: function(){
		return Math.abs(this.power());
	},
	
	__localPower: 0,
	setLocalPower: function(power){
		this.__localPower = power;
	},
	
	localPower: function(){
		return this.__localPower;
	},
	
	absLocalPower: function(){
		return Math.abs(this.localPower())
	},
	
	/* ---------------- pattern ------------------- */
	
	chance: {
		effect: {min: 0, max: 60, chance: 0.75},
		spawn: {min: 5, max: 60, chance: 0.2},
		tile: {min: 20, max: 80, chance: 0.75},
		entity: {min: 10, max: 50, chance: 0.5},
		grass: {min: 20, max: 100, chance: 0.9},
		weather: {min: 10, max: 100, chance: 0.3},
		node: {min: 10, max: 100, chance: 0.1},
		animation: {min: 0, max: 80, chance: 0.9}
	},
	
	actionFuncs: {
		effect: {name: "affectEntityEffect", args: ["entity"]},
		spawn: {name: "affectSpawn", args: ["x", "y", "z"]},
		tile: {name: "affectTile", args: ["x", "y", "z"]},
		entity: {name: "affectEntity", args: ["entity"]},
		grass: {name: "affectGrassColor", args: ["x", "z"]},
		weather: {name: "affectWeather", args: []},
		node: {name: "affectWeather", args: ["node"]},
		animation: {name: "affectAnimation", args: ["x", "y", "z", "node"]}
	},
	
	/* ----------------- HOOKS -------------------- */
	convertPowerValue: function(value){
		return value * 1.5;
	},
	
	/* affects tile at random coords */
	affectTile: function(x, y, z){
		//Debug.message("tile interaction executed with no element. coords = " + [x, y, z]);
	},
	
	/* affects random entity */
	affectEntity: function(entity){
		//Debug.message("entity interaction executed with no element. entity = " + entity);
	},
	
	/* affects random entity for adding effect */
	affectEntityEffect: function(entity){
		//Debug.message("entity-effect interaction executed with no element. entity = " + entity);
	},
	
	/* affects grass color at random coords */
	affectGrassColor: function(x, z){
		//Debug.message("grass color interaction executed with no element. coords = " + [x, z]);
	},
	
	/* affects weather */
	affectWeather: function(){
		//Debug.message("weather interaction called with no element.");
	},
	
	/* affects entity spawn at random coords */
	affectSpawn: function(x, y, z){
		//Debug.message("entity-spawn interaction executed with no element. coords = " + [x, y, z]);
	},
	
	/* affects aura node - only if interaction comes from node */
	affectAura: function(node){
		//Debug.message("aura interaction executed with no element. node key = " + (node ? node.__key : null));
	},
	
	/* creates animation at coords */
	affectAnimation: function(x, y, z, node){
		//Debug.message("animation executed with no element. node key = " + (node ? node.__key : null) + ", coords = " + [x, y, z]);
	}
	
}

var MagicInteraction = {
	elementInteractors: {},
	
	registerElement: function(name, interactor){
		for (var property in BasicWorldInteractor){
			if (!interactor[property]){
				interactor[property] = BasicWorldInteractor[property];
			}
		}
		this.elementInteractors[name] = interactor;
	},
	
	requireElement: function(name){
		return this.elementInteractors[name] || this.elementInteractors.none;
	},
	
	/* returns object to execute for given element name and aspect source 
	 * here is all basic logic of aura->world interaction
	*/
	getAffectedInteraction: function(elementName, aspectSource){
		var interactor = this.requireElement(elementName);
		var aspectPower = aspectSource.aspect().power;
		interactor.setPower(aspectPower, aspectSource.amount());
		
		var fullPower = interactor.absPower();
		var actions = [];
		
		for (var name in interactor.chance){
			var chance = interactor.chance[name];
			var interactionMultiplier = Math.min(1, Math.max((fullPower - chance.min) / (chance.max - chance.min), 0));
			var realChance = chance.chance * interactionMultiplier;
			
			if (realChance > Math.pow(Math.random(), 1.5)){
				actions.push({
					name: name,
					localPower: interactionMultiplier * aspectPower
				})
			}
		}
		var action = actions[parseInt(actions.length * Math.random())];
		
		if (action){
			//Debug.message("aspect: " + aspectSource.name() + ", action: " + action.name);
			interactor.setLocalPower(action.localPower);
			return {
				obj: interactor,
				func: interactor.actionFuncs[action.name]
			}
		}
		
		return null;
	},
	
	/*
	 * executes interaction for 
	*/
	executeInteraction: function(coords, interactor, aspectSource, node){
		var coords = MagicInteractionHelper.findNearbyCoords(coords);
		var args = {
			entity: MagicInteractionHelper.findNearbyEntity(coords, 32),
			x: coords.x,
			y: coords.y,
			z: coords.z,
			node: node
		};
		
		var params = [];
		
		if (interactor){
			for (var i = 0; i < 5; i++){
				params[i] = args[interactor.func.args[i]];
			}
			interactor.obj[interactor.func.name](params[0], params[1], params[2], params[3], params[4]);
		}
	},
	
	
	executeNodeInteraction: function(node, aspectSource){
		if (node){
			var interactor = this.getAffectedInteraction(aspectSource.element(), aspectSource);
			if (interactor){
				this.executeInteraction(node.coords, interactor, aspectSource, node);
			}
			else{
				//Debug.message("no action found")
			}
		}
	},
	
	executeRandomNodeInteraction: function(node){
		if (node){
			var aspect = {
				source: null, 
				amount: 0
			};
			for (var i = 0; i < 4; i++){
				var source = node.aspectStorage.getSource(node.aspectStorage.getRandomName());
				if (source && source.amount() > aspect.amount && Math.random() > aspect.amount / source.amount()){
					aspect.source = source;
					aspect.amount = source.amount();
				}
			}
			if (aspect.amount > 0){
				this.executeNodeInteraction(node, aspect.source);
			}
		}
	}
}


MagicInteraction.registerElement("none", BasicWorldInteractor);