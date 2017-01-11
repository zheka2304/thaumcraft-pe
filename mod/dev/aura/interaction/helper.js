var MagicInteractionHelper = {
	colorGrassTile: function(coords, color, opacity){
		var grassColor = World.getGrassColorRGB(coords.x, coords.z);
		grassColor = {
			r: grassColor.r * (1.0 - opacity) + color.r * opacity,
			g: grassColor.g * (1.0 - opacity) + color.g * opacity,
			b: grassColor.b * (1.0 - opacity) + color.b * opacity,
		}
		World.setGrassColorRGB(coords.x, coords.z, grassColor);
	},
	
	colorGrassArea: function(coords, radius, color, opacity){
		for (var x = -radius; x <= radius; x++){
			for (var z = -radius; z <= radius; z++){
				var unitOpacity = 1 - Math.sqrt(x * x + z * z) / radius;
				if (unitOpacity >= 0){
					this.colorGrassTile({x: coords.x + x, z: coords.z + z}, color, unitOpacity * opacity);
				}
			}
		}
	},
	
	
	findNearbyCoords: function(coords){
		var radius = 32 * Math.random();
		var yaw = Math.random() * Math.PI * 2;
		return {
			x: parseInt(coords.x + Math.sin(yaw) * radius),
			y: parseInt(coords.y + (Math.random() - 0.5) * 32),
			z: parseInt(coords.z + Math.cos(yaw) * radius), 
		};
	},
	
	findNearbyEntity: function(coords, filterDis, iterations){
		iterations = iterations || 10;
		
		if (Math.random() < .25 && (!filterDis || Entity.getDistanceToCoords(Player.get(), coords) < filterDis)){
			return Player.get();
		}
		
		var closest = {
			entity: null,
			dis: 9999999
		};
		var allEntities = Entity.getAll();
		for (var i = 0; i < iterations; i++){
			var entity = allEntities[parseInt(allEntities.length * Math.random())];
			var dis = Entity.getDistanceToCoords(entity, coords);
			if (filterDis && dis > filterDis){
				continue;
			}
			if (dis < closest.dis){
				closest.dis = dis;
				closest.entity = entity;
			}
		}
		
		return closest.entity;
	},
	
	/*  
	 *
	*/
	addEffectWithPowerCalculation: function(entity, effect, power, amplifier, hideParticles){
		var effectDuration = power * 64 * 20;
		var effectPower = 0;
		while(effectPower < 2 && power > 0.25){
			effectPower++;
			power /= 2;
		}
		if (entity){
			//Debug.message(effectDuration);
			if (effect == MobEffect.harm || effect == MobEffect.heal){
				effectDuration = 1;
			} 
			Entity.addEffect(entity, effect, parseInt(effectDuration), parseInt(effectPower), amplifier, !hideParticles);
		}
	},
	
	addRandomEffect: function(entity, positive, negative, power, amplifier, hideParticles){
		var effectArray;
		if (power > 0){
			effectArray = positive;
		}
		else{
			effectArray = negative;
		}
		var absPower = Math.abs(power);
		var effect = effectArray[parseInt(effectArray.length * Math.random())];
		this.addEffectWithPowerCalculation(entity, effect.effect, absPower * effect.power, amplifier, hideParticles);
	},
	
	correctAnimationPosition: function(coords){
		var playerPos = Player.getPosition();
		var dis = Entity.getDistanceBetweenCoords(playerPos, coords);
		var len = Math.min(12, dis);
		return {
			x: playerPos.x + (coords.x - playerPos.x) * len / dis,
			y: playerPos.y + Math.max(0, (coords.y - playerPos.y) * len / dis),
			z: playerPos.z + (coords.z - playerPos.z) * len / dis
		};
	}
}
