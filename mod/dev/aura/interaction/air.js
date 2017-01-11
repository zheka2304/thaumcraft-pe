MagicInteraction.registerElement("air", {
	/* affects tile at random coords */
	affectTile: function(x, y, z){
		
	},
	
	/* affects random entity */
	affectEntity: function(entity){
		if (this.localPower() < 0){
			var power = this.absLocalPower() * 1.6;
			var velocity = {
				x: (Math.random() - .5) * power,
				y: (Math.random() - .5) * power * .3,
				z: (Math.random() - .5) * power,
			}
			Player.addVelocity(velocity.x, velocity.y, velocity.z);
		}
	},
	
	/* affects random entity for adding effect */
	affectEntityEffect: function(entity){
		MagicInteractionHelper.addRandomEffect(entity, [
				{effect: MobEffect.movementSpeed, power: 1},
				{effect: MobEffect.digSpeed, power: 1},
				{effect: MobEffect.jump, power: .9},
				{effect: MobEffect.waterBreathing, power: 1}
			], [
				{effect: MobEffect.movementSlowdown, power: 1.1},
				{effect: MobEffect.digSlowdown, power: 1.1},
				{effect: MobEffect.wither, power: .35},
				{effect: MobEffect.weakness, power: .9}
			],
		this.localPower());
	},
	
	/* affects grass color at random coords */
	affectGrassColor: function(x, z){
		var add = parseInt(Math.random() * 32);
		if (this.localPower() > 0){
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 176, g: 240, b: 160}, this.absLocalPower() * .7);
		}
		else{
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 128 + add, g: 0, b: 128}, this.absLocalPower() * .7);
		}
	},
	
	/* affects weather */
	affectWeather: function(){
		if (this.absLocalPower() * .7 > Math.random()){
			var weather = World.getWeather();
			if (this.localPower() < 0){
				weather.rain = 1;
			}
			else {
				weather.thunder = 0;
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
				node.aspectStorage.addEssenceByName("flux", Math.random() * 1 * this.localPower());
			}
			if (this.localPower() < 0){
				node.aspectStorage.addEssenceByName("aer", Math.random() * 3 * this.localPower());
			}
		}
	},
	
	/* creates animation at coords */
	affectAnimation: function(x, y, z, node){
		var pos = MagicInteractionHelper.correctAnimationPosition({x: x, y: y, z: z});
		
		if (Math.random() < .4) {
			ParticleAnimation.FadeBolt.randomBolt(pos, 2, 2, 1);
		}
	}
});