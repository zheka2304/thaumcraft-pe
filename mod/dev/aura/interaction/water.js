MagicInteraction.registerElement("water", {
	/* affects tile at random coords */
	affectTile: function(x, y, z){
		
	},
	
	/* affects random entity */
	affectEntity: function(entity){
		
	},
	
	/* affects random entity for adding effect */
	affectEntityEffect: function(entity){
		MagicInteractionHelper.addRandomEffect(entity, [
				{effect: MobEffect.digSpeed, power: .9},
				{effect: MobEffect.waterBreathing, power: 1},
				{effect: MobEffect.movementSpeed, power: .6}
			], [
				{effect: MobEffect.digSlowdown, power: 1},
				{effect: MobEffect.weakness, power: 1},
				{effect: MobEffect.wither, power: .4}
			],
		this.localPower());
	},
	
	/* affects grass color at random coords */
	affectGrassColor: function(x, z){
		var add = parseInt(Math.random() * 32);
		if (this.localPower() > 0){
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 110, g: 200, b: 160}, this.absLocalPower() * .7);
		}
		else{
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 84, g: 0, b: 128 + add}, this.absLocalPower() * .7);
		}
	},
	
	/* affects weather */
	affectWeather: function(){
		if (this.absLocalPower() * .8 > Math.random()){
			var weather = World.getWeather();
			if (this.localPower() < 0){
				World.setNightMode(true);
				weather.rain = 1;
			}
			else {
				World.setDayMode(true);
				weather.rain = 0;
			}
			World.setWeather(weather);
		}
	},
	
	/* affects entity spawn at random coords */
	affectSpawn: function(x, y, z){
		//Debug.message("MAGIC: entity-spawn interaction executed with magic. coords = " + [x, y, z]);
	},
	
	/* affects aura node - only if interaction comes from node */
	affectAura: function(node){
		if (node){
			if (this.localPower() < 0){
				node.aspectStorage.addEssenceByName("flux", Math.random() * 3 * this.localPower());
			}
			if (this.localPower() < 0){
				node.aspectStorage.addEssenceByName("aqua", Math.random() * 3 * this.localPower());
			}
		}
	},
	
	/* creates animation at coords */
	affectAnimation: function(x, y, z, node){
		
	}
});