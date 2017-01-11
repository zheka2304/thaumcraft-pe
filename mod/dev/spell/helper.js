var SpellHelper = {
	getAngleBetweenVecs: function(vec1, vec2){
		var scalar = vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
		var len1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z);
		var len2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z);
		return Math.acos(scalar / len1 / len2);
	},
	
	findEntityTarget: function(spell){
		var entities = Entity.getAllJS();
		var target = {
			entity: null,
			value: 99999999
		};
		for(var i in entities){
			var entity = entities[i];
			var position = Entity.getPosition(entity);
			var delta = {
				x: position.x - spell.position.x,
				y: position.y - spell.position.y,
				z: position.z - spell.position.z
			};
			var absAngle = Math.abs(this.getAngleBetweenVecs(delta, spell.targetVector));
			var absValue = absAngle * 32 + Entity.getDistanceToCoords(entity, spell.position);
			if (absAngle < Math.PI / 3.0 && absValue < target.value && entity != spell.casterEntity){
				target.entity = entity;
				target.value = absValue;
			}
		} 
		return target.entity;
	},
	
	damageTarget: function(target, level){
		try{
			Entity.addEffect(target.entity, MobEffect.harm, 1, level, false, false);
		}
		catch(e){
			
		}
	},
	
	healTarget: function(target, level){
		try{
			Entity.addEffect(target.entity, MobEffect.heal, 1, level, false, false);
		}
		catch(e){
			
		}
	},
}