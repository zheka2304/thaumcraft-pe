IDRegistry.genItemID("itemAuramEssence");
IDRegistry.genItemID("itemFluxEssence");
Item.createItem("itemAuramEssence", "auram essence", {name: "auram_essence"});
Item.createItem("itemFluxEssence", "flux essence", {name: "flux_essence"});

IDRegistry.genItemID("positivePowerCrystal");
IDRegistry.genItemID("negativePowerCrystal");
Item.createThrowableItem("positivePowerCrystal", "positive crystal of power", {name: "positive_power_crystal"});
Item.createThrowableItem("negativePowerCrystal", "negative crystal of power", {name: "negative_power_crystal"});

Item.registerThrowableFunction("positivePowerCrystal", function(projectile, item, target){
	//CreateBigText("AURA OVERCHARGED", {r: 255, g: 255, b: 200}, 20, 4000);
	var nodes = Aura.getNearbyNodes(target.x, target.y, target.z);
	for (var i in nodes){
		nodes[i].node.overchargeNode(nodes[i].power * 48);
	}
	
	var position = Entity.getPosition(projectile);
	position.y += .5;
	UpdatableAPI.addUpdatable({
		age: 0,
		update: function(){
			if (this.age ++ > 400){
				this.remove = true;
			}
			ParticleAnimation.particleSplash(position, {id: 31}, {offset: true, vel: .8, count: 16});
			if (Math.random() < .1){
				ParticleAnimation.FadeBolt.randomBolt(position, 1.4, 2, 1);
			}
		}
	})
});

Item.registerThrowableFunction("negativePowerCrystal", function(projectile, item, target){
	var player = Player.get();
	var affectedEnttites = Entity.getAllInRange(target, 18);
	
	//CreateBigText("FLUX CURSE", {r: 200, g: 80, b: 255}, 80);
	
	
	for (var i in affectedEnttites){
		var entity = affectedEnttites[i];
		if (entity == player){
			continue;
		}
		
		Entity.addPosition(entity, 0, .5, 0);
		Entity.setMobile(entity, false);
		UpdatableAPI.addUpdatable({
			entity: entity,
			damageCooldown: 0,
			
			animate: function(){
				var position = Entity.getPosition(this.entity);
				position.y += .7;
				ParticleAnimation.FadeBolt.randomBolt(position, 2, 3, 2);
				World.playSoundAtEntity(this.entity, "random.explode", 100);
			},
			
			update: function(){
				if (Entity.getHealth(this.entity) < 1){
					this.remove = true;
					Entity.remove(this.entity);
					Aura.leakEssence(Entity.getPosition(this.entity), AspectRegistry.getAspect("flux"), Entity.getMaxHealth() * .2);
					return;
				}
				
				var position = Entity.getPosition(this.entity);
				position.y += .7;
				
				if (this.damageCooldown < 5 && Math.random() < .05){
					this.animate();
				}
				
				if (this.damageCooldown-- <= 0 && Math.random() < .1){
					this.damageCooldown = 12;
					Entity.damageEntity(this.entity, 5);
					this.animate();
				}
				
				Entity.addPosition(this.entity, 0, .02, 0);
				ParticleAnimation.particleSplash(position, {id: 6}, {count: 3, offset: true, vel: .5, isStatic: true, upward: .08});
			}
		});
	}
});