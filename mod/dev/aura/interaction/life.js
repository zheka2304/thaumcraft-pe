MagicInteraction.registerElement("life", {
	/* affects tile at random coords */
	affectTile: function(x, y, z){
		
	},
	
	/* affects random entity */
	affectEntity: function(entity){
		if (this.localPower() < 0){
			var power = this.absLocalPower() * 1.2;
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
				{effect: MobEffect.fireResistance, power: 0.4},
				{effect: MobEffect.heal, power: 1},
				{effect: MobEffect.regeneration, power: 1},
				{effect: MobEffect.damageResistance, power: 1}
			], [
				{effect: MobEffect.harm, power: .03},
				{effect: MobEffect.poison, power: .8},
				{effect: MobEffect.hunger, power: 1},
				{effect: MobEffect.weakness, power: .8}
			],
		this.localPower());
	},
	
	/* affects grass color at random coords */
	affectGrassColor: function(x, z){
		var add = parseInt(Math.random() * 32);
		if (this.localPower() > 0){
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 160, g: 240, b: 128}, this.absLocalPower() * .7);
		}
		else{
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 128 + add, g: 0, b: 128}, this.absLocalPower() * .7);
		}
	},
	
	/* affects weather */
	affectWeather: function(){
		if (this.absLocalPower() * .8 > Math.random()){
			var weather = World.getWeather();
			if (this.localPower() < 0){
				World.setNightMode(true);
				weather.thunder = 1;
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
				node.aspectStorage.addEssenceByName("flux", Math.random() * 2 * this.localPower());
			}
			if (this.localPower() < 0){
				node.aspectStorage.addEssenceByName("nitor", Math.random() * 3 * this.localPower());
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