function AuraNode(x, y, z){
	this.__age = 0;
	
	this.coords = {
		x: x,
		y: y,
		z: z
	};
	
	/* ------------------ LOADING PROVIDE -------------------- */
	/* node unique key, can be generated by node chunk position */
	this.__key = null;
	/* registers key */
	this.registerKey = function(key){
		this.__key = key;
	}
	
	/* is node loaded (is it in update) */
	this.isLoaded = false;
	/* loads node into update, checks connections */
	this.load = function(){
		this.isLoaded = true;
		
		// find surface request
		if (this.coords.y == -1){
			var surfaceY = GenerationUtils.findSurface(this.coords.x, 64, this.coords.z).y;
			this.coords.y = surfaceY + 2.1 + Math.random() * 3;
		}
		
		UpdatableAPI.addUpdatable(this);
		Aura.activeNodes ++;
		//Debug.message("loaded aura node: " + this.__key);
	}
	
	/* distance from player to unload node */
	this.unloadDistance = Aura.NODE_CHUNK * Aura.NodeGenerator.radius * 2;
	this.visibilityDistance = 32;
	this.interactiveDistance = 72;
	/* unloads node, removes it from update, disconnects from neighbours */
	this.unload = function(){
		this.isLoaded = false;
		UpdatableAPI.removeUpdatable(this);
		Aura.activeNodes --;
		//Debug.message("unloaded aura node: " + this.__key);
	}
	
	
	
	
	/* ------------------------ BASIC PROVIDE --------------------------- */
	
	this.auraOvercharge = 0;
	
	this.overchargeNode = function(overcharge){
		this.auraOvercharge += overcharge;
	}
	
	this.provideOverchargeCleaning = function(){
		
	}
	
	this.extractOverchargedItem = function(){
		var item;
		for (var i = 0; i < 20; i++){
			var names = this.findEssences(3, true);
			item = AspectRegistry.findItemByAspects(names, false);
			if (item && item.id >= 256){
				for (var j in names){
					var name = names[j];
					this.aspectStorage.addEssenceByName(name, Math.random());
				}
				break;
			}
			else{
				item = null;
			}
		}
				
		return item;
	}
	
	this.provideOvercharge = function(power){
		if (Math.abs(power) > .3){
			Game.tipMessage("aura overcharged, hold on");
			
		}
		if (Math.random() < .04){
			var item = this.extractOverchargedItem();
			
			var coords = GenerationUtils.findSurface(
				this.coords.x + Math.random() * 7 - 3.5,
				this.coords.y,
				this.coords.z + Math.random() * 7 - 3.5
			);
			
			coords.y += 1.05;
			if (item){
				//Logger.Log(item.id + ", " + item.data, "THAUM");
				//Logger.flush();
				this.auraOvercharge *= .9;
				try{
					ParticleAnimation.FadeBolt.directedBolt(this.coords, coords, 3, 3, 2);
					var drop = World.drop(coords.x, coords.y, coords.z, item.id, 1, item.data)
					Entity.setVelocity(drop, 0, 0, 0);
					World.playSoundAtEntity(drop, "random.explode", 100);
				}
				catch (e){
					Logger.Log("aura overcharge item drop error: " + [item.id, item.data], "ERROR");
				}
			}
		}
	}
	
	this.update = function(){
		if (this.isVisible){
			if (Aura.doNodeAnimation){
				this.animateHard();
			}
			else {
				this.animateSoft();
			}
		}
		this.__age++
		if (this.auraOvercharge > .1){
			this.auraOvercharge *= .994;
			this.provideOvercharge(this.auraOvercharge);
		}
		/*
		if (this.__age == 5){
			this.aspectStorage.addEssenceByName("ignis", 50);
			this.aspectStorage.addEssenceByName("aqua", 50);
			this.aspectStorage.addEssenceByName("terra", 50);
			this.aspectStorage.addEssenceByName("aer", 50);
			this.aspectStorage.addEssenceByName("flux", 50);
		}*/
		
		if (this.__age % 20 != 0){
			return;
		}
		if (this.__age % 60 == 0){
			var dis = Entity.getDistanceToCoords(Player.get(), this.coords);
			this.isVisible = dis < this.visibilityDistance;
			this.isInteractive = dis < this.interactiveDistance;
			if (dis > this.unloadDistance){
				this.unload();
				return;
			}
		}
		this.tickMagic();
	}
	
	this.isVisible = false;
	this.isInteractive = false;
	
	/* ------------------ ANIMATION PROVIDE -------------------- */
	
	this.animationData = {
		bolts: 0,
	}
	
	this.animateHard = function(){
		var source = this.aspectStorage.byIndex(0);
		if (source){
			var particle = {
				id: 6,
				data: 0
			}
			if (Math.random() < .6){
				ParticleAnimation.particleSplash(this.coords, particle, {count: 1, gravity: 100, vel: .005});
			}
			if (this.__age % 8 == 0){
				ParticleAnimation.FadeBolt.randomBolt(this.coords, .7, 2, 1);
			}
		}
	}
	
	this.animateSoft = function(){
		var source = this.aspectStorage.byIndex(0);
		if (source){
			var aspect = source.aspect();
			var particle = {
				id: 26,
				data: aspect.getFinalColor()
			}
			if (Math.random() < .4){
				ParticleAnimation.particleSplash(this.coords, particle, {count: 1, gravity: 10, vel: .01});
			}
			if (this.__age % 25 == 0 && Math.random() < .4){
				ParticleAnimation.FadeBolt.randomBolt(this.coords, .4, 2, 1, null, Math.random() < .6);
			}
		}
	}
	
	
	/* ------------------ MAGIC PROVIDE -------------------- */
	/* params */
	this.power = 1;
	this.stability = 0;
	
	/* storage */
	this.aspectStorage = new AspectStorage();
	
	this.addEssence = function(aspect, amount){
		return this.aspectStorage.addEssence(aspect, amount);
	}
	
	this.getEssence = function(aspect, amount){
		return this.aspectStorage.getEssence(aspect, amount);
	}
	
	this.findEssences = function(count, ignoreAmount){
		var namesUsed = {};
		var names = [];
		var iterationCount = 0;
		essenceCount = Math.min(this.aspectStorage.getCount(), count);
		while (names.length < essenceCount && iterationCount++ < 32){
			var aspectName = this.aspectStorage.getRandomName();
			var aspectAmount = this.aspectStorage.getSource(aspectName).amount();
			if ((aspectAmount >= INTERACTIVE_ASPECT_AMOUNT || ignoreAmount) && !namesUsed[aspectName]){
				namesUsed[aspectName] = true;
				names.push(aspectName);
			}
		}
		return names;
	}
	
	/* returns random reaction source group for this node */
	this.generateReactionSourceGroup = function(essenceCount){
		var names = this.findEssences(essenceCount);
		//Debug.message(essenceCount + ":" + names);
		return this.aspectStorage.getSourceGroup(names);
	}
	
	/* starts reaction from this node aspect source at given coords */
	this.startReactionAt = function(x, y, z){
		var sourceGroup = this.generateReactionSourceGroup(3);
		var reaction = new AspectReaction(sourceGroup);
		reaction.setMaxAge(1000 + Math.random() * 500);
		reaction.setSpeed(0.15);
		reaction.setParentNode(this);
		reaction.loadAt(x, y, z);
	}
	
	/* starts random reaction near this node */
	this.startRandomReaction = function(){
		var range =  Aura.NODE_CHUNK * 0.99;
		this.startReactionAt(
			this.coords.x - range + Math.random() * range * 2,
			this.coords.y,
			this.coords.z - range + Math.random() * range * 2
		);
	}
	
	this.tickMagic = function(){
		if (this.__age % 180 == 0 && Math.random() < .1){
			this.startRandomReaction();
		}
		
		if (this.isInteractive && this.__age % 40 == 0 && Math.random() < .8){
			MagicInteraction.executeRandomNodeInteraction(this);
		}
	}
	
	
	
	/* ---------------- saving ------------------- */
	this.saveNode = function(){
		return {
			position: this.coords,
			storage: this.aspectStorage.save(true)
		};
	}
	
	this.loadNode = function(data){
		if (data.position){
			this.coords = data.position;
		}
		if (data.storage){
			this.aspectStorage.read(data.storage);
		}
	}
	
	/* ---------------- debug ------------------- */
	this.getDebugMessage = function(){
		return this.aspectStorage.getDebugMessage();
	}
}
