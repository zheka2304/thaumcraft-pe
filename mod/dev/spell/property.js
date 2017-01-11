var SpellActionRegistry = {
	actions: {},
	
	addAction: function(name, devider, func){
		if (!this.actions[name]){
			this.actions[name] = [];
		}
		
		var array = this.actions[name];
		array[devider] = func;
	},
	
	nextAction: function(name, number){
		var array = this.actions[name];
		if (!array){
			return null;
		}
		if (number <= 0){
			return null;
		}
		
		for (var devider = array.length - 1; devider > 0; devider--){
			if (array[devider] && number % devider == 0){
				return {devider: devider, func: array[devider]};
			}
		}
		return null;
	}
}




/* ------------------- MOVEMENT ------------------- */
SpellActionRegistry.addAction("move", 1, function(){ // projectile
	this.moveToTarget(.65);
});

SpellActionRegistry.addAction("move", 2, function(){ // instant
	this.moveToTarget(999);
});



/* ------------------- INTERACTION ------------------- */
SpellActionRegistry.addAction("interact", 5, function(scheme){
	var burningTime = scheme.getModifier(0);
	var animationModifier = scheme.getModifier(1);
	var velocityModfifer = scheme.getModifier(2);
});








































/*
var SpellPropertyRegistry = {
	properties: [],
	
	addProperty: function(data){
		var index = 0;
		for (var i in this.properties){
			var property = this.properties[i];
			index = i;
			if (property.devider > data.devider){
				break;
			}
			else if (i == this.properties.length - 1){
				index++;
			}
		}
		this.properties.splice(index, 0, data);
	},
	
	getDebugMessage: function(){
		var message = [];
		for (var i in this.properties){
			var property = this.properties[i];
			message.push(property.name + ": d=" + property.devider);
		}
		return message.join("\n");
	},
	
	nextProperty: function(number){
		if (number <= 0){
			return null;
		}
		for (var i = this.properties.length - 1; i >= 0; i--){
			var property = this.properties[i];
			if (number % property.devider == 0){
				return property;
			}
		}
		return null;
	}
}







SpellPropertyRegistry.addProperty({
	devider: 2,
	name: "target-entity",
	actions: {
		target: function(){
			this.targetEntity(SpellHelper.findEntityTarget(this));
		},
	}
});

SpellPropertyRegistry.addProperty({
	devider: 3,
	name: "on-fire",
	actions: {
		targetInteraction: function(target){
			if (this.getInteractionCount() < 1){
				Entity.setFire(target.entity, 16);
			}
		}
	}
});

SpellPropertyRegistry.addProperty({
	devider: 5,
	name: "heal",
	actions: {
		targetInteraction: function(target){
			if (this.getInteractionCount() < 1){
				SpellHelper.healTarget(target, 0);
			}
		}
	}
});

SpellPropertyRegistry.addProperty({
	devider: 10,
	name: "fireball",
	actions: {
		move: function(){
			this.moveToTarget(.5);
		},
		
		projectileAnimation: function(position){
			if (position){
				ParticleAnimation.particleSplash(position, {id: 6}, {count: 2.8, vel: .02, gravity: 5});
			}
		}
	}
});



SpellPropertyRegistry.addProperty({
	devider: 21,
	name: "bolt-strike-1",
	actions: { 
		targetInteraction: function(target){
			SpellHelper.damageTarget(target, 0);
			if (this.getInteractionCount() < 3){
				this.delayInteraction(8);
				this.setContinueInteraction();
			}
			
		},
		
		interactAnimation: function(position){
			ParticleAnimation.FadeBolt.bolt({
				x: position.x,
				y: position.y + 5,
				z: position.z
			}, position, 3, 2);
		},
	}
});






alert(SpellPropertyRegistry.getDebugMessage());*/