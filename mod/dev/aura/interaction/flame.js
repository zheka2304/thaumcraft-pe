MagicInteraction.registerElement("flame", {
	convertPowerValue: function(value){
		return value * 1.75;
	},
	/* affects tile at random coords */
	affectTile: function(x, y, z){
		if (this.localPower() < 0){
			y = GenerationUtils.findSurface(x, y, z).y + 1;
			
			if (this.absLocalPower() > .6){
				World.explode(x, y, z, 3.5 * this.absLocalPower())
				//Debug.message("EXPLOSION AFFECTED TILE: " + parseInt(Entity.getDistanceBetweenCoords({x: x, y: y, z: z}, Player.getPosition())));
			}
			if (this.absLocalPower() < .6 || Math.random() < .4){
				for (var i = 0; i < 6 + Math.random() * 12; i++){
					var flame = GenerationUtils.findSurface(x + Math.random() * 10 - 5, y, z + Math.random() * 10 - 5);
					flame.y++;
					if (GenerationUtils.isTransparentBlock(World.getBlockID(flame.x, flame.y, flame.z))){
						World.setBlock(flame.x, flame.y, flame.z, 51); // set on fire
					}
				}
				//Debug.message("FLAME AFFECTED TILE: " + parseInt(Entity.getDistanceBetweenCoords({x: x, y: y, z: z}, Player.getPosition())));
			}
		}
	},
	
	/* affects random entity */
	affectEntity: function(entity){
		if (this.localPower() < 0){
			Entity.setFire(entity, this.localPower() * 10);
		}
	},
	
	/* affects random entity for adding effect */
	affectEntityEffect: function(entity){
		MagicInteractionHelper.addRandomEffect(entity, [
				{effect: MobEffect.fireResistance, power: 1.6},
				{effect: MobEffect.heal, power: .25},
				{effect: MobEffect.regeneration, power: .2}
			], [
				{effect: MobEffect.harm, power: .02},
				{effect: MobEffect.weakness, power: .4}
			],
		this.localPower());
	},
	
	/* affects grass color at random coords */
	affectGrassColor: function(x, z){
		var add = parseInt(Math.random() * 32);
		if (this.localPower() > 0){
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 180, g: 200, b: 120}, this.absLocalPower() * .7);
		}
		else{
			MagicInteractionHelper.colorGrassArea({x: x, z: z}, 8, {r: 128 + add, g: 0, b: 84}, this.absLocalPower() * .7);
		}
	},
	
	/* affects weather */
	affectWeather: function(){
		if (this.absLocalPower() * 8 > Math.random()){
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
		(new FlameAnimation(pos.x, pos.y, pos.z)).load();
		
		if (Math.random() < .2) {
			ParticleAnimation.FadeBolt.randomBolt(pos, 2, 3, 1);
		}
	}
});