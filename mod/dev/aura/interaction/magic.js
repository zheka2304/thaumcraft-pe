MagicInteraction.registerElement("magic", {
	/* affects tile at random coords */
	affectTile: function(x, y, z){
		
		//Debug.message("MAGIC: tile interaction executed with magic. coords = " + [x, y, z]);
	},
	
	/* affects random entity */
	affectEntity: function(entity){
		//Debug.message("MAGIC: entity interaction executed with magic. entity = " + entity);
	},
	
	/* affects random entity for adding effect */
	affectEntityEffect: function(entity){
		MagicInteractionHelper.addRandomEffect(entity, [
				{effect: MobEffect.invisibility, power: .7},
				{effect: MobEffect.nightVision, power: 1},
				{effect: MobEffect.healthBoost, power: .7}
			], [
				{effect: MobEffect.poison, power: .3},
				{effect: MobEffect.harm, power: .05},
				{effect: MobEffect.blindness, power: 1}
			],
		this.localPower());
	},
	
	/* affects grass color at random coords */
	affectGrassColor: function(x, z){
		var add = parseInt(Math.random() * 32);
		if (this.localPower() > 0){
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 110, g: 180, b: 72}, this.absLocalPower() * .7);
		}
		else{
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 90 + add, g: 0, b: 128 + add}, this.absLocalPower() * .7);
		}
	},
	
	/* affects weather */
	affectWeather: function(){
		if (this.absLocalPower() * .8 > Math.random()){
			var weather = World.getWeather();
			if (this.localPower() > 0){
				weather.thunder = 0;
				weather.rain = 0;
			}
			else{
				weather.thunder = 1;
				weather.rain = (Math.random() < .3 ? 1 : 0);
				World.setNightMode(true);
			}
			World.setWeather(weather);
			//Debug.message("MAGIC: weather interaction executed with magic.");
		}
	},
	
	/* affects entity spawn at random coords */
	affectSpawn: function(x, y, z){
		//Debug.message("MAGIC: entity-spawn interaction executed with magic. coords = " + [x, y, z]);
	},
	
	/* affects aura node - only if interaction comes from node */
	affectAura: function(node){
		//Debug.message("MAGIC: aura interaction executed with magic. node key = " + (node ? node.__key : null));
	},
	
	/* creates animation at coords */
	affectAnimation: function(x, y, z, node){
		var pos = MagicInteractionHelper.correctAnimationPosition({x: x, y: y, z: z});
		(new MagicAnimation(pos.x, pos.y, pos.z)).load();
		
		if (Math.random() < .4) {
			ParticleAnimation.FadeBolt.randomBolt(pos, 2.8, 3, 	1);
		}
	}
});