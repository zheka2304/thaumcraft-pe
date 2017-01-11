
var CrucibleHandler = {
	HEATING_TILES: {
		10: 1,
		11: 1,
		50: .7,
		51: .5
	},
	
	registerHeatTile: function(id, power){
		this.HEATING_TILES[id] = power;
	},
	
	getHeatingPower: function(id){
		return this.HEATING_TILES[id] || 0;
	},
	
	RECIPES: {},
	registerRecipe: function(activator, result, aspects, research){
		var key = activator.id + ":" + activator.data;
		if (activator.data == -1){
			key = activator.id;
		}
		
		this.RECIPES[key] = {
			activator: activator,
			result: result,
			aspects: aspects,
			research: research
		};
	},
	
	
	getRecipeByActivator: function(id, data){
		return this.RECIPES[id + ":" + data] || this.RECIPES[id];
	},
	
	provideRecipe: function(id, count, data, aspectSource){
		var recipe = this.getRecipeByActivator(id, data);
		if (!recipe){
			return;
		}
		if (recipe.research && !ResearchRegistry.isResearched(recipe.research)){
			return;
		}
		
		var amount = 0;
		while (true){
			if (amount >= count){
				break;
			}
			
			var hasAll = true;
			for (var name in recipe.aspects){
				if (!aspectSource[name] || recipe.aspects[name] > aspectSource[name]){
					hasAll = false;
					break;
				}
			}
			
			if (hasAll){
				for (var name in recipe.aspects){
					aspectSource[name] -= recipe.aspects[name];
				}
				amount++;
			}
			else{
				break;
			}
		}
		
		if (amount > 0){
			return {id: recipe.result.id, count: amount * recipe.result.count, data: recipe.result.data, activatorLeft: count - amount};
		}
		else{
			return null;
		}
	}
}
