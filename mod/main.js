/*
  _____   _                                                          __   _       ____    _____ 
 |_   _| | |__     __ _   _   _   _ __ ___     ___   _ __    __ _   / _| | |_    |  _ \  | ____|
   | |   | '_ \   / _` | | | | | | '_ ` _ \   / __| | '__|  / _` | | |_  | __|   | |_) | |  _|  
   | |   | | | | | (_| | | |_| | | | | | | | | (__  | |    | (_| | |  _| | |_    |  __/  | |___ 
   |_|   |_| |_|  \__,_|  \__,_| |_| |_| |_|  \___| |_|     \__,_| |_|    \__|   |_|     |_____|
   
   by zheka_smirnov
*/


var ParticleType = ModAPI.requireGlobal("ParticleType");
var MobEffect = ModAPI.requireGlobal("MobEffect");

var LOGGER_TAG = "THAUMCRAFT";

__config__.checkAndRestore({
	aura: {
		super_fast_evolution: false
	},
	graphics: {
		advanced_shaders: false,
		particle_detalization_level: 1,
		render_distance: {
			minor: 32,
			major: 64
		}
	},
	enable_cheats: false
})

if (getCoreAPILevel() >= 6){
	var resources = Resources.getResourceList();
	resources["shaders_ultra.zip"] = __config__.access("graphics.advanced_shaders");
	Resources.setResourceList(resources);
}
else {
	Logger.Log("Old Core Engine version detected (1.13 required), cannot apply some config settings.", LOGGER_TAG);
}


var ParticleAnimation = {
	particleSplash: function(coords, particle, phys){
		if (!particle){
			particle = {
				id: 6,
				data: 0
			};
		}
		if (!phys){
			phys = {};
		}
		var particle_count = phys.count || 1;
		var inner_gravity = phys.gravity || 1;
		var max_velocity = phys.vel || .1;
		for (var i = 0; i < particle_count; i++){
			var vel = Math.pow(Math.random(), inner_gravity) * max_velocity; 
			var velX = (Math.random() - .5) * vel * 2;
			var velY = (Math.random() - .5) * vel * 2;
			var velZ = (Math.random() - .5) * vel * 2;
			var velmp = 1;
			if (phys.isStatic){
				velmp = 0;
			}
			var velYadd = 0;
			if (phys.upward){
				velYadd = phys.upward * Math.random();
			}
			
			if (phys.offset){
				Particles.addParticle(coords.x + velX, coords.y + velY, coords.z + velZ, particle.id, velX * velmp, velY * velmp + velYadd, velZ * velmp, particle.data);
			}
			else{
				Particles.addParticle(coords.x, coords.y, coords.z, particle.id, velX * velmp, velY * velmp + velYadd, velZ * velmp, particle.data);
			}
		}
	},
	
	animateNitor: function(x, y, z, power){
		var particle_count = power * 1.5;
		power *= 0.5;
		var maxV_vel = power * .155;
		var maxH_vel = power * .055;
		for (var i = 0; i < particle_count; i++){
			var velX = (Math.random() - .5) * maxH_vel * 2;
			var velY = Math.random() * maxV_vel
			var velZ = (Math.random() - .5) * maxH_vel * 2;
			Particles.addParticle(x + velX, y, z + velZ, 6, velX, velY, velZ);
		}
	},

	FadeBolt: {
		bolt: function(coords1, coords2, depth, fork, vel, soft){
			if(!depth || depth < 0){
				depth = 0;
			}
			if(!fork || fork < 0){
				fork = 0;
			}

			if(depth > 0){
				var dist = Entity.getDistanceBetweenCoords(coords1, coords2);
				var randomization = .25;
				var coords3 = {
					x: (coords1.x + coords2.x) / 2 + (Math.random() - .5) * dist * randomization,
					y: (coords1.y + coords2.y) / 2 + (Math.random() - .5) * dist * randomization,
					z: (coords1.z + coords2.z) / 2 + (Math.random() - .5) * dist * randomization,
				};
				if(fork-- > 0){
					var coords4 = {
						x: coords2.x + (Math.random() - .5) * dist * .5,
						y: coords2.y + (Math.random() - .5) * dist * .5,
						z: coords2.z + (Math.random() - .5) * dist * .5,
					} 
					this.bolt(coords3, coords4, depth - 1, fork, vel, soft);
				}
				this.bolt(coords3, coords2, depth - 1, fork, vel, soft);
				this.bolt(coords3, coords1, depth - 1, fork, vel, soft);
			}
			else{
				if (soft){
					Particles.line(31, coords1, coords2, .1, vel);
				}
				else {
					Particles.line(31, coords1, coords2, .024, vel);
				}
			}
		},

		randomBolt: function(coords1, len, depth, fork, vel, soft){
			var yaw = Math.random() * Math.PI * 2;
			var pitch = (Math.random() - 0.5) * Math.PI;
			var coords2 = {	
				x: coords1.x + Math.sin(yaw) * Math.cos(pitch) * len,
				y: coords1.y + Math.sin(pitch) * len,
				z: coords1.z + Math.cos(yaw) * Math.cos(pitch) * len,
			}
			this.bolt(coords1, coords2, depth, fork, vel, soft);
		},
		
		directedBolt: function(coords1, coords2, maxLen, depth, fork, vel, soft){
			var dist = Entity.getDistanceBetweenCoords(coords1, coords2);
			var len = Math.min(maxLen, dist);
			coords2 = {
				x: (coords2.x - coords1.x) / dist * len + coords1.x,
				y: (coords2.y - coords1.y) / dist * len + coords1.y,
				z: (coords2.z - coords1.z) / dist * len + coords1.z,
			};
			this.bolt(coords1, coords2, depth, fork, vel, soft);
		},
		
		connectingBolt: function(coords1, coords2, maxLen, depth, fork, vel, soft){
			var dis = Entity.getDistanceBetweenCoords(coords1, coords2);
			if (dis > maxLen * 2){
				this.directedBolt(coords1, coords2, maxLen, depth, fork, vel, soft);
				this.directedBolt(coords2, coords1, maxLen, depth, fork, vel, soft);
			}
			else{
				this.bolt(coords1, coords2, depth, fork, vel, soft)
			}
		},
	}
}


function MagicAnimation(x, y, z){
	this.parent = Animation.base;
	this.parent(x, y, z);
	
	this.maxAge = 160 + 160 * Math.random();
	this.tick = function(){
		if (this.getAge() > this.maxAge){
			this.destroy();
		}
		ParticleAnimation.particleSplash(this.coords, {id: 31}, {offset: true});
	}
}


function FlameAnimation(x, y, z){
	this.parent = Animation.base;
	this.parent(x, y, z);
	
	this.maxAge = 200 + 160 * Math.random();

	var vel = 0.05;
	this.velocity = {
		x: (Math.random() - 0.5) * 2 * vel,
		y: (Math.random() - 0.5) * .5 * vel,
		z: (Math.random() - 0.5) * 2 * vel,
	}
	this.tick = function(){
		if (this.getAge() > this.maxAge){
			this.destroy();
		}
		ParticleAnimation.particleSplash(this.coords, {id: 6}, {gravity: 10, velocity: 0.03});
		this.coords.x += this.velocity.x;
		this.coords.y += this.velocity.y;
		this.coords.z += this.velocity.z;
	}
}


/* web of all aura in the world */
var Aura = {
	NODE_CHUNK: 32,
	GENERATION_CHANCE: 0.4,
	DEFAULT_ASPECT_COUNT: 4,
	
	data: {},
	doNodeAnimation: false,
	activeNodes: 0,
	
	NodeGenerator: {
		__age: 0,
		interval: 2,
		radius: 3,
		update: function(){
			if (this.__age % 20 == 0){
				Aura.checkNodeVision();
			}
			if (++this.__age % this.interval != 0){
				return;
			}
			var width = this.radius * 2 + 1;
			var position = (this.__age / this.interval) % (width * width);
			var player = Player.getPosition();
			var chunk = {
				x: Math.floor(player.x / Aura.NODE_CHUNK + .5) + Math.floor(position % width) - this.radius,
				z: Math.floor(player.z / Aura.NODE_CHUNK + .5) + Math.floor(position / width) - this.radius,
			};
			Aura.loadChunk(chunk.x, chunk.z);
			
			// debug
			var debug_player_pos = Player.getPosition();
			var debug_chunk = Aura.getChunkByCoords(debug_player_pos.x, debug_player_pos.z);
			var debug_node = Aura.findNode(debug_chunk.x, debug_chunk.z);
			if (debug_node){
				//Game.tipMessage(debug_node.getDebugMessage());
				if (World.getWorldTime() % 20 == 0){
					//ParticleAnimation.FadeBolt.connectingBolt(debug_player_pos, debug_node.coords, 3, 2, 2);
				}
			}
			
		}
	},
	
	
	visionConditions: [],
	
	addVisionCondition: function(func){
		this.visionConditions.push(func);
	},
	
	checkNodeVision: function(){
		for (var i in this.visionConditions){
			if (this.visionConditions[i]()){
				this.doNodeAnimation = true;
				return;
			}
		}
		this.doNodeAnimation = false;
	},
	
	/* ------------------- nodes ---------------------- */
	
	clearAllData: function(){
		this.data = {};
		this.activeNodes = 0;
	},
	
	loadInUpdate: function(){
		UpdatableAPI.addUpdatable(this.NodeGenerator);
		this.activeNodes = 0;
	},
	
	getChunkKey: function(chunkX, chunkZ){
		return chunkX + "x" + chunkZ;
	},
	
	getChunkByCoords: function(x, z){
		return {
			x: Math.floor(x / this.NODE_CHUNK),
			z: Math.floor(z / this.NODE_CHUNK)
		};
	},
	
	getChunkKeyByCoords: function(x, z){
		var chunk = this.getChunkByCoords(x, z);
		return this.getChunkKey(chunk.x, chunk.z);
	},
	
	findNode: function(chunkX, chunkZ){
		return this.data[this.getChunkKey(chunkX, chunkZ)];
	},
	
	registerNode: function(node){
		if (!node.__key){
			var key = this.getChunkKeyByCoords(node.coords.x, node.coords.z);
			node.registerKey(key);
		}
		if (!this.data[node.__key]){
			this.data[node.__key] = node;
		}
		return node.__key;
	},
	
	loadChunk: function(chunkX, chunkZ){
		var node = this.findNode(chunkX, chunkZ);
		if (!node){
			this.generateChunk(chunkX, chunkZ);
		}
		else if (!node.isLoaded){
			node.load();
		}
	},
	
	generateChunk: function(chunkX, chunkZ){
		var gen = ThaumAPI.SeededRandomGenerator.forChunk(chunkX, chunkZ);
		var rand = gen.nextFloat();
		if (rand < this.GENERATION_CHANCE){
			/* create and fill */
			var node = new AuraNode((gen.nextFloat() + chunkX) * this.NODE_CHUNK, -1, (gen.nextFloat() + chunkZ) * this.NODE_CHUNK);
			for (var i = 0; i < gen.rangedInt(4, 6); i++){
				var aspectType = Math.pow(gen.nextFloat(), 4) * 18 + gen.nextFloat() * 10;
				var aspect = AspectRegistry.findForType(aspectType, true);
				if (aspect){
					node.addEssence(aspect, gen.rangedFloat(8, 16));
				}
			}
			if (gen.nextFloat() < .08){
				node.addEssence(AspectRegistry.getAspect("flux"), gen.rangedFloat(8, 32));
			}
			/* load */
			var resultKey = this.registerNode(node);
			node.load();
		}
	},
	
	/* saving utils */
	addLoadedNode: function(key, node){
		node.registerKey(key);
		this.registerNode(node);
		node.load();
	},
	
	
	/* ----------- essense leaking (C.P.A.H.b. technology) ------------ */
	/* return cache for connections for given coords */
	createConnectionCache: function(x, y, z){
		var chunk = this.getChunkByCoords(x, z);
		var connections = [];
		var distanceSum = 0;
		for (var chunkX = -1; chunkX < 2; chunkX++){
			for (var chunkZ = -1; chunkZ < 2; chunkZ++){
				var node = this.findNode(chunkX + chunk.x, chunkZ + chunk.z);
				if (node){
					var distance = Entity.getDistanceBetweenCoords({x: x, y: y, z: z}, node.coords);
					distanceSum += distance;
					connections.push({node: node, dis: distance});
				}
			}
		}
		for (var i in connections){
			var connection = connections[i];
			connection.power = (1 - connection.dis / distanceSum) / (connections.length - 1) || 1;
		}
		return connections;
	},
	
	getNearbyNodes: function(x, y, z){
		return this.createConnectionCache(x, y, z);
	},
	
	/* leaks some essence into aura by given connection data */
	leakEssenceByCache: function(aspect, amount, connections){
		//Debug.message("leaking " + amount + " of " + aspect.name + " to " + connections.length + " connections:");
		for (var i in connections){
			var connection = connections[i];
			connection.node.addEssence(aspect, amount * connection.power);
		}
	},
	
	leakEssence: function(coords, aspect, amount){
		var cache = this.createConnectionCache(coords.x, coords.y, coords.z);
		this.leakEssenceByCache(aspect, amount, cache);
	},
	
	leakEssenceStack: function(coords, essences, animate, preparedCache){
		var cache = preparedCache || this.createConnectionCache(coords.x, coords.y, coords.z);
		var index = 0;
		for (var name in essences){
			var aspect = AspectRegistry.getAspect(name);
			var amount = essences[name];
			if (aspect && amount){
				this.leakEssenceByCache(aspect, amount, cache);
			}
			if (animate && Math.random() < amount * 3){
				ParticleAnimation.FadeBolt.randomBolt(coords, Math.min(3, amount * 10), 3, 2);
			} 
		}
	},
	
	/* gets given amount of aspects from nearby nodes, returns amount given */
	extractEssenceByCache: function(aspect, amountTotal, connections){
		var amountGot = 0;
		for (var i in connections){
			var connection = connections[i];
			amountGot += connection.node.getEssence(aspect, amountTotal * connection.power);
		}
		return amountGot;
	},
	
	extractEssence: function(coords, aspect, amount){
		var cache = this.createConnectionCache(coords.x, coords.y, coords.z);
		this.extractEssenceByCache(aspect, amount, cache);
	},
	
	extractEssenceStack: function(coords, essences, animate, preparedCache){
		var cache = preparedCache || this.createConnectionCache(coords.x, coords.y, coords.z);
		var index = 0;
		var essencesGot = {};
		for (var name in essences){
			var aspect = AspectRegistry.getAspect(name);
			var amount = essences[name];
			if (aspect && amount){
				essencesGot[name] = this.extractEssenceByCache(aspect, amount, cache);
			}
			if (animate && Math.random() < amount * 3){
				ParticleAnimation.FadeBolt.randomBolt(coords, Math.min(3, amount * 10), 3, 2);
			} 
		}
		return essencesGot;
	},
	
	
	
	getNearestAuraNode: function(coords){
		var chunk = this.getChunkByCoords(coords.x, coords.z);
		var nearest = {
			node: null,
			dis: 99999999
		};
		for (var chunkX = -1; chunkX < 2; chunkX++){
			for (var chunkZ = -1; chunkZ < 2; chunkZ++){
				var node = this.findNode(chunkX + chunk.x, chunkZ + chunk.z);
				if (node){
					var distance = Entity.getDistanceBetweenCoords(coords, node.coords);
					if (distance < nearest.dis){
						nearest.dis = distance;
						nearest.node = node;
					}
				}
			}
		}
		return nearest.node;
	}
}

Aura.addVisionCondition(function(){
	return Player.getInventory("armor").getSlot("arm0").id == IDData.item.itemGoogles;
});



Callback.addCallback("LevelLoaded", function(){
	Aura.loadInUpdate();
});




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
		return this.aspectStorage.getSourceGroup(names);
	}
	
	/* starts reaction from this node aspect source at given coords */
	this.startReactionAt = function(x, y, z){
		var sourceGroup = this.generateReactionSourceGroup(3);
		var reaction = new AspectReaction(sourceGroup);
		reaction.setMaxAge(1500 + Math.random() * 1000);
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
		if (this.__age % 300 == 0 && Math.random() < .1){
			this.startRandomReaction();
		}
		
		if (this.isInteractive && this.__age % 160 == 0 && Math.random() < .3){
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


Saver.addSavesScope("ThaumcraftAura",
	function read(scope){
		var nodeData = scope.nodes;
		
		Aura.clearAllData();
		for (var key in nodeData){
			var node = new AuraNode();
			node.loadNode(nodeData[key]);
			Aura.addLoadedNode(key, node);
		}
	},
	
	function save(){
		var scope = {
			nodes: {}
		};
		
		for (var key in Aura.data){
			scope.nodes[key] = Aura.data[key].saveNode();
		}
		
		return scope;
	}
);


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


/*
 * power amount: 0-10 - extra rare spawn & effect interactions
 * power amount: 10-30 - rare spawn & effects, adding tile & grass interaction, weather affect
 * power amount: 30-60 - massive effects, spawns, tile interactions, grass color changing
 * power amount: 60+ - fast grass changing, endless weather interactions, affecting aura
 *
*/

var BasicWorldInteractor = {
	__power: 0,
	
	setPower: function(aspectPower, aspectAmount){
		this.__power = this.convertPowerValue(aspectPower * aspectAmount);
	},
	
	power: function(){
		return this.__power;
	},
	
	absPower: function(){
		return Math.abs(this.power());
	},
	
	__localPower: 0,
	setLocalPower: function(power){
		this.__localPower = power;
	},
	
	localPower: function(){
		return this.__localPower;
	},
	
	absLocalPower: function(){
		return Math.abs(this.localPower())
	},
	
	/* ---------------- pattern ------------------- */
	
	chance: {
		effect: {min: 0, max: 60, chance: 0.75},
		spawn: {min: 5, max: 60, chance: 0.2},
		tile: {min: 20, max: 80, chance: 0.75},
		entity: {min: 10, max: 50, chance: 0.5},
		grass: {min: 20, max: 100, chance: 0.9},
		weather: {min: 10, max: 100, chance: 0.3},
		node: {min: 10, max: 100, chance: 0.1},
		animation: {min: 0, max: 80, chance: 0.9}
	},
	
	actionFuncs: {
		effect: {name: "affectEntityEffect", args: ["entity"]},
		spawn: {name: "affectSpawn", args: ["x", "y", "z"]},
		tile: {name: "affectTile", args: ["x", "y", "z"]},
		entity: {name: "affectEntity", args: ["entity"]},
		grass: {name: "affectGrassColor", args: ["x", "z"]},
		weather: {name: "affectWeather", args: []},
		node: {name: "affectWeather", args: ["node"]},
		animation: {name: "affectAnimation", args: ["x", "y", "z", "node"]}
	},
	
	/* ----------------- HOOKS -------------------- */
	convertPowerValue: function(value){
		return value * 1.5;
	},
	
	/* affects tile at random coords */
	affectTile: function(x, y, z){
		//Debug.message("tile interaction executed with no element. coords = " + [x, y, z]);
	},
	
	/* affects random entity */
	affectEntity: function(entity){
		//Debug.message("entity interaction executed with no element. entity = " + entity);
	},
	
	/* affects random entity for adding effect */
	affectEntityEffect: function(entity){
		//Debug.message("entity-effect interaction executed with no element. entity = " + entity);
	},
	
	/* affects grass color at random coords */
	affectGrassColor: function(x, z){
		//Debug.message("grass color interaction executed with no element. coords = " + [x, z]);
	},
	
	/* affects weather */
	affectWeather: function(){
		//Debug.message("weather interaction called with no element.");
	},
	
	/* affects entity spawn at random coords */
	affectSpawn: function(x, y, z){
		//Debug.message("entity-spawn interaction executed with no element. coords = " + [x, y, z]);
	},
	
	/* affects aura node - only if interaction comes from node */
	affectAura: function(node){
		//Debug.message("aura interaction executed with no element. node key = " + (node ? node.__key : null));
	},
	
	/* creates animation at coords */
	affectAnimation: function(x, y, z, node){
		//Debug.message("animation executed with no element. node key = " + (node ? node.__key : null) + ", coords = " + [x, y, z]);
	}
	
}

var MagicInteraction = {
	elementInteractors: {},
	
	registerElement: function(name, interactor){
		for (var property in BasicWorldInteractor){
			if (!interactor[property]){
				interactor[property] = BasicWorldInteractor[property];
			}
		}
		this.elementInteractors[name] = interactor;
	},
	
	requireElement: function(name){
		return this.elementInteractors[name] || this.elementInteractors.none;
	},
	
	/* returns object to execute for given element name and aspect source 
	 * here is all basic logic of aura->world interaction
	*/
	getAffectedInteraction: function(elementName, aspectSource){
		var interactor = this.requireElement(elementName);
		var aspectPower = aspectSource.aspect().power;
		interactor.setPower(aspectPower, aspectSource.amount());
		
		var fullPower = interactor.absPower();
		var actions = [];
		
		for (var name in interactor.chance){
			var chance = interactor.chance[name];
			var interactionMultiplier = Math.min(1, Math.max((fullPower - chance.min) / (chance.max - chance.min), 0));
			var realChance = chance.chance * interactionMultiplier;
			
			if (realChance > Math.pow(Math.random(), 1.5)){
				actions.push({
					name: name,
					localPower: interactionMultiplier * aspectPower
				})
			}
		}
		var action = actions[parseInt(actions.length * Math.random())];
		
		if (action){
			//Debug.message("aspect: " + aspectSource.name() + ", action: " + action.name);
			interactor.setLocalPower(action.localPower);
			return {
				obj: interactor,
				func: interactor.actionFuncs[action.name]
			}
		}
		
		return null;
	},
	
	/*
	 * executes interaction for 
	*/
	executeInteraction: function(coords, interactor, aspectSource, node){
		var coords = MagicInteractionHelper.findNearbyCoords(coords);
		var args = {
			entity: MagicInteractionHelper.findNearbyEntity(coords, 32),
			x: coords.x,
			y: coords.y,
			z: coords.z,
			node: node
		};
		
		var params = [];
		
		if (interactor){
			for (var i = 0; i < 5; i++){
				params[i] = args[interactor.func.args[i]];
			}
			interactor.obj[interactor.func.name](params[0], params[1], params[2], params[3], params[4]);
		}
	},
	
	
	executeNodeInteraction: function(node, aspectSource){
		if (node){
			var interactor = this.getAffectedInteraction(aspectSource.element(), aspectSource);
			if (interactor){
				this.executeInteraction(node.coords, interactor, aspectSource, node);
			}
			else{
				//Debug.message("no action found")
			}
		}
	},
	
	executeRandomNodeInteraction: function(node){
		if (node){
			var aspect = {
				source: null, 
				amount: 0
			};
			for (var i = 0; i < 4; i++){
				var source = node.aspectStorage.getSource(node.aspectStorage.getRandomName());
				if (source && source.amount() > aspect.amount && Math.random() > aspect.amount / source.amount()){
					aspect.source = source;
					aspect.amount = source.amount();
				}
			}
			if (aspect.amount > 0){
				this.executeNodeInteraction(node, aspect.source);
			}
		}
	}
}


MagicInteraction.registerElement("none", BasicWorldInteractor);


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


var ThaumAPI = {
	/*  */
	SeededRandomGenerator: {
		precious: 100000,
		forSeed: function(seed){
			seed = Math.abs(seed % this.precious);
			return {
				seed: seed,
				precious: this.precious,
				/* returns integer in range 0 - (precious - 1) */
				next: function(){
					this.seed = (this.seed * 67671 + 1) % this.precious;
					return this.seed;
				},
				
				/* returns float in range 0 - 1 */
				nextFloat: function(){
					return this.next() / this.precious;
				},
				
				/* returns float in range a - b*/
				rangedFloat: function(a, b){
					return this.nextFloat() * (b - a) + a;
				},
				
				/* returns int in range a - b*/
				rangedInt: function(a, b){
					return parseInt(this.rangedFloat(a, b));
				},
				
				/* adds more randomization */
				randomize: function(){
					var count = this.rangedInt(0, 10);
					for(var i = 0; i < count; i++){
						this.next();
					}
				}
			};
		},
		
		forChunk: function(x, z){
			var gen = this.forSeed(x * 1632 + z * 1639 + 1937);
			gen.randomize();
			return gen;
		}
	},
	
	
}



function Aspect(name){
	/* core params */
	this.name = name;
	this.icon = null;
	/* stability - 0 means most active mutation chance, 1 - least*/
	this.stability = 0;
	/* power 0 - neutral, -1 - negative, 1 - positive */
	this.power = 0;
	/* aspect type - aspect with close types react more stable and fast, with more far - unstable */
	this.type = 0;
	/* aspect element - type of world interaction */
	this.element = "none";
	/* spell id for spell casting */
	this.spellID = 0;
	/* graphics */
	this.color = {
		r: 0,
		g: 0,
		b: 0
	};
	
	this.setup = function(customParams, graphicsParams){
		if (customParams){
			this.power = customParams.power || 0;
			this.type = customParams.type || 0;
			this.stability = customParams.stability || 0;
			this.spellID = customParams.spellID || 1;
			this.element = customParams.element || "none";
		}
		if (graphicsParams){
			if (graphicsParams.color){
				this.color = graphicsParams.color;
			}
			if (graphicsParams.icon){
				this.icon = graphicsParams.icon;
			}
		}
		return this;
	}
	
	
	
	this.setColor = function(r, g, b){
		this.color = {
			r: r,
			g: g,
			b: b
		}
	}
	
	this.getFinalColor = function(){
		return (this.color.r * 256 + this.color.g) * 256 + this.color.b;
	}	
}


var ASPECT_REACTION_ITERATIONS = 2; // TODO: ballance (15-20% of all aspects)

var AspectRegistry = {
	aspects: {},
	aspectNames: [],
	
	/* -------------------------- aspect registry ------------------------- */
	
	/* registers aspect object */
	registerAspect: function(aspect){
		if (aspect && aspect.name){
			this.aspectNames.push(aspect.name);
			this.aspects[aspect.name] = aspect;
			LiquidRegistry.registerLiquid("essence_" + aspect.name, "essence of " + aspect.name, [this.getAspectScale(aspect.name, true)]);
		}
		else{
			Logger.Log("no aspect name attached", "ERROR");
		}
	},
	
	getAspect: function(name){
		return this.aspects[name];
	},
	
	getRandomAspect: function(){
		return this.getAspect(
			this.aspectNames[parseInt(this.getAspectCount() * Math.random())]
		);
	},
	
	getAll: function(){
		return this.aspects;
	},
	
	getAllNames: function(){
		return this.aspectNames;
	},
	
	getAspectCount: function(){
		return this.aspectNames.length;
	},
	
	findForType: function(type, returnClosest){
		var closest = {
			aspect: null, 
			dis: 99999999
		};
		for (var name in this.aspects){
			var aspect = this.aspects[name];
			var dis = Math.abs(type - aspect.type);
			if (closest.dis > dis){
				closest.aspect = aspect;
				closest.dis = dis;
			}
		}
		if (returnClosest || closest.dis == 0){
			return closest.aspect;
		}
		return null;
	},
	
	combineAspects: function(aspect1, aspect2){
		if (aspect1 && aspect2){
			return this.findForType(aspect1.type + aspect2.type, false);
		}
		return null;
	},
	
	getInifiniteSource: function(aspectName){
		var aspect = this.getAspect(aspectName);
		if (aspect){
			return {
				__aspect: aspect,
				__name: aspectName,
				__storage: null,
				
				/* returns aspect name */
				name: function(){
					return this.__name;
				},
				/* returns aspect object */
				aspect: function(){
					return this.__aspect;
				},
				/* returns aspect element */
				element: function(){
					return this.aspect().element;
				},
				/* returns parent storage object */
				storage: function(){
					return this.__storage;
				},
				/* adds essence to storage */
				add: function(amount){
					return true;
				},
				/* gets some essence from storage, returns amount got */
				get: function(amount){
					return amount;
				},
				/* returns amount of essence */
				amount: function(){
					return 0;
				},
			};
		}
	},
	
	
	/* -------------------- item registry --------------------- */
	aspectsForItem: {},
	registerAspectsForItem: function(id, data, aspects){
		var key = id + ":" + data;
		if (data == -1){
			key = id + "";
		}
		this.aspectsForItem[key] = aspects;
	},
	
	getAspectsForItem: function(id, data){
		var key1 = id + ":" + data;
		var key2 = id + "";
		if (this.aspectsForItem[key1]){
			return this.aspectsForItem[key1];
		}
		if (this.aspectsForItem[key2]){
			return this.aspectsForItem[key2];
		}
		return {};
	},
	
	getAspectNamesForItem: function(id, data){
		var aspectNames = [];
		var aspects = this.getAspectNamesForItem(id, data);
		for (var name in aspects){
			aspectNames.push(name);
		}
		return aspectNames;
	},
	
	findItemByAspects: function(aspectNames, getAll){
		var matched = [];
		for (var key in this.aspectsForItem){
			var splitted = key.split(":");
			var id = parseInt(splitted[0]) || 0;
			var data = parseInt(splitted[1]) || 0;
			var aspects = this.aspectsForItem[key];
			
			var allExist = true;
			for (var i in aspectNames){
				if (!aspects[aspectNames[i]]){
					allExist = false;
					break;
				}
			}
			if (allExist){
				matched.push({id: id, data: data});
			}
		}
		
		if (getAll){
			return matched;
		}
		else{
			return matched[parseInt(Math.random() * matched.length)];
		}
	},
	
	
	
	/* ------------------------------ research registry ------------------------------- */
	aspectResearchProgress: {},
	
	getResearchProgress: function(name){
		if (!this.aspectResearchProgress[name]){
			this.aspectResearchProgress[name] = 0;
		}
		return this.aspectResearchProgress[name];
	},
	
	isResearched: function(name){
		return this.aspectResearchProgress[name] >= 1; // TODO: RETURN
	},
	
	setResearchProgress: function(name, progress){
		this.aspectResearchProgress[name] = progress;
	},
	
	setResearched: function(name){
		this.setResearchProgress(name, 1);
	},
	
	researchAspect: function(name, essenceAmount, modifier){
		var aspect = this.getAspect(name);
		if (aspect){
			this.aspectResearchProgress[name] = Math.min(this.getResearchProgress(name) + essenceAmount * (modifier || 1) * .5 / aspect.type, 1);
		}
	},
	
	getAspectName: function(name, showUnknown){
		if (this.isResearched(name) || showUnknown){
			return name;
		}
		else {
			return "unknown";
		}
	},
	
	getAspectIcon: function(name, showUnknown){
		if (this.isResearched(name) || showUnknown){
			return "aspectIcon_" + name;
		}
		else {
			return "aspectIcon_" + "unknown";
		}
	},
	
	getAspectScale: function(name, showUnknown){
		if (this.isResearched(name) || showUnknown){
			return "aspectScale_" + name;
		}
		else {
			return "aspectScale_" + "unknown";
		}
	},
	
	initBasicResearches: function(){
		AspectRegistry.setResearched("flux");
		AspectRegistry.setResearched("aer");
		AspectRegistry.setResearched("aqua");
		AspectRegistry.setResearched("terra");
		AspectRegistry.setResearched("ignis");
		AspectRegistry.setResearched("ordo");
		AspectRegistry.setResearched("perditio");
	},
	
	
	
	
	aspectReactions: {},
	
	addReaction: function(name1, name2, result){
		this.aspectReactions[name1 + ":" + name2] = result;
		this.aspectReactions[name2 + ":" + name1] = result;
	},
	
	getReactionResult: function(name1, name2){
		return this.getAspect(this.aspectReactions[name1 + ":" + name2]);
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	/* ------------------- REACTIONS CALCULATION <TODO: REMOVE> --------------------- */
	
	/* returns random aspect as result of reaction for given type & stability */
	findForReaction: function(type, stability, powerModifier){
		/* is power modifier defined */
		var powerCap = 1;
		if (typeof(powerModifier) == "number"){
			powerCap = powerModifier;
		}
		/* init */
		var threshold = -1.0 + stability * 1.5;
		var range = 10.0 / (stability + .01) + 1.0;
		
		var closest = {
			aspect: null,
			distance: 9999999999
		};
		for (var i = 0; i < ASPECT_REACTION_ITERATIONS; i++){
			var name = this.aspectNames[parseInt(this.aspectNames.length * Math.random())];
			var aspect = this.aspects[name];
			var distance = Math.abs(aspect.type - type);
			if (distance < closest.distance && distance < range && aspect.power > threshold && aspect.power < powerCap){
				closest.aspect = aspect;
				closest.distance = distance;
			}
		}
		return closest.aspect;
	},
	
};


Saver.addSavesScope("ThaumcraftAspects",
	function read(scope){
		AspectRegistry.aspectResearchProgress = scope;
		AspectRegistry.initBasicResearches();
	},
	
	function save(){
		return AspectRegistry.aspectResearchProgress;
	}
);



/* quick-access */
var ASPECT = AspectRegistry.aspects;
AspectRegistry.registerAspect(new Aspect("flux").setup({type: 0, power: -1, stability: 0.8, element: "magic"}, {color: {r: 149, g: 35, b: 145}})); 
AspectRegistry.registerAspect(new Aspect("aer").setup({type: 1, power: -0.5, stability: 0.7, element: "air"}, {color: {r: 255, g: 255, b: 200}})); 
AspectRegistry.registerAspect(new Aspect("aqua").setup({type: 2, power: 0.3, stability: 0.5, element: "water"}, {color: {r: 150, g: 200, b: 255}})); 
AspectRegistry.registerAspect(new Aspect("terra").setup({type: 5, power: -0.1, stability: 0.8, element: "life"}, {color: {r: 50, g: 255, b: 0}})); 
AspectRegistry.registerAspect(new Aspect("ignis").setup({type: 9, power: -0.5, stability: 0.4, element: "flame"}, {color: {r: 255, g: 0, b: 0}})); 
AspectRegistry.registerAspect(new Aspect("nitor").setup({type: 20, power: 0.8, stability: 0.8, element: "flame"}, {color: {r: 255, g: 180, b: 0}})); 
AspectRegistry.registerAspect(new Aspect("ordo").setup({type: 9, power: 1, stability: 1, element: "magic", spellID: 1}, {color: {r: 255, g: 255, b: 255}})); 
AspectRegistry.registerAspect(new Aspect("perditio").setup({type: 3, power: 0, stability: 0.63, element: "air", spellID: 1}, {color: {r: 90, g: 87, b: 88}})); 


AspectRegistry.registerAspect(new Aspect("lux").setup({type: 10, power: 0.9, stability: 0.75, element: "flame", spellID: 1}, {color: {r: 255, g: 210, b: 116}}));
AspectRegistry.registerAspect(new Aspect("gelum").setup({type: 11, power: 0.7, stability: 0.98, element: "water", spellID: 1}, {color: {r: 225, g: 254, b: 252}}));
AspectRegistry.registerAspect(new Aspect("motus").setup({type: 10, power: 0.8, stability: 0.68, element: "magic", spellID: 1}, {color: {r: 161, g: 162, b: 192}}));
AspectRegistry.registerAspect(new Aspect("potentia").setup({type: 18, power: 0.9, stability: 0.94, element: "flame", spellID: 1}, {color: {r: 126, g: 196, b: 204}}));
AspectRegistry.registerAspect(new Aspect("saxum").setup({type: 10, power: 0.6, stability: 0.68, element: "magic", spellID: 1}, {color: {r: 108, g: 105, b: 106}}));
AspectRegistry.registerAspect(new Aspect("tempestas").setup({type: 3, power: -0.2, stability: 0.87, element: "air", spellID: 1}, {color: {r: 255, g: 255, b: 255}}));
AspectRegistry.registerAspect(new Aspect("vacous").setup({type: 4, power: 0.5, stability: 0.99, element: "air", spellID: 1}, {color: {r: 94, g: 97, b: 95}}));
AspectRegistry.registerAspect(new Aspect("victus").setup({type: 7, power: 1, stability: 0.75, element: "life", spellID: 1}, {color: {r: 183, g: 10, b: 12}}));
AspectRegistry.registerAspect(new Aspect("bestia").setup({type: 17, power: 0.8, stability: 0.87, element: "life", spellID: 1}, {color: {r: 157, g: 101, b: 4}}));
AspectRegistry.registerAspect(new Aspect("fames").setup({type: 11, power: -0.5, stability: 0.68, element: "life", spellID: 1}, {color: {r: 144, g: 4, b: 5}}));
AspectRegistry.registerAspect(new Aspect("iter").setup({type: 15, power: 0.8, stability: 0.87, element: "magic", spellID: 1}, {color: {r: 226, g: 85, b: 91}}));
AspectRegistry.registerAspect(new Aspect("limus").setup({type: 9, power: -0.6, stability: 0.75, element: "magic", spellID: 1}, {color: {r: 11, g: 243, b: 10}}));
AspectRegistry.registerAspect(new Aspect("metallum").setup({type: 19, power: 0.7, stability: 0.95, element: "magic", spellID: 1}, {color: {r: 176, g: 182, b: 200}}));
AspectRegistry.registerAspect(new Aspect("mortuus").setup({type: 10, power: -0.8, stability: 0.62, element: "life", spellID: 1}, {color: {r: 132, g: 118, b: 133}}));
AspectRegistry.registerAspect(new Aspect("permutatio").setup({type: 12, power: 1, stability: 0.87, element: "air", spellID: 1}, {color: {r: 87, g: 134, b: 88}}));
AspectRegistry.registerAspect(new Aspect("praecantatio").setup({type: 22, power: 1, stability: 0.84, element: "magic", spellID: 1}, {color: {r: 151, g: 2, b: 192}}));
AspectRegistry.registerAspect(new Aspect("sano").setup({type: 14, power: 0.9, stability: 0.68, element: "life", spellID: 1}, {color: {r: 251, g: 46, b: 53}}));
AspectRegistry.registerAspect(new Aspect("tenebrae").setup({type: 14, power: 0.1, stability: 0.78, element: "magic", spellID: 1}, {color: {r: 0, g: 0, b: 0}}));
AspectRegistry.registerAspect(new Aspect("vinculum").setup({type: 13, power: -0.6, stability: 0.75, element: "air", spellID: 1}, {color: {r: 155, g: 112, b: 116}}));
AspectRegistry.registerAspect(new Aspect("vitreus").setup({type: 12, power: 0.65, stability: 0.87, element: "water", spellID: 1}, {color: {r: 57, g: 234, b: 255}}));
AspectRegistry.registerAspect(new Aspect("volatus").setup({type: 11, power: 0.8, stability: 0.69, element: "air", spellID: 1}, {color: {r: 203, g: 185, b: 147}}));
AspectRegistry.registerAspect(new Aspect("alienis").setup({type: 18, power: -0.38, stability: 0.75, element: "magic", spellID: 1}, {color: {r: 131, g: 77, b: 127}}));
AspectRegistry.registerAspect(new Aspect("auram").setup({type: 23, power: 0.675, stability: 0.89, element: "magic", spellID: 1}, {color: {r: 192, g: 141, b: 184}}));
AspectRegistry.registerAspect(new Aspect("corpus").setup({type: 27, power: 0.4, stability: 0.68, element: "life", spellID: 1}, {color: {r: 234, g: 75, b: 142}}));
AspectRegistry.registerAspect(new Aspect("exanimis").setup({type: 20, power: -0.75, stability: 0.78, element: "magic", spellID: 1}, {color: {r: 58, g: 64, b: 2}}));
AspectRegistry.registerAspect(new Aspect("herba").setup({type: 17, power: 0.89, stability: 0.98, element: "life", spellID: 1}, {color: {r: 0, g: 159, b: 41}}));
AspectRegistry.registerAspect(new Aspect("spiritus").setup({type: 17, power: -0.6, stability: 1, element: "life", spellID: 1}, {color: {r: 244, g: 237, b: 227}}));
AspectRegistry.registerAspect(new Aspect("venenum").setup({type: 12, power: -1, stability: 0.74, element: "magic", spellID: 1}, {color: {r: 138, g: 249, b: 0}}));
AspectRegistry.registerAspect(new Aspect("arbor").setup({type: 22, power: 0.85, stability: 0.75, element: "life", spellID: 1}, {color: {r: 88, g: 51, b: 17}}));
AspectRegistry.registerAspect(new Aspect("cognitio").setup({type: 22, power: 1, stability: 0.94, element: "life", spellID: 1}, {color: {r: 253, g: 199, b: 189}}));
AspectRegistry.registerAspect(new Aspect("sensus").setup({type: 18, power: 1, stability: 0.96, element: "air", spellID: 1}, {color: {r: 34, g: 209, b: 230}}));
AspectRegistry.registerAspect(new Aspect("humanus").setup({type: 39, power: 0.85, stability: 0.75, element: "life", spellID: 1}, {color: {r: 254, g: 213, b: 191}}));
AspectRegistry.registerAspect(new Aspect("instrumentum").setup({type: 58, power: 1, stability: 0.85, element: "life", spellID: 1}, {color: {r: 92, g: 0, b: 255}}));
AspectRegistry.registerAspect(new Aspect("lucrum").setup({type: 50, power: 0.12, stability: 0.73, element: "magic", spellID: 1}, {color: {r: 154, g: 137, b: 75}}));
AspectRegistry.registerAspect(new Aspect("messis").setup({type: 51, power: 0.85, stability: 0.75, element: "life", spellID: 1}, {color: {r: 255, g: 198, b: 98}}));
AspectRegistry.registerAspect(new Aspect("perfodio").setup({type: 49, power: 0.75, stability: 0.87, element: "life", spellID: 1}, {color: {r: 220, g: 209, b: 238}}));
AspectRegistry.registerAspect(new Aspect("pannus").setup({type: 75, power: 0.48, stability: 0.72, element: "life", spellID: 1}, {color: {r: 203, g: 185, b: 147}}));
AspectRegistry.registerAspect(new Aspect("telum").setup({type: 61, power: 0.92, stability: 0.68, element: "air", spellID: 1}, {color: {r: 179, g: 88, b: 85}}));
AspectRegistry.registerAspect(new Aspect("tutamen").setup({type: 63, power: 1, stability: 0.9, element: "life", spellID: 1}, {color: {r: 0, g: 193, b: 192}}));
AspectRegistry.registerAspect(new Aspect("meto").setup({type: 90, power: 1, stability: 0.9, element: "life", spellID: 1}, {color: {r: 235, g: 173, b: 134}}));
AspectRegistry.registerAspect(new Aspect("fabrico").setup({type: 97, power: 1, stability: 0.75, element: "life", spellID: 1}, {color: {r: 130, g: 156, b: 127}}));
AspectRegistry.registerAspect(new Aspect("machina").setup({type: 68, power: 1, stability: 0.86, element: "magic", spellID: 1}, {color: {r: 132, g: 121, b: 152}}));

AspectRegistry.addReaction("aqua", "ordo", "gelum")
AspectRegistry.addReaction("aer", "ignis", "lux")
AspectRegistry.addReaction("lux", "ignis", "nitor")
AspectRegistry.addReaction("aer", "ordo", "motus")
AspectRegistry.addReaction("ordo", "ignis", "potentia")
AspectRegistry.addReaction("terra", "terra", "saxum")
AspectRegistry.addReaction("aer", "aqua", "tempestas")
AspectRegistry.addReaction("aer", "perditio", "vacous")
AspectRegistry.addReaction("aqua", "terra", "victus")
AspectRegistry.addReaction("motus", "victus", "bestia")
AspectRegistry.addReaction("victus", "vacous", "fames")
AspectRegistry.addReaction("victus", "terra", "herba")
AspectRegistry.addReaction("motus", "terra", "iter")
AspectRegistry.addReaction("victus", "aqua", "limus")
AspectRegistry.addReaction("saxum", "ordo", "metallum")
AspectRegistry.addReaction("victus", "perditio", "mortuus")
AspectRegistry.addReaction("motus", "aqua", "permutatio")
AspectRegistry.addReaction("vacous", "potentia", "praecantatio")
AspectRegistry.addReaction("victus", "victus", "sano")
AspectRegistry.addReaction("vacous", "lux", "tenebrae")
AspectRegistry.addReaction("motus", "perditio", "vinculum")
AspectRegistry.addReaction("saxum", "aqua", "vitreus")
AspectRegistry.addReaction("aer", "motus", "volatus")
AspectRegistry.addReaction("vacous", "tenebrae", "alienis")
AspectRegistry.addReaction("praecantatio", "aer", "auram")
AspectRegistry.addReaction("mortuus", "bestia", "corpus")
AspectRegistry.addReaction("motus", "mortuus", "exanimis")
AspectRegistry.addReaction("victus", "mortuus", "spiritus")
AspectRegistry.addReaction("aqua", "mortuus", "venenum")
AspectRegistry.addReaction("terra", "herba", "arbor")
AspectRegistry.addReaction("terra", "spiritus", "cognitio")
AspectRegistry.addReaction("aer", "spiritus", "sensus")
AspectRegistry.addReaction("bestia", "cognitio", "humanus")
AspectRegistry.addReaction("humanus", "metallum", "instrumentum")
AspectRegistry.addReaction("humanus", "fames", "lucrum")
AspectRegistry.addReaction("herba", "humanus", "messis")
AspectRegistry.addReaction("humanus", "saxum", "perfodio")
AspectRegistry.addReaction("instrumentum", "bestia", "pannus")
AspectRegistry.addReaction("instrumentum", "perfodio", "telum")
AspectRegistry.addReaction("instrumentum", "terra", "tutamen")
AspectRegistry.addReaction("messis", "humanus", "meto")
AspectRegistry.addReaction("humanus", "instrumentum", "fabrico")
AspectRegistry.addReaction("motus", "instrumentum", "machina")


/*
 * C.P.A.H.b. technologies
*/

var ReactionHelper = {
	/*
	 calculates minor & major reaction output types and finding iteration count for reaction from given source group
	*/
	getReactionParams: function(sourceGroup){
		var params = {
			stability: 1,
			iterations: AspectRegistry.getAspectCount(),
			
			minorType: 99999,
			majorType: 0,
			
			minPower: 1,
			maxPower: -1
		}
		
		for (var i in sourceGroup){
			var aspect = sourceGroup[i].aspect();
			params.majorType += aspect.type;
			if (aspect.type < params.minorType){
				params.minorType = aspect.type;
			}
			params.stability *= aspect.stability;
		}
		
		var minDis = 99999;
		params.minorAspect = null;
		for (var i in sourceGroup){
			var aspect = sourceGroup[i].aspect();
			var dis = Math.abs(aspect.type - params.minorType);
			if (dis < minDis){
				minDis = dis;
				params.minorAspect = aspect;
			}
		}
		
		params.stability = Math.pow(params.stability, 0.5);
		for (var i in sourceGroup){
			var aspect = sourceGroup[i].aspect();
			if (aspect.power - (1 - params.stability) < params.minPower){
				params.minPower = aspect.power - (1 - params.stability);
			}
			if (aspect.power + (1 - params.stability) > params.maxPower){
				params.maxPower = aspect.power + (1 - params.stability);
			}
		}
		
		params.iterations = parseInt(params.iterations * params.stability + 1) * 3;
		params.majorAspect = this.getAspectByType(params.majorType, params);
		return params;
	},
	
	getAspectByType: function(type, params){
		var closest = {
			aspect: null,
			distance: 9999999999
		};
		for (var i = 0; i < params.iterations; i++){
			var aspect = AspectRegistry.getRandomAspect();
			var distance = Math.abs(aspect.type - type);
			if (distance < closest.distance && (aspect.power >= params.minPower && aspect.power <= params.maxPower || closest.aspect == null && i == params.iterations - 1)){
				closest.aspect = aspect;
				closest.distance = distance;
			}
		}
		return closest.aspect;
	}
}

ReactionHelper.majorAspectChance = __config__.access("aura.super_fast_evolution") ? .5 : .05;


function AspectReaction(sourceGroup){
	this.cachedConnections = null;
	
	this.sources = {};
	this.sourceCount = 0;
	
	this.params = null;
	this.result = [];
	
	/* sets aspect sources and calculates result */
	this.setSources = function(sourceGroup){
		if (sourceGroup){
			this.sources = sourceGroup;
			this.params = ReactionHelper.getReactionParams(sourceGroup);
			this.addResult(this.params);
			
			this.sourceCount = 0;
			for (var name in this.sources){
				this.sourceCount++;
			}
		}
	}
	
	/* returns source for given aspect */
	this.getSource = function(aspect){
		return this.sources[aspect.name];
	}
	
	/* adds reaction result object to reaction */
	this.addResult = function(result){
		this.result.push(result.minorAspect);
		if (Math.random() < ReactionHelper.majorAspectChance){
			this.result.push(result.majorAspect);
		}
	}
	
	/* sets reaction lifetime */
	this.speed = 1;
	this.__maxAge = 1;
	this.setMaxAge = function(maxAge){
		this.__maxAge = maxAge;
	}
	/* sets reaction speed (essesne/second) */
	this.setSpeed = function(speed){
		this.speed = speed;
	}
	
	this.setSources(sourceGroup);
	this.position = null;
	
	/* loads reaction at given coords and connects it */
	this.__age = 0;
	this.loadAtCoords = function(coords){
		this.loadAt(coords.x, coords.y, coords.z);
	}
	
	this.loadAt = function(x, y, z){
		this.position = {
			x: x,
			y: y,
			z: z
		};
		this.cachedConnections = Aura.createConnectionCache(x, y, z);
		
		UpdatableAPI.addUpdatable(this);
		this.__age = 0;
		
		//this.debugMessage();
	}
	
	this.update = function(){
		if (this.__age > this.__maxAge){
			this.remove = true;
			return;
		}
		if (this.__age % 30 == 0){
			this.process();
		}
		if (this.__age % 100 == 0){
			this.isVisible = Entity.getDistanceToCoords(Player.get(), this.position) < 32;
		}
		
		if (this.isVisible){
			this.animateBasic();
		}
		
		this.__age++;
	}
	
	/* main reaction logic */
	this.__index = 0;
	
	this.getFromSource = function(amount){
		var fromEach = amount / this.sourceCount;
		var essenceExtracted = 0;
		for (var name in this.sources){
			essenceExtracted += this.sources[name].get(fromEach);
		}
		return essenceExtracted;	
	}
	
	this.process = function(){
		var aspect = this.result[this.__index];
		this.__index = (this.__index + 1) % this.result.length;
		
		var essenceExtracted = this.getFromSource(this.speed);
		Aura.leakEssenceByCache(
			aspect,
			essenceExtracted * 1.28,
			this.cachedConnections
		);
	}
	
	
	
	
	this.parentNode = null;
	this.setParentNode = function(node){
		this.parentNode = node;
	}
	
	this.isVisible = true;
	
	this.animateBasic = function(){
		if (this.__age % 16 == 0 && this.parentNode){
			if (this.parentNode.isVisible && Math.random() < .23){
				ParticleAnimation.FadeBolt.directedBolt(this.parentNode.coords, this.position, 3.2, 3, 2, null, !Aura.doNodeAnimation);
			}
			var aspect = this.result[parseInt(this.result.length * Math.random())];
			if (aspect){
				ParticleAnimation.particleSplash(this.position, {id: 26, data: aspect.getFinalColor()}, {count: 10, gravity: 100, vel: .005});
			}
		}
	}
	
	/* prints debug message */
	this.debugMessage = function(){
		var sourceNames = [];
		var resultNames = [];
		for (var i in this.sources){
			sourceNames.push(this.sources[i].name());
		}
		for (var i in this.result){
			resultNames.push(this.result[i].name);
		}
		Debug.message("reaction (" + this.sourceCount + ", stab: " + parseInt(this.params.stability * 10) / 10 + " |power range: " + [parseInt(this.params.minPower * 10) / 10, parseInt(this.params.maxPower * 10) / 10] + "): " + sourceNames.join(", ") + " -> " + resultNames.join(", "));
	}
}


var INTERACTIVE_ASPECT_AMOUNT = 8;

/*
 * object, thats provides aspect essence storing
*/

function AspectStorage(){
	this.aspectAmounts = {};
	this.aspectNames = [];
	
	/* ------------------------- BASIC ------------------------- */
	/* cleans storage */
	this.clear = function(){
		this.aspectNames.splice(0, this.aspectNames.length);
		for (var name in this.aspectAmounts){
			delete this.aspectAmounts[name];
		}
		this.validate();
	}
	
	/* counts essences */
	this.getCount = function(){
		return this.aspectNames.length;
	}
	
	/* returns random aspect name/aspect object from storage */
	this.getRandomName = function(){
		return this.aspectNames[parseInt(this.aspectNames.length * Math.random())];
	}
	
	this.getRandomAspect = function(){
		return AspectRegistry.getAspect(this.getRandomName());
	}
	
	/* returns if storage has given aspect registred */
	this.hasEssenceByName = function(aspectName){
		return this.aspectAmounts[aspectName] || this.aspectAmounts[aspectName] == 0;
	}
	
	this.hasEssence = function(aspect){
		if (aspect){
			return this.hasEssenceByName(aspect.name);
		}
	}
	
	/* ------------------------- ADD & GET ------------------------- */
	/* adds some amount of given aspect to storage */
	this.addEssenceByName = function(aspectName, amount){
		if (aspectName){
			if (!this.hasEssenceByName(aspectName)){
				this.aspectNames.push(aspectName);
				this.aspectAmounts[aspectName] = 0;
			}
			this.aspectAmounts[aspectName] += amount;
			return true;
		}
		return false;
	}
	
	this.addEssence = function(aspect, amount){
		if (aspect){
			return this.addEssenceByName(aspect.name, amount);
		}
	}
	
	
	/* gets some amount of given aspect from storage */
	this.getEssenceByName = function(aspectName, amount){
		if (aspectName){
			if (this.hasEssenceByName(aspectName)){
				var got = Math.min(this.aspectAmounts[aspectName], amount);
				this.aspectAmounts[aspectName] -= got;
				return got;
			}
			return 0;
		}
		return 0;
	}
	
	this.getEssence = function(aspect, amount){
		if (aspect){
			return this.getEssenceByName(aspect.name, amount);
		}
		return 0;
	}
	
	/* ------------------------- SOURCES ------------------------- */
	/* returns source for given aspect essence, to manipulate with it */
	this.getSource = function(aspectName){
		if (this.hasEssenceByName(aspectName)){
			return {
				__name: aspectName,
				__storage: this,
				
				/* returns aspect name */
				name: function(){
					return this.__name;
				},
				/* returns aspect object */
				aspect: function(){
					return AspectRegistry.getAspect(this.__name);
				},
				/* returns aspect element */
				element: function(){
					return this.aspect().element;
				},
				/* returns parent storage object */
				storage: function(){
					return this.__storage;
				},
				/* adds essence to storage */
				add: function(amount){
					return this.__storage.addEssenceByName(this.__name, amount);
				},
				/* gets some essence from storage, returns amount got */
				get: function(amount){
					return this.__storage.getEssenceByName(this.__name, amount);
				},
				/* returns amount of essence */
				amount: function(){
					return this.__storage.aspectAmounts[this.__name];
				},
			};
		}
	}
	
	/* returns group of sources to given aspects */
	this.getSourceGroup = function(aspectNames){
		var group = {};
		for (var index in aspectNames){
			var source = this.getSource(aspectNames[index]);
			if (source){
				group[aspectNames[index]] = source;
			}
		}
		return group;
	}
	
	/* returns source by index */
	this.byIndex = function(index){
		return this.getSource(this.aspectNames[index]);
	}
	
	/* returns source by index from end */
	this.byIndexEnd = function(index){
		return this.byIndex(this.getCount() - index - 1);
	}
	
	
	/* ------------------------- OTHER ------------------------- */
	/* sorts names array by amounts */
	this.sort = function(reverse){
		var count = this.getCount() - 1;
		for (var i = 0; i < count; i++){
			for (var j = 0; j < count; j++){
				if (this.aspectAmounts[this.aspectNames[i]] > this.aspectAmounts[this.aspectNames[i + 1]] == !reverse){
					var name1 = this.aspectNames[i];
					this.aspectNames[i] = this.aspectNames[i + 1];
					this.aspectNames[i + 1] = name1;
				}
			}
		}
	}
	
	/* reapiring missing data */
	this.validate = function(){
		this.aspectNames = this.aspectNames || [];
		this.aspectAmounts = this.aspectAmounts || {};
		
		for (var i in this.aspectNames){
			var name = this.aspectNames[i];
			if (!AspectRegistry.getAspect(name)){
				this.aspectNames.splice(i--, 1);
				delete this.aspectAmounts[name];
				continue;
			}
			if (!this.aspectAmounts[name]){
				this.aspectAmounts[name] = 0;
			}
		}
	}
	
	
	/* ------------------------- SAVING & READING ------------------------- */
	this.filterLowAmounts = function(){
		var names = [];
		var amounts = {};
		
		for (var i in this.aspectNames){
			var name = this.aspectNames[i];
			if (this.aspectAmounts[name] >= INTERACTIVE_ASPECT_AMOUNT * .5 || name == "flux"){
				names.push(name);
				amounts[name] = this.aspectAmounts[name];
			}
		}
		
		this.aspectNames = names;
		this.aspectAmounts = amounts;
	}
	
	this.save = function(filterLow){
		if (filterLow){
			this.filterLowAmounts();
		}
		return {
			names: this.aspectNames,
			amounts: this.aspectAmounts
		};
	}
	
	this.read = function(data){
		this.aspectNames = data.names;
		this.aspectAmounts = data.amounts;
		this.validate();
	}
	
	this.syncWithTileEntity = function(tileEntity){
		var data = tileEntity.data;
		if (!data.s_aspectNames){
			data.s_aspectNames = [];
		}
		if (!data.s_aspectAmounts){
			data.s_aspectAmounts = {};
		}
		this.aspectNames = data.s_aspectNames;
		this.aspectAmounts = data.s_aspectAmounts;
	}
	
	
	
	/* ------------------------- DEBUG ------------------------- */
	this.getDebugMessage = function(){
		var lines = [];
		for (var i in this.aspectNames){
			lines.push(this.aspectNames[i] + " : " + parseInt(this.aspectAmounts[this.aspectNames[i]] * 100) / 100)
		}
		return lines.join("\n");
	}
}


Callback.addCallback("PostLoaded", function(){
	// БЛОКИ
AspectRegistry.registerAspectsForItem(1, -1, {saxum: 2});
AspectRegistry.registerAspectsForItem(2, -1, {herba: 1, terra: 1});
AspectRegistry.registerAspectsForItem(3, -1, {terra: 2});
AspectRegistry.registerAspectsForItem(4, -1, {perditio: 1, saxum: 1});
AspectRegistry.registerAspectsForItem(5, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(6, -1, {arbor: 1, herba: 2});
AspectRegistry.registerAspectsForItem(7, -1, {perditio: 16, tenebrae: 16, terra: 16, vacous: 16});
AspectRegistry.registerAspectsForItem(8, -1, {aqua: 4});
AspectRegistry.registerAspectsForItem(9, -1, {aqua: 4});
AspectRegistry.registerAspectsForItem(10, -1, {ignis: 3, terra: 1});
AspectRegistry.registerAspectsForItem(11, -1, {ignis: 3, terra: 1});
AspectRegistry.registerAspectsForItem(12, -1, {perditio: 1, terra: 1});
AspectRegistry.registerAspectsForItem(13, -1, {terra: 2});
AspectRegistry.registerAspectsForItem(14, -1, {lucrum: 1, metallum: 2, terra: 1});
AspectRegistry.registerAspectsForItem(15, -1, {metallum: 3, terra: 1});
AspectRegistry.registerAspectsForItem(16, -1, {ignis: 1, potentia: 2, terra: 1});
AspectRegistry.registerAspectsForItem(17, -1, {arbor: 4});
AspectRegistry.registerAspectsForItem(18, -1, {herba: 1});
AspectRegistry.registerAspectsForItem(20, -1, {vitreus: 10});
AspectRegistry.registerAspectsForItem(21, -1, {sensus: 3, terra: 1});
AspectRegistry.registerAspectsForItem(22, -1, {sensus: 6});
AspectRegistry.registerAspectsForItem(23, -1, {arbor: 1, bestia: 1, machina: 1, pannus: 1, perditio: 5, terra: 5});
AspectRegistry.registerAspectsForItem(24, 0, {perditio: 3, terra: 3});
AspectRegistry.registerAspectsForItem(24, 1, {perditio: 3, praecantatio: 1, terra: 2});
AspectRegistry.registerAspectsForItem(24, 2, {perditio: 3, ordo: 1, terra: 2});
AspectRegistry.registerAspectsForItem(25, -1, {aer: 4, arbor: 6, machina: 1, potentia: 1, sensus: 4});
AspectRegistry.registerAspectsForItem(27, -1, {lucrum: 1, machina: 1, metallum: 2, potentia: 1});
AspectRegistry.registerAspectsForItem(28, -1, {machina: 1, metallum: 3, sensus: 1});
AspectRegistry.registerAspectsForItem(29, -1, {arbor: 1, machina: 3, metallum: 2, motus: 7, perditio: 2, terra: 2});
AspectRegistry.registerAspectsForItem(30, -1, {pannus: 1, vinculum: 2});
AspectRegistry.registerAspectsForItem(31, -1, {herba: 1, aer: 1});
AspectRegistry.registerAspectsForItem(32, -1, {herba: 1, perditio: 1});
AspectRegistry.registerAspectsForItem(33, -1, {arbor: 2, machina: 2, metallum: 3, motus: 4, perditio: 3, terra: 3});
AspectRegistry.registerAspectsForItem(35, -1, {fabrico: 1, pannus: 4});
AspectRegistry.registerAspectsForItem(37, -1, {herba: 1, sensus: 1, victus: 1});
AspectRegistry.registerAspectsForItem(38, -1, {herba: 1, sensus: 1, victus: 1});
AspectRegistry.registerAspectsForItem(39, -1, {herba: 1, tenebrae: 1, terra: 1});
AspectRegistry.registerAspectsForItem(40, -1, {herba: 1, tenebrae: 1, ignis: 1});
AspectRegistry.registerAspectsForItem(41, -1, {lucrum: 13, metallum: 27});
AspectRegistry.registerAspectsForItem(42, -1, {metallum: 27});
AspectRegistry.registerAspectsForItem(44, 0, {saxum: 3, terra: 3});
AspectRegistry.registerAspectsForItem(44, 1, {terra: 1, saxum: 1});
AspectRegistry.registerAspectsForItem(44, 3, {saxum: 3, terra: 2});
AspectRegistry.registerAspectsForItem(44, 4, {terra: 1, ignis: 1});
AspectRegistry.registerAspectsForItem(44, 5, {saxum: 4, terra: 4});
AspectRegistry.registerAspectsForItem(44, 6, {saxum: 4, terra: 2, ignis: 2});
AspectRegistry.registerAspectsForItem(44, 7, {potentia: 1, vitreus: 1});
AspectRegistry.registerAspectsForItem(45, -1, {terra: 3, ignis: 3});
AspectRegistry.registerAspectsForItem(46, -1, {perditio: 18, ignis: 15, terra: 3});
AspectRegistry.registerAspectsForItem(47, -1, {arbor: 4, cognitio: 8, pannus: 2});
AspectRegistry.registerAspectsForItem(48, -1, {terra: 1, herba: 1, praecantatio: 1});
AspectRegistry.registerAspectsForItem(49, -1, {terra: 2, ignis: 2, tenebrae: 1});
AspectRegistry.registerAspectsForItem(50, -1, {lux: 1, nitor: 1});
AspectRegistry.registerAspectsForItem(51, -1, {ignis: 5});
AspectRegistry.registerAspectsForItem(53, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(54, -1, {arbor: 6, vacous: 4});
AspectRegistry.registerAspectsForItem(56, -1, {lucrum: 3, terra: 1, vitreus: 3});
AspectRegistry.registerAspectsForItem(57, -1, {lucrum: 27, vitreus: 27});
AspectRegistry.registerAspectsForItem(58, -1, {fabrico: 4});
AspectRegistry.registerAspectsForItem(60, -1, {meto: 2, terra: 1});
AspectRegistry.registerAspectsForItem(61, -1, {ignis: 2, perditio: 6, terra: 6});
AspectRegistry.registerAspectsForItem(62, -1, {ignis: 2});
AspectRegistry.registerAspectsForItem(65, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(66, -1, {iter: 1, metallum: 2});
AspectRegistry.registerAspectsForItem(67, -1, {perditio: 1, terra: 1});
AspectRegistry.registerAspectsForItem(69, -1, {machina: 1});
AspectRegistry.registerAspectsForItem(70, -1, {machina: 1, sensus: 1, terra: 3});
AspectRegistry.registerAspectsForItem(72, -1, {arbor: 1,machina: 1,sensus: 1});
AspectRegistry.registerAspectsForItem(73, -1, {machina: 2, potentia: 2, terra: 1});
AspectRegistry.registerAspectsForItem(76, -1, {machina: 1, potentia: 1});
AspectRegistry.registerAspectsForItem(77, -1, {machina: 1, terra: 1});
AspectRegistry.registerAspectsForItem(78, -1, {gelum: 1});
AspectRegistry.registerAspectsForItem(79, -1, {gelum: 4});
AspectRegistry.registerAspectsForItem(80, -1, {gelum: 3});
AspectRegistry.registerAspectsForItem(81, -1, {aqua: 1, herba: 3, perditio: 1});
AspectRegistry.registerAspectsForItem(82, -1, {aqua: 3, terra: 3});
AspectRegistry.registerAspectsForItem(84, -1, {aer: 4, arbor: 6, lucrum: 3, machina: 2, sensus: 4, vitreus: 3});
AspectRegistry.registerAspectsForItem(85, -1, {arbor: 2});
AspectRegistry.registerAspectsForItem(86, -1, {messis: 2});
AspectRegistry.registerAspectsForItem(87, -1, {ignis: 1, terra: 2});
AspectRegistry.registerAspectsForItem(88, -1, {spiritus: 1, terra: 1, vinculum: 1});
AspectRegistry.registerAspectsForItem(89, -1, {lux: 10, sensus: 3});
AspectRegistry.registerAspectsForItem(90, -1, {ignis: 4, iter: 4});
AspectRegistry.registerAspectsForItem(91, -1, {messis: 1});
AspectRegistry.registerAspectsForItem(95, -1, {vitreus: 1});
AspectRegistry.registerAspectsForItem(96, -1, {arbor: 2, motus: 1});
AspectRegistry.registerAspectsForItem(97, -1, {bestia: 1, terra: 2, vinculum: 1});
AspectRegistry.registerAspectsForItem(98, 0, {terra: 2});
AspectRegistry.registerAspectsForItem(98, 1, {herba: 1, terra: 1});
AspectRegistry.registerAspectsForItem(98, 2, {perditio: 1, terra: 1});
AspectRegistry.registerAspectsForItem(98, 3, {ordo: 1, terra: 1});
AspectRegistry.registerAspectsForItem(99, -1, {herba: 2, tenebrae: 1, terra: 1});
AspectRegistry.registerAspectsForItem(100, -1, {herba: 2, ignis: 1, tenebrae: 1});
AspectRegistry.registerAspectsForItem(101, -1, {metallum: 1});
AspectRegistry.registerAspectsForItem(103, -1, {fames: 6, messis: 2});
AspectRegistry.registerAspectsForItem(106, -1, {herba: 1});
AspectRegistry.registerAspectsForItem(107, -1, {arbor: 4, machina: 1, iter: 1});
AspectRegistry.registerAspectsForItem(108, -1, {terra: 3, ignis: 3});
AspectRegistry.registerAspectsForItem(109, -1, {terra: 2});
AspectRegistry.registerAspectsForItem(110, -1, {terra: 1, herba: 2});
AspectRegistry.registerAspectsForItem(111, -1, {herba: 2, aqua: 1});
AspectRegistry.registerAspectsForItem(112, -1, {terra: 2, ignis: 1});
AspectRegistry.registerAspectsForItem(113, -1, {terra: 1});
AspectRegistry.registerAspectsForItem(114, -1, {terra: 2, ignis: 1});
AspectRegistry.registerAspectsForItem(116, -1, {praecantatio: 8, vitreus: 6, lucrum: 6, terra: 6, ignis: 6, fabrico: 4});
AspectRegistry.registerAspectsForItem(119, -1, {alienis: 4, iter: 4});
AspectRegistry.registerAspectsForItem(120, -1, {alienis: 4, machina: 4, iter: 4});
AspectRegistry.registerAspectsForItem(121, -1, {terra: 1, tenebrae: 1});
AspectRegistry.registerAspectsForItem(122, -1, {alienis: 8, praecantatio: 8, bestia: 8});
AspectRegistry.registerAspectsForItem(123, -1, {lux: 7, potentia: 6, machina: 3, sensus: 2});
AspectRegistry.registerAspectsForItem(125, -1, {terra: 5, perditio: 5, machina: 1, vacous: 1, permutatio: 1, potentia: 1});
AspectRegistry.registerAspectsForItem(126, -1, {metallum: 3, machina: 2});
AspectRegistry.registerAspectsForItem(128, -1, {terra: 3, perditio: 3});
AspectRegistry.registerAspectsForItem(129, -1, {lucrum: 4, vitreus: 3, terra: 1});
AspectRegistry.registerAspectsForItem(131, -1, {sensus: 1, machina: 1, vinculum: 1});
AspectRegistry.registerAspectsForItem(133, -1, {lucrum: 33, vitreus: 27});
AspectRegistry.registerAspectsForItem(134, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(139, -1, {saxum: 3, perditio: 3});
AspectRegistry.registerAspectsForItem(143, -1, {machina: 1});
AspectRegistry.registerAspectsForItem(145, -1, {metallum: 64, fabrico: 2, instrumentum: 2});
AspectRegistry.registerAspectsForItem(146, -1, {arbor: 4, vacous: 3});
AspectRegistry.registerAspectsForItem(147, -1, {metallum: 4, lucrum: 3, machina: 1, sensus: 1});
AspectRegistry.registerAspectsForItem(148, -1, {metallum: 6, machina: 1, sensus: 1});
AspectRegistry.registerAspectsForItem(151, -1, {vitreus: 4, lux: 3, machina: 3, sensus: 2, potentia: 2, arbor: 2});
AspectRegistry.registerAspectsForItem(152, -1, {potentia: 13, machina: 6});
AspectRegistry.registerAspectsForItem(153, -1, {vitreus: 3, terra: 1});
AspectRegistry.registerAspectsForItem(154, -1, {metallum: 15, vacous: 4, arbor: 4, machina: 1, permutatio: 1});
AspectRegistry.registerAspectsForItem(155, -1, {vitreus: 3, potentia: 3});
AspectRegistry.registerAspectsForItem(156, -1, {vitreus: 3, potentia: 3});
AspectRegistry.registerAspectsForItem(158, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(159, -1, {terra: 3, ignis: 1, sensus: 1});
AspectRegistry.registerAspectsForItem(161, -1, {herba: 1});
AspectRegistry.registerAspectsForItem(162, -1, {arbor: 4});
AspectRegistry.registerAspectsForItem(163, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(164, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(165, -1, {limus: 2});
AspectRegistry.registerAspectsForItem(167, -1, {limus: 2});
AspectRegistry.registerAspectsForItem(170, -1, {messis: 13, fames: 6});
AspectRegistry.registerAspectsForItem(171, -1, {pannus: 2});
AspectRegistry.registerAspectsForItem(172, -1, {terra: 4, ignis: 1});
AspectRegistry.registerAspectsForItem(173, -1, {potentia: 13, ignis: 13});
AspectRegistry.registerAspectsForItem(174, -1, {gelum: 3, terra: 1});
AspectRegistry.registerAspectsForItem(175, -1, {herba: 1, aer: 1});
AspectRegistry.registerAspectsForItem(179, 0, {perditio: 3, terra: 3});
AspectRegistry.registerAspectsForItem(179, 1, {perditio: 3, praecantatio: 1, terra: 2});
AspectRegistry.registerAspectsForItem(179, 2, {perditio: 3, ordo: 1, terra: 2});
AspectRegistry.registerAspectsForItem(180, -1, {terra: 3, perditio: 3});
AspectRegistry.registerAspectsForItem(182, 1, {terra: 1, saxum: 1});
AspectRegistry.registerAspectsForItem(183, -1, {arbor: 4, machina: 1, iter: 1});
AspectRegistry.registerAspectsForItem(184, -1, {arbor: 4, machina: 1, iter: 1});
AspectRegistry.registerAspectsForItem(185, -1, {arbor: 4, machina: 1, iter: 1});
AspectRegistry.registerAspectsForItem(186, -1, {arbor: 4, machina: 1, iter: 1});
AspectRegistry.registerAspectsForItem(187, -1, {arbor: 4, machina: 1, iter: 1});
AspectRegistry.registerAspectsForItem(251, -1, {terra: 5, perditio: 5, machina: 1, vacous: 1, permutatio: 1, potentia: 1});
// ПРЕДМЕТЫ
AspectRegistry.registerAspectsForItem(256, -1, {arbor: 1, instrumentum: 3, metallum: 3});
AspectRegistry.registerAspectsForItem(257, -1, {arbor: 1, metallum: 9, perfodio: 3});
AspectRegistry.registerAspectsForItem(258, -1, {arbor: 1, instrumentum: 3, metallum: 9});
AspectRegistry.registerAspectsForItem(259, -1, {ignis: 4, metallum: 3});
AspectRegistry.registerAspectsForItem(260, -1, {fames: 1, messis: 2});
AspectRegistry.registerAspectsForItem(261, -1, {arbor: 2, bestia: 2, pannus: 2, telum: 3, volatus: 1});
AspectRegistry.registerAspectsForItem(262, -1, {telum: 1});
AspectRegistry.registerAspectsForItem(263, 0, {ignis: 2, potentia: 2, saxum: 2});
AspectRegistry.registerAspectsForItem(263, 1, {ignis: 2, potentia: 2, arbor: 2});
AspectRegistry.registerAspectsForItem(264, -1, {lucrum: 4, vitreus: 4});
AspectRegistry.registerAspectsForItem(265, -1, {metallum: 4});
AspectRegistry.registerAspectsForItem(266, -1, {lucrum: 2, metallum: 3});
AspectRegistry.registerAspectsForItem(267, -1, {metallum: 6, telum: 3});
AspectRegistry.registerAspectsForItem(268, -1, {arbor: 2, telum: 1});
AspectRegistry.registerAspectsForItem(269, -1, {arbor: 2, instrumentum: 1});
AspectRegistry.registerAspectsForItem(270, -1, {arbor: 3, perfodio: 1});
AspectRegistry.registerAspectsForItem(271, -1, {arbor: 3, instrumentum: 1});
AspectRegistry.registerAspectsForItem(272, -1, {perditio: 1, telum: 2, terra: 1});
AspectRegistry.registerAspectsForItem(273, -1, {arbor: 1, instrumentum: 2});
AspectRegistry.registerAspectsForItem(274, -1, {arbor: 1, perditio: 2, perfodio: 2, terra: 2});
AspectRegistry.registerAspectsForItem(275, -1, {arbor: 1, instrumentum: 2, perditio: 2, terra: 2});
AspectRegistry.registerAspectsForItem(276, -1, {lucrum: 6, telum: 4, vitreus: 6});
AspectRegistry.registerAspectsForItem(277, -1, {arbor: 1, instrumentum: 4, lucrum: 3, vitreus: 3});
AspectRegistry.registerAspectsForItem(278, -1, {arbor: 1, lucrum: 9, perfodio: 4, vitreus: 9});
AspectRegistry.registerAspectsForItem(279, -1, {arbor: 1, instrumentum: 4, lucrum: 9, vitreus: 9});
AspectRegistry.registerAspectsForItem(280, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(281, -1, {vacous: 1});
AspectRegistry.registerAspectsForItem(282, -1, {fames: 4, herba: 1, tenebrae: 1});
AspectRegistry.registerAspectsForItem(283, -1, {lucrum: 3, metallum: 4, telum: 1});
AspectRegistry.registerAspectsForItem(284, -1, {arbor: 1, instrumentum: 1, lucrum: 1, metallum: 2});
AspectRegistry.registerAspectsForItem(285, -1, {arbor: 1, lucrum: 4, metallum: 6, perfodio: 1});
AspectRegistry.registerAspectsForItem(286, -1, {arbor: 1, instrumentum: 1, lucrum: 4, metallum: 6});
AspectRegistry.registerAspectsForItem(287, -1, {bestia: 1, pannus: 1});
AspectRegistry.registerAspectsForItem(288, -1, {aer: 1, volatus: 2});
AspectRegistry.registerAspectsForItem(289, -1, {ignis: 4, perditio: 4});
AspectRegistry.registerAspectsForItem(290, -1, {arbor: 3, meto: 1});
AspectRegistry.registerAspectsForItem(291, -1, {arbor: 1, meto: 2, perditio: 1, terra: 1});
AspectRegistry.registerAspectsForItem(292, -1, {arbor: 1, metallum: 6, meto: 1});
AspectRegistry.registerAspectsForItem(293, -1, {arbor: 1, lucrum: 6, meto: 4, volatus: 6});
AspectRegistry.registerAspectsForItem(294, -1, {arbor: 1, lucrum: 3, metallum: 4, meto: 1});
AspectRegistry.registerAspectsForItem(295, -1, {herba: 1});
AspectRegistry.registerAspectsForItem(296, -1, {fames: 1, messis: 2});
AspectRegistry.registerAspectsForItem(297, -1, {fames: 2, messis: 4});
AspectRegistry.registerAspectsForItem(298, -1, {fabrico: 1, pannus: 7, tutamen: 1});
AspectRegistry.registerAspectsForItem(299, -1, {fabrico: 6, pannus: 12, tutamen: 3});
AspectRegistry.registerAspectsForItem(300, -1, {fabrico: 5, pannus: 10, tutamen: 2});
AspectRegistry.registerAspectsForItem(301, -1, {fabrico: 3, pannus: 6, tutamen: 1});
AspectRegistry.registerAspectsForItem(302, -1, {metallum: 8, tutamen: 2});
AspectRegistry.registerAspectsForItem(303, -1, {metallum: 12, tutamen: 5});
AspectRegistry.registerAspectsForItem(304, -1, {metallum: 11, tutamen: 4});
AspectRegistry.registerAspectsForItem(305, -1, {metallum: 7, tutamen: 1});
AspectRegistry.registerAspectsForItem(306, -1, {metallum: 15, tutamen: 2});
AspectRegistry.registerAspectsForItem(307, -1, {metallum: 24, tutamen: 6});
AspectRegistry.registerAspectsForItem(308, -1, {metallum: 21, tutamen: 5});
AspectRegistry.registerAspectsForItem(309, -1, {metallum: 12, tutamen: 2});
AspectRegistry.registerAspectsForItem(310, -1, {lucrum: 15, tutamen: 3, volatus: 15});
AspectRegistry.registerAspectsForItem(311, -1, {lucrum: 24, tutamen: 8, volatus: 24});
AspectRegistry.registerAspectsForItem(312, -1, {lucrum: 21, tutamen: 6, volatus: 21});
AspectRegistry.registerAspectsForItem(313, -1, {lucrum: 12, tutamen: 3, volatus: 12});
AspectRegistry.registerAspectsForItem(314, -1, {lucrum: 7, metallum: 11, tutamen: 2});
AspectRegistry.registerAspectsForItem(315, -1, {lucrum: 12, metallum: 18, tutamen: 5});
AspectRegistry.registerAspectsForItem(316, -1, {lucrum: 10, metallum: 15, tutamen: 3});
AspectRegistry.registerAspectsForItem(317, -1, {lucrum: 6, metallum: 9, tutamen: 1});
AspectRegistry.registerAspectsForItem(318, -1, {instrumentum: 1, terra: 1});
AspectRegistry.registerAspectsForItem(319, -1, {bestia: 1, corpus: 3, victus: 1});
AspectRegistry.registerAspectsForItem(320, -1, {corpus: 3, fabrico: 1, fames: 3});
AspectRegistry.registerAspectsForItem(321, -1, {arbor: 6, pannus: 3});
AspectRegistry.registerAspectsForItem(322, -1, {lucrum: 12, messis: 1, metallum: 18, praecantatio: 2, sano: 4});
AspectRegistry.registerAspectsForItem(323, -1, {arbor: 1});
AspectRegistry.registerAspectsForItem(324, -1, {arbor: 4, machina: 1, motus: 1});
AspectRegistry.registerAspectsForItem(325, 0, {metallum: 8, vacous: 1});
AspectRegistry.registerAspectsForItem(325, 1, {aqua: 2, fames: 2, metallum: 8, sano: 2, vacous: 1});
AspectRegistry.registerAspectsForItem(325, 8, {aqua: 4, metallum: 8, vacous: 1});
AspectRegistry.registerAspectsForItem(325, 10, {ignis: 4, metallum: 8, terra: 1, vacous: 1});
AspectRegistry.registerAspectsForItem(328, -1, {iter: 4, machina: 2, metallum: 15});
AspectRegistry.registerAspectsForItem(329, -1, {bestia: 2, iter: 3, panno: 3});
AspectRegistry.registerAspectsForItem(330, -1, {machina: 2, metallum: 18, motus: 1});
AspectRegistry.registerAspectsForItem(331, -1, {machina: 1, potentia: 2});
AspectRegistry.registerAspectsForItem(332, -1, {gelum: 1});
AspectRegistry.registerAspectsForItem(333, -1, {aqua: 4, arbor: 3, iter: 4});
AspectRegistry.registerAspectsForItem(334, -1, {bestia: 1, pannus: 2, tutamen: 1});
AspectRegistry.registerAspectsForItem(335, -1, {aqua: 2, fames: 2, metallum: 8, sano: 2, vacous: 1});
AspectRegistry.registerAspectsForItem(336, -1, {ignis: 1, terra: 1});
AspectRegistry.registerAspectsForItem(337, -1, {aqua: 1, terra: 1});
AspectRegistry.registerAspectsForItem(338, -1, {aer: 1, aqua: 1, herba: 1});
AspectRegistry.registerAspectsForItem(339, -1, {cognitio: 1});
AspectRegistry.registerAspectsForItem(340, -1, {cognitio: 3, pannus: 1});
AspectRegistry.registerAspectsForItem(341, -1, {limus: 2});
AspectRegistry.registerAspectsForItem(342, -1, {arbor: 4, metallum: 11, vacous: 3});
AspectRegistry.registerAspectsForItem(343, -1, {ignis: 1, metallum: 11, perditio: 4, terra: 4});
AspectRegistry.registerAspectsForItem(344, -1, {bestia: 1, limus: 1, victus: 1});
AspectRegistry.registerAspectsForItem(345, -1, {metallum: 12, potentia: 1});
AspectRegistry.registerAspectsForItem(346, -1, {aqua: 1, arbor: 2, bestia: 1, instrumentum: 1, pannus: 1});
AspectRegistry.registerAspectsForItem(347, -1, {lucrum: 6, machina: 2, metallum: 9, perditio: 1});
AspectRegistry.registerAspectsForItem(348, -1, {lux: 2, sensus: 1});
AspectRegistry.registerAspectsForItem(349, -1, {aqua: 1, corpus: 3, victus: 1});
AspectRegistry.registerAspectsForItem(350, -1, {corpus: 4, fabrico: 1, fames: 3});
AspectRegistry.registerAspectsForItem(351, -1, {sensus: 1});
AspectRegistry.registerAspectsForItem(352, -1, {corpus: 1, mortuus: 2});
AspectRegistry.registerAspectsForItem(353, -1, {fames: 1});
AspectRegistry.registerAspectsForItem(354, -1, {aqua: 4, fames: 4, victus: 4});
AspectRegistry.registerAspectsForItem(356, -1, {arbor: 2, fabrico: 2, pannus: 9});
AspectRegistry.registerAspectsForItem(357, -1, {potentia: 3, terra: 4});
AspectRegistry.registerAspectsForItem(358, -1, {cognitio: 8, iter: 5});
AspectRegistry.registerAspectsForItem(359, -1, {fames: 1});
AspectRegistry.registerAspectsForItem(360, -1, {metallum: 6, meto: 3});
AspectRegistry.registerAspectsForItem(361, -1, {herba: 1});
AspectRegistry.registerAspectsForItem(362, -1, {herba: 1});
AspectRegistry.registerAspectsForItem(363, -1, {bestia: 1, corpus: 4, victus: 2});
AspectRegistry.registerAspectsForItem(364, -1, {corpus: 4, fabrico: 1, fames: 4});
AspectRegistry.registerAspectsForItem(365, -1, {bestia: 1, corpus: 3, victus: 2});
AspectRegistry.registerAspectsForItem(366, -1, {corpus: 4, fabrico: 1, fames: 3});
AspectRegistry.registerAspectsForItem(367, -1, {corpus: 2, humanus: 1});
AspectRegistry.registerAspectsForItem(368, -1, {alienis: 4, iter: 4, praecantatio: 2});
AspectRegistry.registerAspectsForItem(369, -1, {ignis: 4, praecantatio: 2});
AspectRegistry.registerAspectsForItem(370, -1, {aqua: 1, exanimis: 4, spiritus: 4});
AspectRegistry.registerAspectsForItem(371, -1, {metallum: 1});
AspectRegistry.registerAspectsForItem(372, -1, {herba: 1, praecantatio: 1});


// POTIONS
AspectRegistry.registerAspectsForItem(373, 0, {aqua: 1, vitreus: 1}); // water bottle
AspectRegistry.registerAspectsForItem(373, 4, {aqua: 1}); // awkward
AspectRegistry.registerAspectsForItem(373, 3, {aqua: 1}); // thick
AspectRegistry.registerAspectsForItem(373, 2, {aqua: 1}); // mudane (ext)
AspectRegistry.registerAspectsForItem(373, 1, {aqua: 1}); // mudane

AspectRegistry.registerAspectsForItem(373, 28, {aqua: 1, praecantatio: 2, sano: 3}); // regen 1
AspectRegistry.registerAspectsForItem(373, 29, {aqua: 1, praecantatio: 2, sano: 3}); // regen T
AspectRegistry.registerAspectsForItem(373, 30, {aqua: 1, praecantatio: 4, sano: 6}); // regen 2
AspectRegistry.registerAspectsForItem(373, 14, {aqua: 1, motus: 3, praecantatio: 2}); // swiftness 1
AspectRegistry.registerAspectsForItem(373, 16, {aqua: 1, motus: 6, praecantatio: 4}); // swiftness 2 
AspectRegistry.registerAspectsForItem(373, 15, {aqua: 1, motus: 3, praecantatio: 2}); // swiftness T
AspectRegistry.registerAspectsForItem(373, 25, {aqua: 1, praecantatio: 2, venenum: 4}); // poison 1
AspectRegistry.registerAspectsForItem(373, 27, {aqua: 1, praecantatio: 4, venenum: 6}); // poison 2
AspectRegistry.registerAspectsForItem(373, 26, {aqua: 1, praecantatio: 2, venenum: 4}); // posion T
AspectRegistry.registerAspectsForItem(373, 21, {aqua: 1, praecantatio: 2, sano: 3}); // heal 1
AspectRegistry.registerAspectsForItem(373, 22, {aqua: 1, praecantatio: 4, sano: 6}); // heal 2 
AspectRegistry.registerAspectsForItem(373, 31, {aqua: 1, praecantatio: 2, telum: 3}); // strength 1 
AspectRegistry.registerAspectsForItem(373, 33, {aqua: 1, praecantatio: 4, telum: 6}); // strength 2
AspectRegistry.registerAspectsForItem(373, 32, {aqua: 1, praecantatio: 2, telum: 4}); // strength T
AspectRegistry.registerAspectsForItem(373, 17, {aqua: 1, praecantatio: 2, vinculum: 3}); // slowness 1
AspectRegistry.registerAspectsForItem(373, 18, {aqua: 1, praecantatio: 2, vinculum: 4}); // slowness 2
AspectRegistry.registerAspectsForItem(373, 9, {aqua: 1, motus: 3, praecantatio: 2}); // leap 1
AspectRegistry.registerAspectsForItem(373, 11, {aqua: 1, praecantatio: 4, motus: 6}); // leap 2
AspectRegistry.registerAspectsForItem(373, 10, {aqua: 1, motus: 4, praecantatio: 2}); // leap T
AspectRegistry.registerAspectsForItem(373, 23, {aqua: 1, mortuus: 3, praecantatio: 2}); // harm 1
AspectRegistry.registerAspectsForItem(373, 24, {aqua: 1, mortuus: 6, praecantatio: 4}); // harm 2

AspectRegistry.registerAspectsForItem(373, 12, {aqua: 1, ignis: 2, praecantatio: 2, tutamen: 1}); // fire res
AspectRegistry.registerAspectsForItem(373, 13, {aqua: 1, ignis: 3, praecantatio: 2, tutamen: 2}); // fire res T
AspectRegistry.registerAspectsForItem(373, 19, {aer: 3, aqua: 1, praecantatio: 2}); // water breath 
AspectRegistry.registerAspectsForItem(373, 20, {aer: 4, aqua: 1, praecantatio: 2}); // water breath T
AspectRegistry.registerAspectsForItem(373, 7, {aqua: 1, praecantatio: 2, sensus: 3});  // invis
AspectRegistry.registerAspectsForItem(373, 8, {aqua: 1, praecantatio: 2, sensus: 4}); // invis T
AspectRegistry.registerAspectsForItem(373, 5, {aqua: 1, praecantatio: 2, sensus: 3}); // night vision 
AspectRegistry.registerAspectsForItem(373, 6, {aqua: 1, praecantatio: 2, sensus: 4}); // night vision T
AspectRegistry.registerAspectsForItem(373, 34, {aqua: 1, mortuus: 3, praecantatio: 2}); // weakness 
AspectRegistry.registerAspectsForItem(373, 35, {aqua: 1, mortuus: 6, praecantatio: 4}); // weakness T

// explosive
AspectRegistry.registerAspectsForItem(438, 28, {aqua: 1, praecantatio: 2, sano: 3, perditio: 2}); // regen 1
AspectRegistry.registerAspectsForItem(438, 29, {aqua: 1, praecantatio: 2, sano: 3, perditio: 2}); // regen T
AspectRegistry.registerAspectsForItem(438, 30, {aqua: 1, praecantatio: 4, sano: 6, perditio: 2}); // regen 2
AspectRegistry.registerAspectsForItem(438, 14, {aqua: 1, motus: 3, praecantatio: 2, perditio: 2}); // swiftness 1
AspectRegistry.registerAspectsForItem(438, 16, {aqua: 1, motus: 6, praecantatio: 4, perditio: 2}); // swiftness 2 
AspectRegistry.registerAspectsForItem(438, 15, {aqua: 1, motus: 3, praecantatio: 2, perditio: 2}); // swiftness T
AspectRegistry.registerAspectsForItem(438, 25, {aqua: 1, praecantatio: 2, venenum: 4, perditio: 2}); // poison 1
AspectRegistry.registerAspectsForItem(438, 27, {aqua: 1, praecantatio: 4, venenum: 6, perditio: 2}); // poison 2
AspectRegistry.registerAspectsForItem(438, 26, {aqua: 1, praecantatio: 2, venenum: 4, perditio: 2}); // posion T
AspectRegistry.registerAspectsForItem(438, 21, {aqua: 1, praecantatio: 2, sano: 3, perditio: 2}); // heal 1
AspectRegistry.registerAspectsForItem(438, 22, {aqua: 1, praecantatio: 4, sano: 6, perditio: 2}); // heal 2 
AspectRegistry.registerAspectsForItem(438, 31, {aqua: 1, praecantatio: 2, telum: 3, perditio: 2}); // strength 1 
AspectRegistry.registerAspectsForItem(438, 33, {aqua: 1, praecantatio: 4, telum: 6, perditio: 2}); // strength 2
AspectRegistry.registerAspectsForItem(438, 32, {aqua: 1, praecantatio: 2, telum: 4, perditio: 2}); // strength T
AspectRegistry.registerAspectsForItem(438, 17, {aqua: 1, praecantatio: 2, vinculum: 3, perditio: 2}); // slowness 1
AspectRegistry.registerAspectsForItem(438, 18, {aqua: 1, praecantatio: 2, vinculum: 4, perditio: 2}); // slowness 2
AspectRegistry.registerAspectsForItem(438, 9, {aqua: 1, motus: 3, praecantatio: 2, perditio: 2}); // leap 1
AspectRegistry.registerAspectsForItem(438, 11, {aqua: 1, praecantatio: 4, motus: 6, perditio: 2}); // leap 2
AspectRegistry.registerAspectsForItem(438, 10, {aqua: 1, motus: 4, praecantatio: 2, perditio: 2}); // leap T
AspectRegistry.registerAspectsForItem(438, 23, {aqua: 1, mortuus: 3, praecantatio: 2, perditio: 2}); // harm 1
AspectRegistry.registerAspectsForItem(438, 24, {aqua: 1, mortuus: 6, praecantatio: 4, perditio: 2}); // harm 2

AspectRegistry.registerAspectsForItem(438, 12, {aqua: 1, ignis: 2, praecantatio: 2, tutamen: 1, perditio: 2}); // fire res
AspectRegistry.registerAspectsForItem(438, 13, {aqua: 1, ignis: 3, praecantatio: 2, tutamen: 2, perditio: 2}); // fire res T
AspectRegistry.registerAspectsForItem(438, 19, {aer: 3, aqua: 1, praecantatio: 2, perditio: 2}); // water breath 
AspectRegistry.registerAspectsForItem(438, 20, {aer: 4, aqua: 1, praecantatio: 2, perditio: 2}); // water breath T
AspectRegistry.registerAspectsForItem(438, 7, {aqua: 1, praecantatio: 2, sensus: 3, perditio: 2});  // invis
AspectRegistry.registerAspectsForItem(438, 8, {aqua: 1, praecantatio: 2, sensus: 4, perditio: 2}); // invis T
AspectRegistry.registerAspectsForItem(438, 5, {aqua: 1, praecantatio: 2, sensus: 3, perditio: 2}); // night vision 
AspectRegistry.registerAspectsForItem(438, 6, {aqua: 1, praecantatio: 2, sensus: 4, perditio: 2}); // night vision T
AspectRegistry.registerAspectsForItem(438, 34, {aqua: 1, mortuus: 3, praecantatio: 2, perditio: 2}); // weakness 
AspectRegistry.registerAspectsForItem(438, 35, {aqua: 1, mortuus: 6, praecantatio: 4, perditio: 2}); // weakness T


AspectRegistry.registerAspectsForItem(374, -1, {vacous: 1});
AspectRegistry.registerAspectsForItem(375, -1, {bestia: 2, sensus: 2, venenum: 2});
AspectRegistry.registerAspectsForItem(376, -1, {bestia: 1, sensus: 1, venenum: 1});
AspectRegistry.registerAspectsForItem(377, -1, {ignis: 1});
AspectRegistry.registerAspectsForItem(378, -1, {limus: 1});
AspectRegistry.registerAspectsForItem(379, -1, {fabrico: 2, ignis: 3, praecantatio: 1});
AspectRegistry.registerAspectsForItem(380, -1, {metallum: 21});
AspectRegistry.registerAspectsForItem(381, -1, {alienis: 3, iter: 3, praecantatio: 1, sensus: 4});
AspectRegistry.registerAspectsForItem(382, -1, {metallum: 6});
AspectRegistry.registerAspectsForItem(385, -1, {ignis: 1, perditio: 1});
AspectRegistry.registerAspectsForItem(388, -1, {lucrum: 5, vitreus: 4});
AspectRegistry.registerAspectsForItem(389, -1, {arbor: 8, pannus: 1});
AspectRegistry.registerAspectsForItem(390, -1, {terra: 2, ignis: 2, vacous: 1, herba: 1});
AspectRegistry.registerAspectsForItem(391, -1, {});
AspectRegistry.registerAspectsForItem(392, -1, {});
AspectRegistry.registerAspectsForItem(393, -1, {});
AspectRegistry.registerAspectsForItem(394, -1, {});
AspectRegistry.registerAspectsForItem(395, -1, {});
AspectRegistry.registerAspectsForItem(396, -1, {});
AspectRegistry.registerAspectsForItem(397, -1, {});
AspectRegistry.registerAspectsForItem(398, -1, {});
AspectRegistry.registerAspectsForItem(400, -1, {});
AspectRegistry.registerAspectsForItem(403, -1, {});
AspectRegistry.registerAspectsForItem(404, -1, {});
AspectRegistry.registerAspectsForItem(405, -1, {});
AspectRegistry.registerAspectsForItem(406, -1, {});
AspectRegistry.registerAspectsForItem(407, -1, {});
AspectRegistry.registerAspectsForItem(408, -1, {});
AspectRegistry.registerAspectsForItem(410, -1, {});
AspectRegistry.registerAspectsForItem(411, -1, {});
AspectRegistry.registerAspectsForItem(412, -1, {});
AspectRegistry.registerAspectsForItem(413, -1, {});
AspectRegistry.registerAspectsForItem(414, -1, {});
AspectRegistry.registerAspectsForItem(415, -1, {});
AspectRegistry.registerAspectsForItem(416, -1, {});
AspectRegistry.registerAspectsForItem(417, -1, {});
AspectRegistry.registerAspectsForItem(418, -1, {});
AspectRegistry.registerAspectsForItem(420, -1, {});
AspectRegistry.registerAspectsForItem(421, -1, {});
AspectRegistry.registerAspectsForItem(422, -1, {});
AspectRegistry.registerAspectsForItem(424, -1, {});

AspectRegistry.registerAspectsForItem(466, -1, {lucrum: 64, messis: 1, metallum: 64, praecantatio: 4, sano: 8});


	
	// thaum
	AspectRegistry.registerAspectsForItem(IDData.item.itemCrystalOrdo, -1, {praecantatio: 2, ordo: 5});
	AspectRegistry.registerAspectsForItem(IDData.item.itemCrystalAer, -1, {praecantatio: 2, aer: 5});
	AspectRegistry.registerAspectsForItem(IDData.item.itemCrystalIgnis, -1, {praecantatio: 2, ignis: 5});
	AspectRegistry.registerAspectsForItem(IDData.item.itemCrystalAqua, -1, {praecantatio: 2, aqua: 5});
	AspectRegistry.registerAspectsForItem(IDData.item.itemCrystalTerra, -1, {praecantatio: 2, terra: 5});
	AspectRegistry.registerAspectsForItem(IDData.item.itemCrystalDark, -1, {praecantatio: 2, flux: 5});

	AspectRegistry.registerAspectsForItem(IDData.item.itemAuramEssence, -1, {auram: 4});
	AspectRegistry.registerAspectsForItem(IDData.item.itemFluxEssence, -1, {flux: 4});
	AspectRegistry.registerAspectsForItem(IDData.item.positivePowerCrystal, -1, {auram: 20, ordo: 10});
	AspectRegistry.registerAspectsForItem(IDData.item.negativePowerCrystal, -1, {flux: 10, ordo: 5});
});



/*
 spell seed is 2d array
 [
	[1, 2, 3, ...],
	[4, 5, 6, ...],
	...
 ]
 
 
*/

function Spell(seed){
	this.seed = seed;
	
	this.projectiles = [];
	
	
	
	this.addProjectile = function(projectile){
		this.projectiles.push(projectile);
		projectile.setSeed(this.seed);
	}
	
	// debug
	this.addProjectile(new SpellProjectile(this));
	
	this.update = function(){
		for (var i in this.projectiles){
			this.projectiles[i].update();
		}
	}
	
	this.loadAt = function(coords, rotation){
		for (var i in this.projectiles){
			this.projectiles[i].loadAt(coords, rotation);
		}
		UpdatableAPI.addUpdatable(this);
	}
}

Callback.addCallback("ItemUse", function(coords, item, block){
	if (item.id == 264){
		var spell = new Spell(
			[Math.random() * 10, Math.random() * 10, Math.random() * 10, 19, 8, 38, 11]
		);
		//spell.loadAt({x: coords.relative.x + .5, y: coords.relative.y + .5, z: coords.relative.z + .5} , null);
	}
});


function SpellProjectile(spell){
	this.spell = spell;
	
	this.setSeed = function(seed){
		this.seed = seed;
	}
	
	this.speed = 64;
	
	this.update = function(){
		for (var i = 0; i < this.speed; i++){
			SpellRenderHelper.renderProjectile(this, this.position++);
		}
	}
	
	this.loadAt = function(coords, rotation){
		this.trajectory = new SpellTrajectory(this.seed);
		this.trajectory.build();
		this.trajectory.convert(coords, rotation);
		this.position = 0;
	}
}



function SpellTrajectory(seed){
	this.rawPath = [];
	this.realPath = [];
	
	this.setSeed = function(seed){
		this.seed = seed;
		this.trajectorySeed = [];
		for (var i in this.seed){
			this.trajectorySeed[i] = 0;
			for (var j in this.seed){
				if (i != j && (this.seed[i] % this.seed[j] == 0)){
					this.trajectorySeed[i] = this.seed[i] / this.seed[j]; 
					break;
				}
			}
		}
		
	}
	
	this.setSeed(seed);
	
	this.getStart = function(){
		return this.rawPath[0] || {x: 0, y: 0, z: 0};
	}
	
	this.getEnd = function(){
		return this.rawPath[this.rawPath.length - 1] || {x: 0, y: 0, z: 0};
	}
	
	this.push = function(coords){
		this.rawPath.push(coords);
	}
	
	this.PERIOD = 16;
	
	this.build = function(){
		var speed = .2;
		var dir = {
			yaw: 0,
			pitch: 0.001
		};
		var acc = {
			yaw: 0,
			pitch: 0
		}
		
		var step = function(x){
			x = Math.floor(x * Math.PI);
			return Math.pow(Math.sin(x), 1);
		}
		
		var ITERATIONS = 256;
		
		for (var i = 0; i < ITERATIONS; i++){
			var coords = this.getEnd();
			
			var index = parseInt(i / this.PERIOD) % this.trajectorySeed.length
			
			if (i % this.trajectorySeed.length == 0){
				acc.yaw = 0;
			}
			var value = this.seed[index];	
			
			var coords2 = {
				x: coords.x + Math.sin(dir.yaw) * Math.cos(dir.pitch) * speed,
				y: coords.y + Math.sin(dir.pitch),
				z: coords.z + Math.cos(dir.yaw) * Math.cos(dir.pitch) * speed
			}
			
			dir.yaw += acc.yaw;
			dir.pitch += acc.pitch;
			
			var value = 0;
			for (var j in this.seed){
				var k = Math.pow(2, j);
				value += step(Math.floor(this.seed[j]) + i / ITERATIONS * k) / k;
				break;
			}		
			acc.yaw = value / 20;
			
			this.push({
				x: coords.x,
				y: value,
				z: i * .05
			});
			//this.push(coords2);
		}
	} 
	
	this.convert = function(start, rotation){
		this.realPath = [];
		for (var i in this.rawPath){
			var coords = this.rawPath[i];
			this.realPath[i] = {
				x: start.x + coords.x,
				y: start.y + coords.y,
				z: start.z + coords.z,
			};
		}
	}
}


var SpellRenderHelper = {
	renderProjectile: function(projectile, position){
		if (projectile.trajectory){
			var coords1 = projectile.trajectory.realPath[position];
			var coords2 = projectile.trajectory.realPath[position + 1];
			if (coords1 && coords2){
				Particles.line(31, coords1, coords2, .04);
			}
		}
	}
}


var RESEARCH_PROGRESS_MULTIPLIER = .5;

var ResearchRegistry = {
	researches: {},
	uniqueID: 1,
	
	registerResearch: function(name, research){
		research.progress = {};
		research.name = name;
		research.uniqueID = this.uniqueID++;
		if (!research.aspectNames){
			research.aspectNames = [];
		}
		if (!research.aspectAmounts){
			research.aspectAmounts = {};
		}
		if (!research.coords){
			research.coords = {x: 0, y: 0};
		}
		if (!research.icon){
			research.icon = "aspectIcon_unknown";
		}
		this.researches[name] = research;
	},
	
	getResearch: function(name){
		return this.researches[name];
	},
	
	getResearchParent: function(research){
		if (research.parent){
			return this.getResearch(research.parent);
		}
	},
	
	isResearched: function(name){
		var research = this.getResearch(name);
		if (research){
			if (research.isBasic){
				return true;
			}
			for (var i in research.aspectNames){
				if (!research.progress[research.aspectNames[i]] || research.progress[research.aspectNames[i]] < 1){
					return false;
				}
			}
			return true;
		}
		return false;
	},
	
	setResearched: function(name){
		var research = this.getResearch(name);
		if (research){
			if (research.isBasic){
				return;
			}
			for (var i in research.aspectNames){
				research.progress[research.aspectNames[i]] = 1;
			}
		}
	},
	
	isVisible: function(name){
		var research = this.getResearch(name);
		if (research){
			if (research.parent){
				return this.isResearched(research.parent);
			}
			else{
				return true;
			}
		}
	},
	
	getAll: function(){
		return this.researches;
	},
	
	getAllVisible: function(){
		var visible = [];
		for (var name in this.researches){
			if (this.isVisible(name)){
				visible.push(this.researches[name]);
			}
		}
		return visible;
	},
	
	getResearchPosition: function(research){
		for (var i in research.aspectNames){
			var amount = research.progress[research.aspectNames[i]];
			if (!amount || amount < 1){
				return i;
			}
		}
		return research.aspectNames.length - 1;
	},
	
	
	
	getAspectAtPosition: function(research, position){
		return research.aspectNames[position];
	},
	
	advanceResearch: function(research, position, amount){
		var aspectName = this.getAspectAtPosition(research, position);
		research.progress[aspectName] = Math.min(1, (research.progress[aspectName] || 0) + amount / research.aspectAmounts[aspectName] * RESEARCH_PROGRESS_MULTIPLIER);
	},
	
	isResearchPositionComplete: function(research, position){
		return research.progress[research.aspectNames[position]] >= 1;
	},
	
	
	
	
	
	giveResearchPageToPlayer: function(research){
		if (research.uniqueID){
			Player.getInventory().addItem(IDData.item.itemResearchBookPage, 1, research.uniqueID);
		}
	},
	
	getResearchByID: function(id){
		for (var name in this.researches){
			if (this.researches[name].uniqueID == id){
				return this.researches[name];
			}
		}
		return null;
	}
}

Saver.addSavesScope("ThaumcraftResearches",
	function read(scope){
		for (var name in scope){
			var research = ResearchRegistry.getResearch(name);
			if (research){
				research.progress = scope[name];
			}
		}
	},
	
	function save(){
		var scope = {};
		for (var name in ResearchRegistry.researches){
			scope[name] = ResearchRegistry.getResearch(name).progress;
		}
		return scope;
	}
);










ResearchRegistry.registerResearch("aspects theory", {
	icon: "research_aspects",
	coords: {
		x: 200,
		y: 100
	},
	isBasic: true,
	title: "Aspects",
	aspectNames: ["aer", "aqua", "terra", "ignis", "ordo", "perditio", "flux"],
	aspectAmounts:  {aer: 1, aqua: 2, terra: 3, ignis: 4, ordo: 5, perditio: 6, flux: 7},
	description: 'Все предметы в этом мире обладают магическим потенциалом и содержат различные аспекты, которые вы сможете исследовать, выделять и использовать в различных магичных целях. Самые сильные источники аспектов - это кристаллы, которые вы можете добыть из руд под землей, однако, чтобы вы могли понять аспект и использовать его, его нужно исследовать. \nАспекты изучаются с помощью комбинирования других аспектов, начиная с базовых аспектов, которые известны вам с самого начала, они перечислены справа. Для исследования новых вам нужно создать реактор аспектов, после чего положить в него 2 различных предмета и попробовать скомбинировать 2 аспекта, которые в них содержатся. Если под стеклом появился знак вопроса, то вы нашли комбинацию аспектов, с помощью которой сможете открыть что-то новое, исследуйте аспект, нажимая на знак вопроса и тратя предметы.\nНиже показан крафт реактора аспектов:{"type":"craft","x":10,"y":500,"id":"BlockID.blockAspectReactor","data":0}'
})


ResearchRegistry.registerResearch("aura theory", {
	icon: "research_nodes",
	coords: {
		x: 500,
		y: 150
	},
	isBasic: true,
	title: "Aura",
	description: 'Как только вы попали в этот мир, вы почувствовали, что он пронизан магией, и вы не ошиблись. В мире достаточно часто встречаются узлы ауры, которые и являются источниками этой магии, никто не знает их природу, но они питают энергии этот мир уже очень давно. Каждый узел ауры содержит набор эссенций разных аспектов, которые взаимодействуют между собой, влияют на другие узлы и на мир вокруг них. Это влияние может быть как положительным, так и отрицательным. \nУзлы ауры можно найти по слабому свечению и искрам низко над землей, однако в будущем вы сможете искать узлы гораздо легче, когда изобретете специальные очки. А пока найдите узел, а лучше несколько, и обоснуйтесь рядом с ним, его энергия вам очень пригодится.{"type":"bitmap","x":10,"y":450,"bitmap":"aura_node_guide","scale":1.5}'
});


ResearchRegistry.registerResearch("basic magic", {
	icon: "research_magic",
	coords: {
		x: 850,
		y: 120
	},
	isBasic: true,
	title: "Magic craft",
	minWinWidth: 1500,
	description: 'Исследуя эту ветку вы сможете создавать магические предметы на специальном верстаке, начните с создания стола исследований, для этого вам понадобится 2 обычных стола и перо, поставьте два стола рядом так, чтобы они объединились в один, а дальше поставьте на один из них поставьте письменные инструменты.\nДля исследования чего либо получите свиток с исследованием из тауманомикона, нажав кнопку с пером около названия. Полученный свиток положите в малый слот стола исследований, после чего появится прогресс исследования, в большой слот кладите предметы, которые содержат аспекты, нужные для текущей стадии. После завершения всех стадий предмет считается исследованым и вы можете создать его, а так же перейти дальше по ветке исследований.{"type":"craft","x":10,"y":500,"id":"BlockID.blockThaumTable","data":0} {"type":"craft","x":10,"y":820,"id":"ItemID.itemScribingTools","data":0}'
});




ResearchRegistry.registerResearch("alchemy", {
	parent: "aspects theory",
	icon: "research_alchemy",
	coords: {
		x: 100,
		y: 300
	},
	aspectNames: ["perditio", "praecantatio", "metallum"],
	aspectAmounts: {praecantatio: 7, perditio: 5, metallum: 3},
	title: "Alchemy",
	description: 'Чтобы сделать тигель, нужно использовать волшебную палочку на котле. Тигель - важный инструмент тауматурга. Он позволяет расщеплять объекты на их аспекты и эссенцию, а так же использовать их в своих нуждах. Для работы под тиглем должен стоять источникок тепла, а в нем должна быть вода. Когда вода начнет кипеть - просто закиньте в тигель предметы, которые Вы хотите разложить и они будут сразу превращены в эссенцию. Если формула составлена верно и в нем находится нужная эссенция, то Вы можете бросить в него Активатор. Активатор забирает эссенцию и трансформируется в нужный предмет, который затем выпрыгивает из тигля. Вся оставшаяся в котле эссенция выбрасывается в ауру. Создание предмета забирает воду из тигеля и Вам придется его снова наполнять. Вместе с тратой ресурсов, вышедшая эссенция может устроить непредвиденные последствия.'
});

ResearchRegistry.registerResearch("nitor", {
	parent: "alchemy",
	icon: "research_nitor",
	coords: {
		x: 240,
		y: 380
	},
	aspectNames: ["nitor", "lux", "ordo"],
	aspectAmounts: {nitor: 7, lux: 5, ordo: 8},
	title: "Nitor",
	minWinHeight: 1200,
	description: 'Это пылающее пламя, кажется, подпитывается магией само по себе. Количество применений вечногорящего пламени кажется бесконечным, но, к сожалению, оно производит больше света, чем тепла. Но его пламя все же может оказаться постоянным источником энергии. \nНитор может быть расположен как источник света, но ему не нужна опора.{"type":"crucible","y":300,"x":10,"id":263,"aspects":["nitor",2,"lux",4,"ordo",2]}'
});

ResearchRegistry.registerResearch("alumentum", {
	parent: "nitor",
	icon: "research_alumentum",
	coords: {
		x: 260,
		y: 590
	},
	aspectNames: ["ignis", "potentia", "perditio"],
	aspectAmounts: {ignis: 7, potentia: 5, perditio: 8},
	title: "Alumentum",
	description: 'Эта субстанция просто пышет энергией и Вам кажется, что энергия внутри Алюментума так и жаждет вырваться наружу. Алюментум нестабилен, но может служить хорошим источником тепла. Не очень хорошей идеей будет кинуть его куда-нибудь, произойдет достаточно сильный взрыв и возгорание, однако его можно использовать, как оружие.{"type":"crucible","y":300,"x":10,"id":289,"aspects":["potentia",3,"ignis",1,"perditio",2]}'
});

ResearchRegistry.registerResearch("thaum metal", {
	parent: "alchemy",
	icon: "research_thaum_metal",
	coords: {
		x: 100,
		y: 470
	},
	aspectNames: ["praecantatio", "metallum"],
	aspectAmounts: {praecantatio: 10, metallum: 8},
	title: "Thaum metal",
	description: 'По тауматургическим принципам, металлы можно изменять с помощью магии. Результатом Вашего первого эксперимента стал Таум-металл. Таум-металл - результат наполнения металла магией. В итоге получается более прочный, чем железо металл с огромным потенциалом к магии. На его свойствах основано множество магических устройств. Из него также можно делать броню и некоторые полезные предметы.{"type":"crucible","y":300,"x":10,"id":265,"aspects":["praecantatio",3,"ordo",3]}'
});

ResearchRegistry.registerResearch("crystals of power", {
	parent: "thaum metal",
	icon: "research_power_crystals",
	coords: {
		x: 120,
		y: 670
	},
	aspectNames: ["ordo", "ignis", "nitor", "potentia"],
	aspectAmounts: {ordo: 4, ignis: 4, nitor: 4, potentia: 12},
	title: "Crystals of power",
	description: 'Дальнейшие изучения в магии привели вас к открытию кристаллов, созданных из эссенций аспектов, обладающих невероятной мощью и огромным воздействием на ауру. Продолжайте исследование, чтобы научиться создавать их.{"type":"crucible","y":300,"x":10,"id":263,"aspects":["nitor",2,"lux",4,"ordo",2]}'
});



ResearchRegistry.registerResearch("positive crystal", {
	parent: "crystals of power",
	icon: "research_positive_crystal",
	coords: {
		x: 90,
		y: 900
	},
	aspectNames: ["ignis", "potentia", "victus"],
	aspectAmounts:  {ignis: 4, potentia: 12, victus: 6},
	title: "Positive crystal of power",
	description: 'Кристалл силы, созданный из самой ауры, кажется, что он испускает положительную энергию. Если разбить этот кристалл, он перегрузит узлы ауры поблизости магической энергии, что вызовет кратковременное и быстрое очищение от излишков аспектов, которые появятся в мире в виде содержащих их предметов.{"type":"crucible","y":300,"x":10,"id":331,"aspects":["ordo", 10, "auram", 20]}'
});


ResearchRegistry.registerResearch("negative crystal", {
	parent: "crystals of power",
	icon: "research_negative_crystal",
	coords: {
		x: 240,
		y: 920
	},
	aspectNames: ["ignis", "potentia", "mortuus"],
	aspectAmounts: {ignis: 4, potentia: 12, mortuus: 6},
	title: "Negative crystal of power",
	description: 'Кристалл материальной порчи, обладает огромным запасом негативной энергии и способен уничтожить все вокруг себя. Разбейте его и выпустите всю мощь аспекта flux на своих врагов, полностью уничтожив их.\n Однако ничто не происходит просто так, энергия разбитого кристалла перейдет в ауру и заразит ее, что будет иметь последствия, если заражение не устранить в ближайшее время.{"type":"crucible","y":400,"x":10,"id":331,"aspects":["flux", 10, "ordo", 5]}'
});








ResearchRegistry.registerResearch("arcane workbench", {
	parent: "basic magic",
	icon: "research_arcane_workbench",
	coords: {
		x: 800,
		y: 300
	},
	aspectNames: ["ordo", "praecantatio"],
	aspectAmounts: {praecantatio: 7, ordo: 8},
	title: "Arcane workbench",
	description: 'Основой для создания магических предметов и механизмов служит магический верстак. Именно на нем вы сможете создать все предметы, которые вы изучите в этой ветви изучений. Создать верстак можно просто использовав волшебную палочку на столе.'
});

ResearchRegistry.registerResearch("googles", {
	parent: "arcane workbench",
	icon: "research_googles",
	coords: {
		x: 930,
		y: 490
	},
	aspectNames: ["praecantatio", "metallum", "sensus"],
	aspectAmounts: {praecantatio: 7, metallum: 4, sensus: 10},
	title: "Googles of true sight",
	description:'Основываясь на собственных наблюдениях, Вы понимаете, что магию не очень легко... увидеть. Эти очки сделают поиск узлов ауры еще легче, а так же откроют некоторые скрытые вещи. Они являются одним из главных инструментов Тауматурга.{"type":"magic_craft","x":10,"y":250,"id":"ItemID.itemGoogles","data":0}'
});

ResearchRegistry.registerResearch("thaum armor", {
	parent: "arcane workbench",
	icon: "research_armor",
	//square: true,
	coords: {
		x: 730,
		y: 540
	},
	aspectNames: ["fabrico", "metallum", "tutamen"],
	aspectAmounts: {fabrico: 7, metallum: 4, tutamen: 10},
	title: "Thaumic armor",
	minWinHeight: 1600,
	description: 'Таум-броня прочна и дает много защиты, кроме этого есть шанс, что при атаке на игрока возникнет разряд магической энергии, и атакующий получит столько же урона, сколько он нанес, при этом расстояние не имеет значения.{"type":"magic_craft","x":10,"y":250,"id":"ItemID.itemThaumHelmet","data":0}{"type":"magic_craft","x":10,"y":570,"id":"ItemID.itemThaumChestplate","data":0}{"type":"magic_craft","x":10,"y":890,"id":"ItemID.itemThaumLeggings","data":0}{"type":"magic_craft","x":10,"y":1210,"id":"ItemID.itemThaumBoots","data":0}'
});

ResearchRegistry.registerResearch("hell furnace", {
	parent: "arcane workbench",
	icon: "research_infernal_furnace",
	iconScale: 64 / 72,
	square: true,
	coords: {
		x: 830,
		y: 840
	},
	aspectNames: ["praecantatio", "metallum", "fabrico", "permutatio"],
	aspectAmounts: {praecantatio: 7, metallum: 4, fabrico: 10, permutatio: 10},
	title: "Hell furnace",
	minWinHeight: 1250,
	description: 'Создавая адскую печь, вы заключаете всю мощь аспекта ignis в одном могучем механизме, который обладает эффективностью, на два порядка больше обычной печи, к тому же адская печь питает саму себя и не требует топлива. Однако в процессе переплавки в ауру выделяется немного порчи, потому стоит следить за состоянием ауры, когда адская печь работает.\nДля постройки адской печи вам понадобится конструкция сдедущего вида, где * - обсидиан, # - адский кирпич, L - лава, B - решетка, C - ядро адской печи (снизу вверх):\n # * #\n * # * \n # * # \n\n * # *\n # L #\n * # *\n\n # * #\n * C * \n # * #\n\n\nРешетка может быть направлена в любую сторону, если печь построена правильно, она изменит текстуру, это выход адской печи. Чтобы переплавить предмет, его нужно сбросить в ядро печи в верхней его части.{"type":"magic_craft","x":10,"y":750,"id":"BlockID.blockHellFurnaceCore","data":0}'
});



















ResearchRegistry.registerResearch("aura recognition", {
	parent: "aura theory",
	icon: "research_aura_meter",
	coords: {
		x: 500,
		y: 350
	},
	aspectNames: ["potentia", "praecantatio", "metallum"],
	aspectAmounts: {praecantatio: 7, potentia: 5, metallum: 3},
	title: "Aura recognition",
	description: 'Вы научились распознавать известные аспекты в ауре и теперь сможете создать измеритель ауры, который позволит увидеть аспекты, которые содержатся в ближайших узлах ауры, но подождите останавливаться, продолжайте изучения в этом направлении и скоро сможете контролировать ауру.{"type":"magic_craft","x":10,"y":250,"id":"BlockID.blockAuraMeter","data":0}'
});

ResearchRegistry.registerResearch("aura extractor", {
	parent: "aura recognition",
	icon: "research_aura_extractor",
	coords: {
		x: 370,
		y: 480
	},
	aspectNames: ["motus", "praecantatio", "aqua"],
	aspectAmounts:  {motus: 7, praecantatio: 5, aqua: 8},
	title: "Essence extractor",
	description: 'Вы научились получать эссенции аспектов из ауры и использовать их в своих целях, на основе этих знаний Вы разработали механизм, который вытягивает положительрные эссенции из ауры и преобразует их в эссенцию аспекта auram, которая является единственным источником этого аспекта. {"type":"magic_craft","x":10,"y":250,"id":"BlockID.blockAuraExtractor","data":0}'
});


ResearchRegistry.registerResearch("aura cleaner", {
	parent: "aura recognition",
	icon: "research_aura_cleaner",
	coords: {
		x: 600,
		y: 510
	},
	aspectNames: ["limus", "praecantatio", "aqua"],
	aspectAmounts: {limus: 7, praecantatio: 5, aqua: 8},
	title: "Aura cleaner",
	description: 'Вы создали механизм, который позволяет очищать ауру и регенерировать ее, он необходим, если вы активно занимаетесь тауматургией, ибо при абсолютном большинстве различных магических операций в мир выделаются отрицательные аспекты, включая flux, которые стоит убрать из узла. {"type":"magic_craft","x":10,"y":250,"id":"BlockID.blockAuraCleaner","data":0}'
});

ResearchRegistry.registerResearch("dark extractor", {
	parent: "aura cleaner",
	icon: "research_dark_extractor",
	coords: {
		x: 630,
		y: 670
	},
	aspectNames: ["permutatio", "vitreus", "praecantatio", "tenebrae"],
	aspectAmounts: {permutatio: 7, vitreus: 5, praecantatio: 8, tenebrae: 8},
	title: "Dark essence extractor",
	description: 'Это улучшение к очистителю ауры, которое позволит ему собирать негативные аспекты в эссенцию аспекта flux, которая является единственным источником этого аспекта.'
});


var researchBookGui = new UI.StandartWindow();
researchBookGui.setContent({
	standart: {
		header: {
			text: {
				text: "Thaumonomicon"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		background: {
			bitmap: "research_book_background"
		},
		minHeight: 2000
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	}
});

var researchBookPageGui =  new UI.StandartWindow();
researchBookPageGui.setContent({
	standart: {
		header: {
			text: {
				text: "Research page"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		background: {
			bitmap: "research_page_background"
		},
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	}
});


var ResearchBookUIBuilder = {
	/* ------------------------ UI FUNCS --------------------------- */
	formatText: function(str, strlen){
		var splitted = str.split(" ");
		var newstr = "";
		var curlen = 0;
		for(var i in splitted){
			var s = splitted[i];

			var lines = s.split("\n");
			if(lines.length == 2){	
			if(curlen + lines[0].length > strlen){newstr += "\n";}
				newstr += " " + lines[0] + "\n" + lines[1];
				curlen = lines[1].length;
				continue;
			}

			var len = s.length;
			curlen += len;
			if(curlen > strlen){
				curlen = len;
				newstr += " \n";
			}
			else {newstr += " ";}
			newstr += s;
		}
		return newstr;
	},
	
	createStandartUI: function(research){
		var title = research.title || research.name;
		var descr = research.description || "no description for research: " + title;
		
		var titlefont = {
			color: android.graphics.Color.WHITE,
			shadow: .6,
			size: 36
		};
		
		var textfont = {
			color: android.graphics.Color.WHITE,
			shadow: .5,
			size: 18
		};
		
		var writingfont = {
			color: android.graphics.Color.rgb(50, 0, 128),
			shadow: .4,
			size: 18
		};
		
		var content = {
			elements: {
				
			},
			
			drawing: [
				{type: "text", x: 128, y: 87, font: titlefont, text: title}
			],
			
			minHeight: 1000
		}
		
		var elementIndex = 0;
		var tagSplit = descr.split("{");
		descr = "";
		for (var i in tagSplit){
			var str = tagSplit[i];
			try{
				var lastIndex = str.indexOf("}");
				if (lastIndex != -1){
					var tagstr = "{" + str.substr(0, lastIndex) + "}";
					var tag = JSON.parse(tagstr);
					descr += str.substr(lastIndex + 1, str.length);
				}
				else{
					descr += str;
					continue;
				}
			}
			catch(e){
				descr += str;
				alert("error in decoding json tag: " + e);
			}
			
			switch(tag.type){
				case "bitmap":
				content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: tag.bitmap, scale:tag.scale});
				break;
				
				case "craft":
				case "magic_craft":
				var recipe = Recipes.getRecipesByResult(eval("" + tag.id), -1, tag.data)[0];
				if (tag.type == "craft"){
					content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: "overlay_usual_workbench", scale: 3});
				}
				else{
					content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: "overlay_magic_workbench", scale: 3});
				}
				if (recipe){
					content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: tag.bitmap, scale:tag.scale});
					for (var i in recipe.recipeSource){
						var source = recipe.recipeSource[i];
						if (source){
							var slot = {type: "slot", source: {id: source.id, count: 1, data: Math.max(0, source.data)}, x: tag.x + (i % 3) * 93 + 18, y: tag.y + parseInt(i / 3) * 93 + 18, visual: true, bitmap: "invisible_slot", size: 78};
							content.elements["_e" + elementIndex++] = slot;
						}
					}
				}
				break;
				
				case "crucible":
				content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: "overlay_crucible", scale: 2.8301});
				var radius = 50;
				var iconSize = Math.min(radius * Math.PI * 2 / tag.aspects.length * 1.1, 64);
				content.elements["_e" + elementIndex++] = {type: "slot", source: {id: eval("" + tag.id) || 0, count: 1, data: tag.data || 0}, x: tag.x + 22, y: tag.y - 18, visual: true, bitmap: "invisible_slot", size: 80};
				for (var i = 0; i < tag.aspects.length; i += 2){
					var angle = Math.PI * 2 * i / tag.aspects.length;
					content.drawing.push({type: "bitmap", x: tag.x + 120 + Math.sin(angle) * radius, y: tag.y + 203 + Math.cos(angle) * radius, bitmap: AspectRegistry.getAspectIcon(tag.aspects[i], true), scale: iconSize / 32});
					content.drawing.push({type: "text", x: tag.x + 120 + Math.sin(angle) * radius + iconSize * .5, y: tag.y + 203 + Math.cos(angle) * radius + iconSize, text: tag.aspects[i + 1], font: textfont});
				}
				break;
				
				default: 
				alert("unknown json tag type: " + tag.type);
			}
		}
	
	
		var formattedDescr = this.formatText(descr, 56);
		var lines = formattedDescr.split("\n");
		for (var i in lines){
			content.drawing.push({type: "text", x: 25, y: 140 + i * 23, font: writingfont, text: lines[i]})
		}
		for (var i in research.aspectNames){
			content.drawing.push({type: "bitmap", x: 860, y: 30 + i * 72, bitmap: AspectRegistry.getAspectIcon(research.aspectNames[i], true), scale: 2})
			content.drawing.push({type: "text", x: 900, y: 80 + i * 72, text: "" + parseInt(research.aspectAmounts[research.aspectNames[i]] / RESEARCH_PROGRESS_MULTIPLIER), font: textfont})
		}
		return content;
	},
	
	openResearchWindow: function(name){
		var research = ResearchRegistry.getResearch(name);
		if (research){
			var screen = researchBookPageGui;
			for (var name in screen.content.elements){
				screen.content.elements[name] = null;
			}
			screen.content.drawing = [];
			if (research.gui){
				for (var name in research.gui.elements){
					screen.content.elements[name] = research.gui.elements[name];
				}
				screen.content.drawing = research.gui.drawing || [];
			}
			else{
				var content = this.createStandartUI(research);
				for (var name in content.elements){
					screen.content.elements[name] = content.elements[name];
				}
				screen.content.drawing = content.drawing;
			}
			var buttonTexture = "research_page_button";
			if (ResearchRegistry.isResearched(name)){
				buttonTexture = "research_page_button_complete";
			}
			screen.content.elements.deployButton = {type: "button", x: 30, y: 23, bitmap: buttonTexture, scale: 1.3, clicker: {
					onClick: function(){
						ResearchRegistry.giveResearchPageToPlayer(research);
						screen.close();
					}
				}
			};
			
			screen.content.standart.minHeight = research.minWinHeight || content.minHeight;
			
			UI.testUI(screen);
		}
	},
	
	
	createResearchIcon: function(research){
		return {
			type: "image",
			x: research.coords.x - 48,
			y: research.coords.y - 48,
			bitmap: research.square ? "research_icon_background_1" : "research_icon_background_0",
			overlay: research.icon,
			scale: 1.5,
			overlayScale: (research.iconScale || 1) * 1.5,
			clicker: {
				onClick: function(){
					ResearchBookUIBuilder.openResearchWindow(research.name);
				}
			}
		};
	},
	
	openMainScreen: function(allVisible){
		var visible = allVisible ? ResearchRegistry.getAll() : ResearchRegistry.getAllVisible();
		var drawing = [];
		var elements = {};
		
		for (var i in visible){
			var research = visible[i];
			if (research.parent){
				drawing.push({type: "line", x1: research.coords.x, y1: research.coords.y, x2: ResearchRegistry.getResearchParent(research).coords.x, y2: ResearchRegistry.getResearchParent(research).coords.y, width: 5})
			}
		}
		for (var i in visible){
			elements["research" + i] = this.createResearchIcon(visible[i]);
		}
		
		researchBookGui.content.elements = elements;
		researchBookGui.content.drawing = drawing;
		UI.testUI(researchBookGui);
	}
}


//ResearchBookUIBuilder.openMainScreen(true);


var BLOCK_TYPE_LOW_LIGHT = Block.createSpecialType({
	lightlevel: 11,
	lightopacity: 0
});

var BLOCK_TYPE_SOLID_ORE = Block.createSpecialType({
	renderlayer: 0,
	lightopacity: 15
});

/*
function dumpAPI (apiname, api, depth){
	if (depth < 0){
		return "";
	}
	var log = "";
	
	for (var name in api){
		var prop = api[name];
		if (typeof(prop) == "object"){
			log += dumpAPI(apiname + "." + name, prop, depth - 1) + "\n";
		}
		if (typeof(prop) == "function"){
			log += apiname + "." + name + "(...)" + "\n";
		}
	}
	
	return log;
}


Game.dialogMessage(dumpAPI("UI", UI, 3));*/



var CrucibleHandler = {
	HEATING_TILES: {
		10: 1,
		11: 1,
		50: .7,
		51: .5
	},
	
	registerHeatTile: function(id, power){
		this.HEATING_TILES[id] = power;
	},
	
	getHeatingPower: function(id){
		return this.HEATING_TILES[id] || 0;
	},
	
	RECIPES: {},
	registerRecipe: function(activator, result, aspects, research){
		var key = activator.id + ":" + activator.data;
		if (activator.data == -1){
			key = activator.id;
		}
		
		this.RECIPES[key] = {
			activator: activator,
			result: result,
			aspects: aspects,
			research: research
		};
	},
	
	
	getRecipeByActivator: function(id, data){
		return this.RECIPES[id + ":" + data] || this.RECIPES[id];
	},
	
	provideRecipe: function(id, count, data, aspectSource){
		var recipe = this.getRecipeByActivator(id, data);
		if (!recipe){
			return;
		}
		if (recipe.research && !ResearchRegistry.isResearched(recipe.research)){
			return;
		}
		
		var amount = 0;
		while (true){
			if (amount >= count){
				break;
			}
			
			var hasAll = true;
			for (var name in recipe.aspects){
				if (!aspectSource[name] || recipe.aspects[name] > aspectSource[name]){
					hasAll = false;
					break;
				}
			}
			
			if (hasAll){
				for (var name in recipe.aspects){
					aspectSource[name] -= recipe.aspects[name];
				}
				amount++;
			}
			else{
				break;
			}
		}
		
		if (amount > 0){
			return {id: recipe.result.id, count: amount * recipe.result.count, data: recipe.result.data, activatorLeft: count - amount};
		}
		else{
			return null;
		}
	}
}



var crucibleGui = new UI.StandartWindow();
crucibleGui.setContent({
	standart: {
		header: {
			text: {
				text: "Crucible"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		background: {
			bitmap: "thaum_background"
		},
		minHeight: 600
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", bitmap: "crucible_background", x: 242, y: 36, scale: 4},
	],
	elements: {
		
	}
});


Callback.addCallback("PostLoaded", function(){
	CrucibleHandler.registerRecipe({id: 263, data: -1}, {id: IDData.item.itemNitor, count: 1, data: 0}, {lux: 4, nitor: 2, ordo: 2}, "nitor");
	CrucibleHandler.registerRecipe({id: 289, data: 1}, {id: IDData.item.itemAlumentum, count: 1, data: 0}, {potentia: 3, ignis: 1, perditio: 2}, "alumentum"); 
	CrucibleHandler.registerRecipe({id: 265, data: 1}, {id: IDData.item.itemThaumIngot, count: 1, data: 0}, {praecantatio: 3, ordo: 3}, "thaum metal"); 
	CrucibleHandler.registerRecipe({id: 331, data: 0}, {id: IDData.item.positivePowerCrystal, count: 1, data: 0}, {ordo: 10, auram: 20}, "positive crystal");
	CrucibleHandler.registerRecipe({id: 331, data: 0}, {id: IDData.item.negativePowerCrystal, count: 1, data: 0}, {ordo: 5, flux: 10}, "negative crystal");
})


IDRegistry.genBlockID("blockThaumCrucible");

Block.createBlock("blockThaumCrucible", [
	{name: "magic crucible", texture: [["crucible", 0], ["crucible", 1], ["crucible", 2], ["crucible", 2], ["crucible", 2], ["crucible", 2]], inCreative: true},
	{name: "magic crucible", texture: [["crucible", 0], ["crucible", 3], ["crucible", 2], ["crucible", 2], ["crucible", 2], ["crucible", 2]]},
	{name: "magic crucible", texture: [["crucible", 0], ["crucible", 4], ["crucible", 2], ["crucible", 2], ["crucible", 2], ["crucible", 2]]},
]);







TileEntity.registerPrototype(IDData.block.blockThaumCrucible, {
	defaultValues: {
		liquid: 0,
		temp: 0
	},
	
	checkStorage: function(){
		if (!this.aspectStorage){
			this.aspectStorage = new AspectStorage();
			this.aspectStorage.syncWithTileEntity(this);
		}
	},
	
	init: function(){
		this.checkStorage();
	},
	
	tick: function(){		
		this.checkStorage();
	
		var time = World.getThreadTime();
		
		var content = this.container.getGuiContent();
		if (content){
			this.refreshUI(content);
		}
		
		if (time % 4 == 0){
			if (this.data.liquid == 1 && this.data.temp > 380){
				var item = Entity.findNearest({x: this.x + .5, y: this.y + 1, z: this.z + .5}, 64, .8);
				if (item){
					this.addItemEntity(item);
				}
			}
		}
		
		if (time % 20 == 0){
			this.refreshTile();
			this.refreshHeating();
		}
		
		if (this.data.liquid > 0){
			if (this.heating){
				this.data.temp += this.heating;
			}
			else{
				this.data.temp -= .2;
			}
		}
		else{
			this.data.temp = 0;
		}
		
		if (this.data.temp > 400){
			this.data.temp = 400;
			this.animate(3);
		}
	},
	
	
	animate: function(amount, lightnings){
		for (var i = 0; i < amount; i++){
			Particles.addParticle(this.x + Math.random(), this.y + .9 + Math.random() * .2, this.z + Math.random(), 31, 0, 0, 0, 0);
			if (lightnings && Math.random() < .05){
				ParticleAnimation.FadeBolt.randomBolt({x: this.x + .5, y: this.y + 1.1, z: this.z + .5}, .7, 2, 1);
			}
		}
	},
	
	click: function(id, count, data){
		Game.prevent();
		if (this.data.liquid == 0){
			if (id == 325 && data == 8){
				this.data.liquid = 1;
				this.refreshTile();
				Player.setCarriedItem(id, count, 0);
			}
			
			return true;
		}
	},
	
	
	refreshTile: function(){
		var tile = World.getBlock(this.x, this.y, this.z);
		if (tile.id == IDData.block.blockThaumCrucible && tile.data != this.data.liquid){
			World.setBlock(this.x, this.y, this.z, tile.id, this.data.liquid);
		}
	},
	
	refreshHeating: function(){
		var tile = World.getBlock(this.x, this.y - 1, this.z);
		this.heating = CrucibleHandler.getHeatingPower(tile.id);
	},
	
	
	
	addItemEntity: function(item){
		var container = Entity.getInventory(item);
		container.refreshItem();
		var slot = container.getSlot("item");
		if (slot.id != IDData.block.blockThaumCrucible){
			this.addItem(slot.id, slot.count, slot.data);
			Entity.remove(item);
		}
	},
	
	addItem: function(id, count, data){
		this.checkStorage();
		var result = CrucibleHandler.provideRecipe(id, count, data, this.aspectStorage.aspectAmounts);
		if (result){
			World.drop(this.x + .5, this.y + 1.1, this.z + .5, result.id, result.count, result.data);
			if (result.activatorLeft){
				World.drop(this.x + .5, this.y + 1.1, this.z + .5, id, result.activatorLeft, data);
			}
			this.data.liquid = 0;
			this.leakAllEssence();
			this.refreshTile();
			this.animate(100, true);
		}
		else {
			var aspects = AspectRegistry.getAspectsForItem(id, data);
			for (var name in aspects){
				this.aspectStorage.addEssenceByName(name, aspects[name] * count);
			}
			this.animate(60);
		} 
	},
	
	leakAllEssence: function(fluxAmount){
		var essences = this.aspectStorage.aspectAmounts;
		essences.flux = fluxAmount || 0;
		Aura.leakEssenceStack({x: this.x + .5, y: this.y + 1.1, z: this.z + .5}, essences, true);
		this.aspectStorage.clear();
		this.checkStorage();
	},
	
	
	
	
	
	
	
	
	
	/* ----------------------- UI -------------------------- */
	
	getGuiScreen: function(){
		if (this.data.liquid == 1 && this.data.temp >= 380){
			return crucibleGui;
		}
	},
	
	refreshUI: function(content){
		this.refreshAspectIcons(content.elements, this.aspectStorage.aspectAmounts);
	},
	
	refreshAspectIcons: function(elements, aspectAmounts){
		for (var name in elements){
			if (name.startsWith("IAspect")){
				elements[name] = null;
			}
		}
		
		var minors = [];
		var majors = [];
		for (var name in aspectAmounts){
			var amount = aspectAmounts[name];
			if (amount > 0){
				if (amount >= 6){
					majors.push(name);
				}
				else{
					minors.push(name);
				}
			}
		}
		
		this.showCircleOfAspects(elements, majors, {x: 500, y: 292, radius: 160, scale: 2}, "IAspectA");
		this.showCircleOfAspects(elements, minors, {x: 500, y: 292, radius: 100, scale: 1.5}, "IAspectB");
	},
	
	
	showCircleOfAspects: function(elements, array, coords, prefix){
		var size = Math.min(coords.scale * 32, coords.radius * Math.PI * 2 / (array.length * 1.3));
		for (var i in array){
			var angle = i / array.length * Math.PI * 2;
			var x = parseInt(coords.x + Math.sin(angle) * coords.radius);
			var y = parseInt(coords.y + Math.cos(angle) * coords.radius);
			var element = {type: "image", x: x - size / 2, y: y - size / 2, bitmap: AspectRegistry.getAspectIcon(array[i]), scale: size / 32};
			elements[prefix + "" + i] = element;
		}
	},
});


IDRegistry.genBlockID("blockArcaneWorkbench");

Block.createBlock("blockArcaneWorkbench", [
	{name: "archane workbench", texture: [["research_table", 2], ["magic_craft", 0], ["magic_craft", 1], ["magic_craft", 1], ["magic_craft", 1], ["magic_craft", 1]], inCreative: true}
]);

var arcaneWorkbenchGui = new UI.StandartWindow();
arcaneWorkbenchGui.setContent({
	standart: {
		header: {
			text: {
				text: "Arcane workbench"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		},
		minHeight: 600
	},
	params: {
		textures: {
			slot: "arcane_workbench_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", x: 365, y: 42, bitmap: "arcane_workbench_background", scale: 2.55}    
	],
	elements: {
		"slot0": {type: "slot", x: 467, y: 146, size: 60},
		"slot1": {type: "slot", x: 537, y: 146, size: 60},
		"slot2": {type: "slot", x: 607, y: 146, size: 60},
		"slot3": {type: "slot", x: 467, y: 214, size: 60},
		"slot4": {type: "slot", x: 537, y: 214, size: 60},
		"slot5": {type: "slot", x: 607, y: 214, size: 60},
		"slot6": {type: "slot", x: 467, y: 283, size: 60},
		"slot7": {type: "slot", x: 537, y: 283, size: 60},
		"slot8": {type: "slot", x: 607, y: 283, size: 60},
		"resultSlot": {type: "slot", x: 698, y: 212, size: 60, clicker: {
				onClick: function(position, container, tileEntity){
					var result = Recipes.provideRecipe(container, tileEntity.getCraftPrefix());
					if (result){
						Player.getInventory().addItem(result.id, result.count, result.data);
					}
				},
				onLongClick: function(position, container, tileEntity){
					this.onClick(position, container, tileEntity);
				}
			}
		},
	}
});

//UI.testUI(arcaneWorkbenchGui);


var ArcaneWorkbenchHelper = {
	BASIC_PREFIX: "thArcane",
	affectedResearches: {},
	
	addRecipe: function(result, mask, items, researchName, func){
		if (researchName){
			this.affectedResearches[researchName] = true;
		}
		Recipes.addShaped(result, mask, items, func, this.BASIC_PREFIX + (researchName || ""));
	},
	
	getCraftPrefix: function(){
		var researchNames = [];
		for (var name in this.affectedResearches){
			if (ResearchRegistry.isResearched(name)){
				researchNames.push(name);
			}
		}
		return this.BASIC_PREFIX + researchNames.join("," + this.BASIC_PREFIX);
	}
}




TileEntity.registerPrototype(IDData.block.blockArcaneWorkbench, {
	tick: function(){
		if (this.container.isOpened()){
			var res = Recipes.getRecipeResult(this.container, this.getCraftPrefix());
			if (res){
				this.container.setSlot("resultSlot", res.id, res.count, res.data);
			}
			else{
				this.container.setSlot("resultSlot", 0, 0, 0);
			}
		}
		else{
			this.craftPrefix = null;
		}
	},
	
	getGuiScreen: function(){
		return arcaneWorkbenchGui;
	},
	
	getCraftPrefix: function(){
		if (!this.craftPrefix){
			this.craftPrefix = ArcaneWorkbenchHelper.getCraftPrefix();
		}
		return this.craftPrefix;
	}
});


Callback.addCallback("PostLoaded", function(){
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalAer, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalTerra, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalDark, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalOrdo, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalIgnis, 0, "A", 334, 0], "googles");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemGoogles, count: 1, data: 0}, ["A A", "X#X", "A A"], ["#", 266, 0, "X", IDData.item.itemCrystalAqua, 0, "A", 334, 0], "googles");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumBoots, count: 1, data: 0}, ["X X", "X X"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumLeggings, count: 1, data: 0}, ["XXX", "X X", "X X"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumChestplate, count: 1, data: 0}, ["X X", "XXX", "XXX"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	ArcaneWorkbenchHelper.addRecipe({id: IDData.item.itemThaumHelmet, count: 1, data: 0}, ["XXX", "X X"], ["#", 266, 0, "X", IDData.item.itemThaumIngot, 0], "thaum armor");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockHellFurnaceCore, count: 1, data: 0}, ["X#X", "#A#", "X#X"], ["#", 49, 0, "X", 112, 0, "A", IDData.item.itemNitor, 0], "hell furnace");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockAuraMeter, count: 1, data: 0}, ["#", "A", "X"], ["A", 339, 0, "X", BlockID.blockThaumTable, 0, "#", IDData.item.itemNitor, 0], "aura recognition");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockAuraExtractor, count: 1, data: 0}, ["A", "#", "X"], ["A", 374, 0, "X", BlockID.blockAuraMeter, 0, "#", IDData.item.itemThaumIngot, 0], "aura extractor");
	
	ArcaneWorkbenchHelper.addRecipe({id: IDData.block.blockAuraCleaner, count: 1, data: 0}, ["A", "#", "X"], ["A", 374, 0, "X", BlockID.blockAuraMeter, 0, "#", 49, 0], "aura cleaner");
})


IDRegistry.genBlockID("blockAuraMeter");

Block.createBlock("blockAuraMeter", [
	{name: "aura'o'meter", texture: [["aura_meter", 2], ["aura_meter", 0], ["aura_meter", 1], ["aura_meter", 1], ["aura_meter", 1], ["aura_meter", 1]], inCreative: true}
]);

var auraMeterGui = new UI.StandartWindow();
auraMeterGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aura-meter"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		}
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", bitmap: "paper_background", x: 336, y: 36, scale: 3.333},
		{type: "bitmap", bitmap: "aura_meter_overlay", x: 336, y: 36, scale: 3.3333},
		{type: "bitmap", x: 842, y: 73, bitmap: "aspect_scale_background", scale: 4},
	],
	elements: {
		"aspectScale": {type: "scale", x: 850, y: 89, direction: 1, scale: 8, value: 0.7, bitmap: "aspectScale_nitor", overlay: "aspect_scale_overlay_1", overlayScale: 4}
	}
});


TileEntity.registerPrototype(IDData.block.blockAuraMeter, {
	node: null,
	
	tick: function(){
		if (!this.node){
			this.node = Aura.getNearestAuraNode(this);
		}
		var content = this.container.getGuiContent();
		if (content){
			if (this.node){
				var aspectStorage = this.node.aspectStorage;
				this.refreshAspectIcons(content.elements, aspectStorage.aspectAmounts);
				this.refreshScale(content.elements, this.selectedAspect, aspectStorage.aspectAmounts[this.selectedAspect]);
			}
			else{
				this.refreshAspectIcons(content.elements, {});
				this.refreshScale(content.elements, null);
			}
		}
	},
	
	
	
	
	refreshAspectIcons: function(elements, aspectAmounts){
		for (var name in elements){
			if (name.startsWith("IAspect")){
				elements[name] = null;
			}
		}
		
		var minors = [];
		var majors = [];
		for (var name in aspectAmounts){
			var amount = aspectAmounts[name];
			if (amount > 0){
				if (amount >= 6){
					majors.push(name);
				}
				else{
					minors.push(name);
				}
			}
		}
		
		this.showCircleOfAspects(elements, majors, {x: 550, y: 250, radius: 180, scale: 2}, "IAspectA");
		this.showCircleOfAspects(elements, minors, {x: 550, y: 250, radius: 90, scale: 1.5}, "IAspectB");
	},
	
	refreshScale: function(elements, aspectName, aspectAmount){
		if (aspectName && aspectAmount){
			elements.aspectScale.bitmap = AspectRegistry.getAspectScale(aspectName);
			this.container.setScale("aspectScale", aspectAmount / 50);
		}
		else{
			this.container.setScale("aspectScale", 0);
		}
	},
	
	createIconClicker: function(aspectName){
		return {
			onClick: function(position, container, tileEntity){
				tileEntity.selectedAspect = aspectName;
			}
		};
	},
	
	showCircleOfAspects: function(elements, array, coords, prefix){
		var size = Math.min(coords.scale * 32, coords.radius * Math.PI * 2 / (array.length * 1.3));
		for (var i in array){
			var angle = i / array.length * Math.PI * 2;
			var x = parseInt(coords.x + Math.sin(angle) * coords.radius);
			var y = parseInt(coords.y + Math.cos(angle) * coords.radius);
			var element = {type: "image", x: x - size / 2, y: y - size / 2, bitmap: AspectRegistry.getAspectIcon(array[i]), scale: size / 32, clicker: this.createIconClicker(array[i])};
			if (this.selectedAspect == array[i]){
				element.overlay = "aspect_selection";
			}
			elements[prefix + "" + i] = element;
		}
	},
	
	getGuiScreen: function(){
		return auraMeterGui;
	}
});




IDRegistry.genBlockID("blockAuraExtractor");

Block.createBlock("blockAuraExtractor", [
	{name: "aura extractor", texture: [["aura_extractor", 2], ["aura_extractor", 0], ["aura_extractor", 1], ["aura_extractor", 1], ["aura_extractor", 1], ["aura_extractor", 1]], inCreative: true}
]);

var auraExtractorGui = new UI.StandartWindow();
auraExtractorGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aura extractor"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		}
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", x: 400, y: 30, bitmap: "aspect_scale_background", scale: 6}
	],
	elements: {
		"crystalScale": {type: "scale", x: 412, y: 54, direction: 3, scale: 6, invert: true, value: 0.7, bitmap: "aura_essence_crystal_1", overlay: "aspect_scale_overlay_2"},
		"crystalSlot": {type: "slot", x: 550, y: 210, size: 120}
	}
});

//UI.testUI(auraExtractorGui);




TileEntity.registerPrototype(IDData.block.blockAuraExtractor, {
	ASPECTS_PER_EXTRACTION: 4,
	EXTRACTION_AMOUNT: .1,
	ESSENCE_PER_ITEM: 24,
	defaultValues: {
		progress: 0,
	},
	
	recacheEssences: function(){
		var aspects = AspectRegistry.getAll();
		this.aspectCache = [];
		for (var name in aspects){
			var aspect = aspects[name];
			if (aspect.power > 0){
				this.aspectCache.push(name);
			}
		}
	},
	
	getRandomExtractData: function(){
		if (!this.aspectCache){
			this.recacheEssences();
		}
		var essence = {};
		for (var i = 0; i < this.ASPECTS_PER_EXTRACTION; i++){
			var name = this.aspectCache[parseInt(this.aspectCache.length * Math.random())];
			essence[name] = this.EXTRACTION_AMOUNT * Math.random();
		}
		return essence;
	},
	
	addExtractedEssence: function(essence){
		for (var name in essence){
			this.data.progress += essence[name] / this.ESSENCE_PER_ITEM;
		}
	},
	
	tick: function(){
		if (!this.connectionCache){
			this.connectionCache = Aura.createConnectionCache(this.x + .5, this.y + .5, this.z + .5);
		}
		if (World.getThreadTime() % 10 == 0){
			this.addExtractedEssence(Aura.extractEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, this.getRandomExtractData(), Math.random() < .16, this.connectionCache));
		}
		
		this.container.setScale("crystalScale", this.data.progress);
		if (this.data.progress >= 1){
			var slot = this.container.getSlot("crystalSlot");
			if (slot.count < 64 && (slot.id == ItemID.itemAuramEssence || slot.id == 0)){
				this.data.progress = 0;
				slot.id = ItemID.itemAuramEssence;
				slot.count++;
			}
			else{
				this.data.progress = 1;
			}
		}
	},
	
	getGuiScreen: function(){
		return auraExtractorGui;
	}
});


IDRegistry.genBlockID("blockAuraCleaner");

Block.createBlock("blockAuraCleaner", [
	{name: "aura cleaner", texture: [["aura_cleaner", 2], ["aura_cleaner", 0], ["aura_cleaner", 1], ["aura_cleaner", 1], ["aura_cleaner", 1], ["aura_cleaner", 1]], inCreative: true}
]);

var auraCleanerGui = new UI.StandartWindow();
auraCleanerGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aura cleaner - dark extractor"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		}
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", x: 400, y: 30, bitmap: "aspect_scale_background", scale: 6}
	],
	elements: {
		"crystalScale": {type: "scale", x: 412, y: 54, direction: 3, scale: 6, invert: true, value: 0.7, bitmap: "aura_essence_crystal_2", overlay: "aspect_scale_overlay_2"},
		"crystalSlot": {type: "slot", x: 550, y: 210, size: 120}
	}
});

//UI.testUI(auraExtractorGui);




TileEntity.registerPrototype(IDData.block.blockAuraCleaner, {
	ASPECTS_PER_EXTRACTION: 4,
	EXTRACTION_AMOUNT: .2,
	ESSENCE_PER_ITEM: 24,
	REGEN_MULTIPLIER: .0125,
	REGEN_MAX_AMOUNT: .04,
	
	defaultValues: {
		progress: 0,
	},
	
	recacheEssences: function(){
		var aspects = AspectRegistry.getAll();
		this.positiveAspectCache = [];
		this.negativeAspectCache = [];
		for (var name in aspects){
			var aspect = aspects[name];
			if (aspect.power < -.2){
				this.negativeAspectCache.push(name);
			}
			else{
				this.positiveAspectCache.push(name);
			}
		}
	},
	
	getRandomEssenceData: function(positive){
		if (!this.positiveAspectCache || !this.negativeAspectCache){
			this.recacheEssences();
		}
		var cache = positive ? this.positiveAspectCache : this.negativeAspectCache;
		var essence = {};
		for (var i = 0; i < this.ASPECTS_PER_EXTRACTION; i++){
			var name = cache[parseInt(cache.length * Math.random())];
			essence[name] = this.EXTRACTION_AMOUNT * Math.random();
		}
		return essence;
	},
	
	addExtractedEssence: function(essence){
		for (var name in essence){
			this.data.progress += essence[name] / this.ESSENCE_PER_ITEM;
		}
	},
	
	regenEssence: function(essence){
		for (var name in essence){
			essence[name] += Math.min(essence[name] * this.REGEN_MULTIPLIER * Math.random(), this.REGEN_MAX_AMOUNT);
		}
	},
	
	moveNode: function(dist, animate){
		if (this.node){
			var target = {
				x: this.x + .5,
				y: this.y + 3.5,
				z: this.z + .5,
			};
			
			var delta = {
				x: target.x - this.node.coords.x,
				y: target.y - this.node.coords.y,
				z: target.z - this.node.coords.z,
			};
			
			var len = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z);
			var move = Math.min(len, dist);
			delta.x *= move / len;
			delta.y *= move / len;
			delta.z *= move / len;
			
			this.node.x += delta.x;
			this.node.y += delta.y;
			this.node.z += delta.z;
			
			if (this.animate){
				ParticleAnimation.FadeBolt.randomBolt(this.node.coords, dist / .5 * 1.5, 3, 2);
			}
		}
	},
	
	tick: function(){
		if (!this.node){
			this.node = Aura.getNearestAuraNode(this);
		}
		if (!this.connectionCache){
			this.connectionCache = Aura.createConnectionCache(this.x + .5, this.y + .5, this.z + .5);
		}
		
		var time = World.getThreadTime()
		if (time % 10 == 0){
			var essences = this.getRandomEssenceData(false);
			var extracted = Aura.extractEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, Math.random() < .16, this.connectionCache);
			this.addExtractedEssence(extracted);
			
			this.isDarkExtractorResearched = ResearchRegistry.isResearched("dark extractor");
			if (!this.isDarkExtractorResearched){
				this.data.progress = 0;
			}
			
			if (Math.random() < .25){
				this.moveNode(.25 * Math.random(), true);
			}
		}
		if (time % 10 == 5){
			var essences = this.getRandomEssenceData(true);
			var extracted = Aura.extractEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, Math.random() < .16, this.connectionCache);
			this.regenEssence(extracted);
			Aura.leakEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, extracted, Math.random() < .16, this.connectionCache)
		}
		
		this.container.setScale("crystalScale", this.data.progress);
		if (this.data.progress >= 1){
			var slot = this.container.getSlot("crystalSlot");
			if (this.isDarkExtractorResearched && slot.count < 64 && (slot.id == ItemID.itemFluxEssence || slot.id == 0)){
				this.data.progress = 0;
				slot.id = ItemID.itemFluxEssence;
				slot.count++;
			}
			else{
				this.data.progress = 1;
			}
		}
	},
	
	getGuiScreen: function(){
		if (this.isDarkExtractorResearched){
			return auraCleanerGui;
		}
	}
});


IDRegistry.genBlockID("blockNitor");

Block.createBlock("blockNitor", [
	{name: "nitor.tile", texture: [["empty"], ["empty"], ["empty"], ["empty"], ["empty"], ["empty"]]}
], BLOCK_TYPE_LOW_LIGHT);

Block.registerDropFunction("blockNitor", function(){
	return [[IDData.item.itemNitor, 1, 0]];
});

TileEntity.registerPrototype(IDData.block.blockNitor, {
	tick: function(){
		ParticleAnimation.animateNitor(this.x + .5, this.y + .2, this.z + .5, .6);
	}
});

CrucibleHandler.registerHeatTile(IDData.block.blockNitor, .8);


IDRegistry.genBlockID("blockAspectReactor");

Block.createBlockWithRotation("blockAspectReactor", [
	{name: "aspect reactor", texture: [["aspect_reactor", 3], ["aspect_reactor", 3], ["aspect_reactor", 3], ["aspect_reactor", 0], ["aspect_reactor", 1], ["aspect_reactor", 2]], inCreative: true}
]);

Recipes.addShaped({id: IDData.block.blockAspectReactor, count: 1, data: 0}, ["#XA", "#CB", "#XA"], ["X", 374, 0, "#", 5, -1, "A", 265, 0, "B", 20, 0]);


var aspectReactorGui = new UI.StandartWindow();
aspectReactorGui.setContent({
	standart: {
		header: {
			text: {
				text: "Aspect reactor"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		},
		minHeight: 600
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", x: 842, y: 104, bitmap: "aspect_scale_background", scale: 4},
		{type: "bitmap", x: 560, y: 100, bitmap: "aspect_reactor_background", scale: 360 / 128},
	],
	elements: {
		"slot1": {type: "slot", x: 400, y: 100, size: 160},
		"slot2": {type: "slot", x: 400, y: 300, size: 160},
		"aspectScale": {type: "scale", x: 850, y: 120, direction: 1, scale: 8, value: 1, bitmap: "aspectScale_nitor", overlay: "aspect_scale_overlay_1", overlayScale: 4},
		"stateText": {type: "text", x: 625, y: 227, width: 90, height: 100, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6, size: 25}}
	}
});

TileEntity.registerPrototype(IDData.block.blockAspectReactor, {
	defaultValues: {
		resultAspectName: null,
		resultAspectAmount: 0,
		aspectSelection: {},
		leaking: 0,
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if (content){ 
			this.updateItemsInSlots(content.elements);
			var result = this.getResult();
			if (result){
				if (this.data.resultAspectName != result.name){
					var essences = {};
					essences[this.data.resultAspectName] = this.data.resultAspectAmount;
					Aura.leakEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, true);
					this.data.resultAspectName = result.name;
					this.data.resultAspectAmount = 0;
				}
				this.updateResultIcon(content.elements, this.data.resultAspectName, this.data.resultAspectAmount);
			}
			else{
				this.updateResultIcon(content.elements, null);
			}
		}
		if (this.data.leaking > 0 && World.getThreadTime() % 20 == 0) {
			this.data.leaking--;
			var essences = {flux: .015 * Math.random()};
			essences[this.data.resultAspectName] = .07 * Math.random();
			Aura.leakEssenceStack({x: this.x + .5, y: this.y + .5, z: this.z + .5}, essences, true);
		}
	},
	
	getResult: function(){
		if (this.data.aspectSelection["slot1"] && this.data.aspectSelection["slot2"]){
			var aspect1 = this.data.aspectSelection["slot1"];
			var aspect2 = this.data.aspectSelection["slot2"];
			return AspectRegistry.getReactionResult(aspect1, aspect2);
		}
		return null;
	},
	
	onResearched: function(){
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		if (slot1.count > 0 && slot2.count > 0){
			var aspects1 = AspectRegistry.getAspectsForItem(slot1.id, slot1.data);
			var aspects2 = AspectRegistry.getAspectsForItem(slot2.id, slot2.data);
			var essenceAmount = (aspects1[this.data.aspectSelection.slot1] || 0) + (aspects2[this.data.aspectSelection.slot1] || 0);
			AspectRegistry.researchAspect(this.data.resultAspectName, essenceAmount, 2.5);
			this.data.resultAspectAmount += essenceAmount * .4;
			slot1.count--;
			slot2.count--;
			if (slot1.count < 1){
				slot1.id = slot1.count = slot1.data = 0;
			}
			if (slot2.count < 1){
				slot2.id = slot2.count = slot2.data = 0;
			}
			this.data.leaking += 7;
		}
	},
	
	
	
	
	
	
	
	
	
	
	
	getGuiScreen: function(){
		return aspectReactorGui;
	},

	updateResultIcon: function(elements, aspectName, aspectAmount){
		if (aspectName){
			var researchProgress = AspectRegistry.getResearchProgress(aspectName);
			// set elements
			elements.resultIcon = {type: "image", x: 717, y: 235, bitmap: AspectRegistry.getAspectIcon(aspectName), scale: 2.8125, overlay: "aspect_reactor_overlay", clicker: {
					onClick: function(position, container, tileEntity){
						tileEntity.onResearched();
					}
				}
			};
			elements.aspectScale.bitmap = AspectRegistry.getAspectScale(aspectName);
			// set element values
			this.container.setScale("aspectScale", aspectAmount / 50);
			this.container.setText("stateText", parseInt(researchProgress * 100) + "%");
		}
		else{
			elements.resultIcon = {type: "image", x: 717, y: 235, scale: 2.8125, bitmap: "aspect_reactor_overlay"};
			this.container.setScale("aspectScale", 0);
			this.container.setText("stateText", "");
		}
	},
	
	updateItemsInSlots: function(elements){
		for (var name in elements){
			if (name.startsWith("IAspect")){
				elements[name] = null;
			}
		}
		this.updateSlot(elements, "slot1", {x: 567, y: 180});
		this.updateSlot(elements, "slot2", {x: 567, y: 380});
	},
	
	createClicker: function(aspectName, slotName){
		return {
			onClick: function(position, container, tileEntity){
				if (!AspectRegistry.isResearched(aspectName)){
					tileEntity.data.aspectSelection[slotName] = null;
				}
				else{
					tileEntity.data.aspectSelection[slotName] = aspectName;
				}
			}
		};
	},
	
	updateSlot: function(elements, slotName, coords){
		var slot = this.container.getSlot(slotName);
		var aspects = AspectRegistry.getAspectsForItem(slot.id, slot.data);
		var aspectNames = [];
		for (var name in aspects){
			aspectNames.push(name);
		}
		
		if (!aspects[this.data.aspectSelection[slotName]]){
			this.data.aspectSelection[slotName] = null;
		}
		
		var iconSize = Math.min(aspectNames.length * 44, 140) / aspectNames.length;
		var offsetY = coords.y - iconSize * .5 * aspectNames.length;
		for (var i in aspectNames){
			var aspectName = aspectNames[i];
			var aspectIcon = {type: "image", x: coords.x + (44 - iconSize) * .5, y: offsetY + i * iconSize, bitmap: AspectRegistry.getAspectIcon(aspectName), scale: iconSize / 32, clicker: this.createClicker(aspectName, slotName)};
			if (aspectName == this.data.aspectSelection[slotName]){
				aspectIcon.overlay = "aspect_selection";
			}
			elements["IAspect" + slotName + i] = aspectIcon;
		}
	}
});


IDRegistry.genBlockID("blockOreCrystal");

Block.createBlock("blockOreCrystal", [
	{name: "crystal ore", texture: [["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0], ["crystal_ore", 0]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1], ["crystal_ore", 1]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2], ["crystal_ore", 2]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3], ["crystal_ore", 3]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4], ["crystal_ore", 4]], inCreative: true},
	{name: "crystal ore", texture: [["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5], ["crystal_ore", 5]], inCreative: true},
], BLOCK_TYPE_SOLID_ORE);

ToolAPI.registerBlockMaterial(BlockID.blockOreCrystal, "stone");

Block.registerDropFunction("blockOreCrystal", function(coords, blockID, blockData, level){
	if (level < 2){
		return [];
	}
	var count = parseInt(1 + Math.random() * 2);
	switch (parseInt(blockData)){
		case 0:
		return [[IDData.item.itemCrystalAer, count, 0]];
		case 1:
		return [[IDData.item.itemCrystalTerra, count, 0]];
		case 2:
		return [[IDData.item.itemCrystalDark, count, 0]];
		case 3:
		return [[IDData.item.itemCrystalOrdo, count, 0]];
		case 4:
		return [[IDData.item.itemCrystalIgnis, count, 0]];
		case 5:
		return [[IDData.item.itemCrystalAqua, count, 0]];
	}
	return [];
}, 2);

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	for (var i = 0; i < 4 + Math.random() * 6; i++){
		var data = parseInt(Math.random() * 6);
		var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 12, 56);
		GenerationUtils.genMinable(coords.x, coords.y, coords.z, {size: 1, ratio: 1, checkerMode: 1, id: IDData.block.blockOreCrystal, data: data});
	}
});

Callback.addCallback("NativeGuiChanged", function(name){
	//alert(name);
})


IDRegistry.genBlockID("blockThaumTable");
Block.createBlock("blockThaumTable", [
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 1], ["research_table", 1], ["research_table", 1], ["research_table", 1]], inCreative: true}, // full
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 1], ["empty", 0], ["research_table", 4], ["research_table", 5]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["empty", 0], ["research_table", 1], ["research_table", 5], ["research_table", 4]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 5], ["research_table", 4], ["research_table", 1], ["empty", 0]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 2], ["research_table", 4], ["research_table", 5], ["empty", 0], ["research_table", 1]]},
]);

IDRegistry.genBlockID("blockResTable");
Block.createBlock("blockResTable", [
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 1], ["research_table", 1], ["research_table", 1], ["research_table", 1]]}, // full
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 1], ["empty", 0], ["research_table", 4], ["research_table", 5]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["empty", 0], ["research_table", 1], ["research_table", 5], ["research_table", 4]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 5], ["research_table", 4], ["research_table", 1], ["empty", 0]]},
	{name: "wooden table", texture: [["empty", 0], ["research_table", 0], ["research_table", 4], ["research_table", 5], ["empty", 0], ["research_table", 1]]},
]);


Recipes.addShaped({id: IDData.block.blockThaumTable, count: 1, data: 0}, ["XXX", "# #"], ["X", 158, -1, "#", 5, -1]);

function getTableMetaByOffset(x, z){
	var key = x + ":" + z;
	switch (key){
		case "1:0":
		return 3;
		case "-1:0":
		return 4;
		case "0:1":
		return 1;
		case "0:-1":
		return 2;
	}
	return 0;
}

function isTableTile(id){
	return id == IDData.block.blockThaumTable || id == IDData.block.blockResTable;
}

function thaumTablePlaceFunc(coords, item, data){
	var pos = coords.relative;
	var block = World.getBlock(pos.x, pos.y, pos.z);
	if (block.id == 0){
		var offsets = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		];
		for (var i in offsets){
			var offset = offsets[i];
			var tile = World.getBlock(pos.x + offset[0], pos.y, pos.z + offset[1]);
			if (isTableTile(tile.id)){
				World.setBlock(pos.x, pos.y, pos.z, item.id, getTableMetaByOffset(offset[0], offset[1]));
				World.setBlock(pos.x + offset[0], pos.y, pos.z + offset[1], tile.id, getTableMetaByOffset(-offset[0], -offset[1]));
				return;
			}
		};
		
		World.setBlock(pos.x, pos.y, pos.z, item.id, 0);
	}
	return pos;
}

function thaumTableDropFunc(coords, blockID, blockData){
	var offsets = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];
	for (var i in offsets){
		var offset = offsets[i];
		var tile = World.getBlock(coords.x + offset[0], coords.y, coords.z + offset[1]);
		if (isTableTile(tile.id)){
			if (getTableMetaByOffset(-offset[0], -offset[1]) == tile.data && tile.data > 0){
				World.setBlock(coords.x + offset[0], coords.y, coords.z + offset[1], IDData.block.blockThaumTable, 0);
			} 
		}
	}
	return [[IDData.block.blockThaumTable, 1, 0]];
}

Block.registerPlaceFunction("blockThaumTable", thaumTablePlaceFunc);
Block.registerDropFunction("blockThaumTable", thaumTableDropFunc);
Block.registerPlaceFunction("blockResTable", thaumTablePlaceFunc);
Block.registerDropFunction("blockResTable", thaumTableDropFunc);












var researchTableGui = new UI.StandartWindow();
researchTableGui.setContent({
	standart: {
		header: {
			text: {
				text: "Research table"
			},
			color: android.graphics.Color.rgb(0x47, 0x26, 0x0c),
			frame: "thaum_frame_header"
		},
		inventory: {
			standart: true
		},
		background: {
			bitmap: "thaum_background"
		},
		minHeight: 650
	},
	params: {
		textures: {
			slot: "thaum_slot",
			invSlot: "thaum_inv_slot",
			selection: "thaum_selection",
			closeButton: "thaum_close_button_up",
			closeButton2: "thaum_close_button_down",
			frame: "thaum_frame_default"
		}
	},
	drawing: [
		{type: "bitmap", x: 634, y: 88, bitmap: "aspect_scale_background", scale: 3},
		{type: "frame", x: 618, y: 72, width: 340, height: 304, bitmap: "thaum_frame_tin", scale: 5},
		{type: "frame", x: 695, y: 422, width: 172, height: 172, bitmap: "thaum_frame_tin", scale: 5}
	],
	elements: {
		"researchSlot": {type: "slot", x: 340, y: 60, size: 200},
		"pageSlot": {type: "slot", x: 340, y: 275, size: 100},
		"toolSlot": {type: "slot", x: 838, y: 220, size: 108},
		"aspectScale": {type: "scale", x: 640, y: 100, direction: 1, scale: 6, value: 1, bitmap: "aspectScale_nitor", overlay: "aspect_scale_overlay_1", overlayScale: 3},
		"aspectText1": {type: "text", x: 720, y: 90, width: 300, height: 50, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6}},
		"aspectText2": {type: "text", x: 720, y: 130, width: 300, height: 50, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6}},
		"pageName": {type: "text", x: 340, y: 375, width: 400, height: 50, text: "", font: {color: android.graphics.Color.WHITE, shadow: .6}},
	}
});


//(new UI.Container()).openAs(researchTableGui);

TileEntity.registerPrototype(IDData.block.blockResTable, {
	age: 0,
	tick: function(){
		var content = this.container.getGuiContent();
		if (content){
			/* refresh icons */
			var researchSlot = this.container.getSlot("researchSlot");
			var aspects = AspectRegistry.getAspectsForItem(researchSlot.id, researchSlot.data);
			var aspectNames = [];
			for (var name in aspects){
				aspectNames.push(name);
			}
			var selectedAmount = aspects[this.selectedAspect];
			if (!selectedAmount){
				this.selectedAspect = null;
			}
			
			/* */
			this.refreshIcons(content.elements, aspectNames, this.selectedAspect);
			this.refreshAspectData(content.elements, this.selectedAspect, selectedAmount);
			
			var pageSlot = this.container.getSlot("pageSlot");
			var research = null;
			if (pageSlot.id == IDData.item.itemResearchBookPage){
				research = ResearchRegistry.getResearchByID(pageSlot.data);
				if (research){
					this.container.setText("pageName", research.name);
				}
				else{
					this.container.setText("pageName", "corrupted page " + pageSlot.data);
				}
			}
			else{
				this.container.setText("pageName", "");
			}
			
			if (research){
				this.drawResearchLine(content.elements, research.aspectNames, research.progress, ResearchRegistry.getResearchPosition(research));
			}
			else{
				this.drawResearchLine(content.elements, [], {}, 0);
			}
			
			this.currentResearch = research;
		}
		
		if (this.animationQuill){
			//ParticleAnimation.particleSplash(this.animationQuill.coords, {id: 31}, {offset: true, vel: .3, count: 2});
		}
	},
	
	
	
	/* ------------ animation ------------ */
	
	init: function(){
		this.animationQuill = new Animation.item(this.x + parseInt(Math.random() * 2) * .4 + .3, this.y + 1.2, this.z + parseInt(Math.random() * 2) * .4 + .3);
		this.animationQuill.describeItem({id: IDData.item.itemScribingTools, count: 1, data: 0, size: .45, rotation: Math.random() > .5 ? "x" : "z"});
		this.animationQuill.load();
		
		ParticleAnimation.particleSplash(this.animationQuill.coords, {id: 31}, {offset: true, vel: .3, count: 100});
	},
	
	destroy: function(){
		if (this.animationQuill){
			this.animationQuill.destroy();
			ParticleAnimation.particleSplash(this.animationQuill.coords, {id: 31}, {offset: true, vel: .3, count: 100});
		}
		return false;
	},
	
	
	
	/* --------------- UI ---------------- */
	getClickerForAspect: function(aspectName){
		return {
			onClick: function(position, container, tileEntity){
				if (AspectRegistry.isResearched(aspectName)){
					tileEntity.selectedAspect = aspectName;
				}
				else{
					tileEntity.selectedAspect = null;
				}
			}
		};
	},
	
	refreshIcons: function(elements, aspects, selected){
		for (var name in elements){
			if (name.startsWith("IAspect")){
				elements[name] = null;
			}
		}
		var offsetY = 160 - 24 * aspects.length;
		for (var i in aspects){
			var aspectName = aspects[i];
			var aspectIcon = {type: "image", x: 560, y: offsetY + i * 48 + 32 * .05, bitmap: AspectRegistry.getAspectIcon(aspectName), scale: 1.4, clicker: this.getClickerForAspect(aspectName)};
			if (aspectName == selected){
				aspectIcon.overlay = "aspect_selection";
			}
			elements["IAspect" + i] = aspectIcon;
		}
	},
	
	refreshAspectData: function(elements, aspect, amount){
		if (aspect){
			// set scale
			elements.aspectScale.bitmap = "aspectScale_" + aspect;
			this.container.setScale("aspectScale", amount / 8);
			// set button
			elements.aspectButton = {type: "image", bitmap: "aspect_button_bg", x: 718, y: 220, scale: 6, overlay: AspectRegistry.getAspectIcon(aspect), overlayScale: 2, overlayOffset: {x: 22, y: 22}, clicker: {
					onClick: function(position, container, tileEntity){
						if (container.getSlot("toolSlot").id != IDData.item.itemScribingTools){
							return;
						}
						var research = tileEntity.currentResearch;
						if (research){
							var position = ResearchRegistry.getResearchPosition(research);
							var aspect = ResearchRegistry.getAspectAtPosition(research, position);
							
							if (tileEntity.selectedAspect == aspect && !ResearchRegistry.isResearchPositionComplete(research, position)){
								var slot = container.getSlot("researchSlot");
								var aspects = AspectRegistry.getAspectsForItem(slot.id, slot.data);
								if (aspects[aspect]){
									ResearchRegistry.advanceResearch(research, position, aspects[aspect]);
									slot.count--;
									container.validateSlot("researchSlot");
								}
							}
						}
					}
				}
			};
			// set text
			this.container.setText("aspectText1", amount + " of");
			this.container.setText("aspectText2", aspect);
		}
		else{
			// remove scale
			this.container.setScale("aspectScale", 0);
			// remove button
			elements.aspectButton = null;
			// remove text
			this.container.setText("aspectText1", "");
			this.container.setText("aspectText2", "");
		}
	},
	
	renderResearchPosition: 0,
	drawResearchLine: function(elements, aspectNames, aspectResearches, position){
		for (var name in elements){
			if (name.startsWith("RAspect")){
				elements[name] = null;
			}
		}
		
		var add = position - this.renderResearchPosition;
		this.renderResearchPosition += Math.min(.05, Math.max(-.05, add));
		
		for (var i in aspectNames){
			var name = aspectNames[i];
			var amount = aspectResearches[name];
			var stage = Math.min(4, Math.max(parseInt(amount * 4) || 0, 1)) - 1;
			elements["RAspect_bg" + i] = {type: "image", x: 709 + (i - this.renderResearchPosition) * 168, y: 436, bitmap: "research_unit_background_" + stage, scale: 2.25, overlay: AspectRegistry.getAspectIcon(name), overlayScale: 1.5, overlayOffset: {x: 12, y: 80}};
			elements["RAspect_text" + i] = {type: "text", isStatic: true, x: 779 + (i - this.renderResearchPosition) * 168, y: 548, text: parseInt(amount * 100 || 0) + "%", font: {color: android.graphics.Color.WHITE, shadow: .6, size: 17}};
		}
	},
	
	
	getGuiScreen: function(){
		return researchTableGui;
	}
});


IDRegistry.genBlockID("blockHellFurnaceCore");
IDRegistry.genBlockID("blockHellFurnaceDecor");

Block.createBlock("blockHellFurnaceCore", [
	{name: "hell furnace core", texture: [["hell_furnace", 2], ["hell_furnace", 0], ["hell_furnace", 2], ["hell_furnace", 2], ["hell_furnace", 2], ["hell_furnace", 2]], inCreative: true}
], BLOCK_TYPE_LOW_LIGHT);

Block.createBlock("blockHellFurnaceDecor", [
	{name: "tile.hellfurnace_decoration.name", texture: [["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1]]},
	{name: "tile.hellfurnace_decoration.name", texture: [["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1], ["hell_furnace", 1]]}
], BLOCK_TYPE_LOW_LIGHT);

Block.setBlockShape(IDData.block.blockHellFurnaceDecor, {x: .49, y: 0, z: 0}, {x: .51, y: 1, z: 1}, 0);
Block.setBlockShape(IDData.block.blockHellFurnaceDecor, {x: 0, y: 0, z: .49}, {x: 1, y: 1, z: .51}, 1);
Block.registerDropFunction("blockHellFurnaceDecor", function(coords, blockID, blockData, level){
	if (level > 2){
		return [[101, 1, 0]];
	}
	else{
		return [];
	}
});



var HELL_FURNACE_PATTERN = [
	// bot
	[-1, -2, -1, 112, 0],
	[-1, -2,  0,  49, 0],
	[-1, -2,  1, 112, 0],
	
	[ 0, -2, -1,  49, 0],
	[ 0, -2,  0, 112, 0],
	[ 0, -2,  1,  49, 0],
	
	[ 1, -2, -1, 112, 0],
	[ 1, -2,  0,  49, 0],
	[ 1, -2,  1, 112, 0],
	
	
	// mid
	[-1, -1, -1,  49, 0],
	[-1, -1,  0, 112, 0],
	[-1, -1,  1,  49, 0],
	
	[ 0, -1, -1, 112, 0],
	[ 0, -1,  0,  11, 0, 10],
	[ 0, -1,  1, 112, 0],
	
	[ 1, -1, -1,  49, 0],
	[ 1, -1,  0, 112, 0],
	[ 1, -1,  1,  49, 0],
	
	
	// top
	[-1,  0, -1, 112, 0],
	[-1,  0,  0,  49, 0],
	[-1,  0,  1, 112, 0],
	
	[ 0,  0, -1,  49, 0],
	[ 0,  0,  0, IDData.block.blockHellFurnaceCore, 0],
	[ 0,  0,  1,  49, 0],
	
	[ 1,  0, -1, 112, 0],
	[ 1,  0,  0,  49, 0],
	[ 1,  0,  1, 112, 0],
]

TileEntity.registerPrototype(IDData.block.blockHellFurnaceCore, {
	defaultValues: {
		stack: [],
		hasPattern: false,
		hasPatternTemp: false,
		checkingTick: 0,
	},
	
	tick: function(){
		this.continuouslyCheckPattern();
		
		if (this.data.hasPattern){
			if (World.getThreadTime() % 5 == 0){
				var drop = Entity.findNearest({x: this.x + .5, y: this.y + 1, z: this.z + .5}, 64, .8);
				if (drop){
					this.addItem(drop);
				}
			}
			
			var exitCoords = this.exitCoords;
			for (var i in this.data.stack){
				var item = this.data.stack[i];
				if (item.time++ > 200){
					this.data.stack.splice(i--, 1);
					if (exitCoords){
						Entity.setVelocity(World.drop(this.x + exitCoords.x * 1.5 + .5, this.y + exitCoords.y + .5, this.z + exitCoords.z * 1.5 + .5, item.id, item.count, item.data), exitCoords.x * .1, 0, exitCoords.z * .1);
						Aura.leakEssenceStack({x: this.x + exitCoords.x * 2 + .5, y: this.y + exitCoords.y + .5, z: this.z + exitCoords.z * 1.5 + .5}, {flux: item.count * .02, ignis: item.count * .08}, true);
					}
				}
			}
		}
		
	},
	
	addItem: function(item){
		var container = Entity.getInventory(item);
		container.refreshItem();
		var slot = container.getSlot("item");
		var result = Recipes.getFurnaceRecipeResult(slot.id, "hellish");
		if (result){
			Entity.remove(item);
			this.data.stack.push({id: result.id, count: slot.count, data: result.data, time: 0});
		}
	},
	
	destroy: function(){
		this.findRelativeExitCoords(false, true);
	},
	
	
	
	
	
	
	
	findRelativeExitCoords: function(replaceTile, replaceBack){
		var possibleCoords = [
			{x: -1, y: -1, z: 0, decor: 0},
			{x: 1, y: -1, z: 0, decor: 0},
			{x: 0, y: -1, z: -1, decor: 1},
			{x: 0, y: -1, z: 1, decor: 1},
		];
		for (var i in possibleCoords){
			var tile = World.getBlock(this.x + possibleCoords[i].x, this.y + possibleCoords[i].y, this.z + possibleCoords[i].z).id;
			if (tile == 101 || tile == IDData.block.blockHellFurnaceDecor){
				if (replaceTile && tile == 101){
					World.setBlock(this.x + possibleCoords[i].x, this.y + possibleCoords[i].y, this.z + possibleCoords[i].z, IDData.block.blockHellFurnaceDecor, possibleCoords[i].decor);
				}
				if (replaceBack){
					World.setBlock(this.x + possibleCoords[i].x, this.y + possibleCoords[i].y, this.z + possibleCoords[i].z, 101, 0);
				}
				return possibleCoords[i];
			}
		}
	},
	
	continuouslyCheckPattern: function(){
		if (!this.exitCoords || this.data.checkingTick == 0){
			this.exitCoords = this.findRelativeExitCoords(this.data.hasPattern);
		}
		if (!this.exitCoords){
			this.data.hasPattern = false;
			return;
		}
		
		if (this.data.checkingTick == 0){
			if (this.data.hasPattern && !this.data.hasPatternTemp){
				this.findRelativeExitCoords(false, true);
			}
			this.data.hasPattern = this.data.hasPatternTemp;
			this.data.hasPatternTemp = true;
		}
		
		var checking = HELL_FURNACE_PATTERN[this.data.checkingTick];
		if (!(checking[0] == this.exitCoords.x && checking[1] == this.exitCoords.y && checking[2] == this.exitCoords.z)){
			var tile = World.getBlock(this.x + checking[0], this.y + checking[1], this.z + checking[2]);
			if ((tile.id != checking[3] || tile.data != checking[4]) && tile.id != checking[5]){
				this.data.checkingTick = 0;
				this.data.hasPatternTemp = false;
				return;
			}
		}
		
		this.data.checkingTick++;
		this.data.checkingTick %= HELL_FURNACE_PATTERN.length;
	}
});


IDRegistry.genItemID("itemCrystalOrdo");
IDRegistry.genItemID("itemCrystalAer");
IDRegistry.genItemID("itemCrystalIgnis");
IDRegistry.genItemID("itemCrystalAqua");
IDRegistry.genItemID("itemCrystalTerra");
IDRegistry.genItemID("itemCrystalDark");

Item.createItem("itemCrystalAer", "aer shard", {name: "shard", meta: 0});
Item.createItem("itemCrystalTerra", "terra shard", {name: "shard", meta: 1});
Item.createItem("itemCrystalDark", "dark shard", {name: "shard", meta: 2});
Item.createItem("itemCrystalOrdo", "ordo shard", {name: "shard", meta: 3});
Item.createItem("itemCrystalIgnis", "ignis shard", {name: "shard", meta: 4});
Item.createItem("itemCrystalAqua", "aqua shard", {name: "shard", meta: 5});

/*
IDRegistry.genItemID("testPickaxe");
Item.createItem("testPickaxe", "test pickaxe", {name: "shard", meta: 0});
ToolAPI.registerTool(ItemID.testPickaxe, "iron", ["stone"], {damage: 2, onAttack: function(carried, entity){
		Entity.setFire(entity, 5);
	}
});*/


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


IDRegistry.genItemID("itemNitor");
Item.createItem("itemNitor", "nitor", {name: "nitor"});

Item.registerUseFunctionForID(IDData.item.itemNitor, function(coords, item, block){
	var place = coords.relative;
	if (World.getBlockID(place.x, place.y, place.z) == 0){
		World.setBlock(place.x, place.y, place.z, IDData.block.blockNitor);
		World.addTileEntity(place.x, place.y, place.z);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});


IDRegistry.genItemID("itemAlumentum");
Item.createThrowableItem("itemAlumentum", "alumentum", {name: "alumentum"});

Item.registerThrowableFunction("itemAlumentum", function(projectile, item, target){
	World.explode(target.x, target.y, target.z, 2, true);
});


// ingot
IDRegistry.genItemID("itemThaumIngot");
Item.createItem("itemThaumIngot", "thaumium ingot", {name: "thaum_ingot"});

// armor
IDRegistry.genItemID("itemThaumHelmet");
IDRegistry.genItemID("itemThaumChestplate");
IDRegistry.genItemID("itemThaumLeggings");
IDRegistry.genItemID("itemThaumBoots");

// full set gives 19 armor
Item.createArmorItem("itemThaumHelmet", "thaumium helmet", {name: "thaum_helmet"}, {type: "helmet", armor: 4, durability: 812, texture: "armor/thaum_armor_1.png"});
Item.createArmorItem("itemThaumChestplate", "thaumium chestplate", {name: "thaum_chest"}, {type: "chestplate", armor: 6, durability: 812, texture: "armor/thaum_armor_1.png"});
Item.createArmorItem("itemThaumLeggings", "thaumium leggings", {name: "thaum_leggins"}, {type: "leggings", armor: 5, durability: 812, texture: "armor/thaum_armor_2.png"});
Item.createArmorItem("itemThaumBoots", "thaumium boots", {name: "thaum_boots"}, {type: "boots", armor: 4, durability: 812, texture: "armor/thaum_armor_1.png"});

var THAUM_ARMOR_INTERACT_FUNCS = {
	hurt: function(attacker, damage, slot, inventory, index){
		if (attacker && Math.random() < .25){
			ParticleAnimation.FadeBolt.connectingBolt(Player.getPosition(), Entity.getPosition(attacker), 4, 4, 2);
			Entity.damageEntity(attacker, damage + 1);
			World.playSoundAtEntity(attacker, "random.explode", 100);
		}
	}
};

Armor.registerFuncs("itemThaumHelmet", THAUM_ARMOR_INTERACT_FUNCS);
Armor.registerFuncs("itemThaumChestplate", THAUM_ARMOR_INTERACT_FUNCS);
Armor.registerFuncs("itemThaumLeggings", THAUM_ARMOR_INTERACT_FUNCS);
Armor.registerFuncs("itemThaumBoots", THAUM_ARMOR_INTERACT_FUNCS);


IDRegistry.genItemID("itemGoogles");

Item.createArmorItem("itemGoogles", "googles of true sight", {name: "thaum_googles"}, {armor: 1, type: "helmet", texture: "armor/thaum_googles_1.png", durability: 2048});


IDRegistry.genItemID("itemResearchBook");
Item.createItem("itemResearchBook", "thaumonomicon", {name: "thaumonomicon"});

Item.registerUseFunctionForID(IDData.item.itemResearchBook, function(coords, item, block){
	ResearchBookUIBuilder.openMainScreen();
});


IDRegistry.genItemID("itemResearchBookPage");
Item.createItem("itemResearchBookPage", "research page", {name: "research_page"}, {stack: 1, isTech: true});


IDRegistry.genItemID("itemQuill");
Item.createItem("itemQuill", "quill", {name: "quill"});


IDRegistry.genItemID("itemScribingTools");
Item.createItem("itemScribingTools", "scribing tools", {name: "scribing_tools"}, {stack: 1});

Recipes.addShapeless({id: IDData.item.itemScribingTools, count: 1, data: 0}, [{id: 288, data: 0}, {id: 351, data: 0}, {id: 374, data: 0}]);

Item.registerUseFunction("itemScribingTools", function(coords, item, block){
	if (block.id == IDData.block.blockThaumTable && block.data > 0){
		var offsets = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		];
		var canActivate = false;
		for (var i in offsets){
			var offset = offsets[i];
			var tile = World.getBlock(coords.x + offset[0], coords.y, coords.z + offset[1]);
			if (tile.data == getTableMetaByOffset(-offset[0], -offset[1])){
				if (tile.id == IDData.block.blockResTable){
					canActivate = false;
					break;
				}
				if (tile.id == IDData.block.blockThaumTable && block.data == getTableMetaByOffset(offset[0], offset[1])){
					canActivate = true;
				}
			}
		}
		
		if (canActivate && !World.getTileEntity(coords.x, coords.y, coords.z)){
			World.setBlock(coords.x, coords.y, coords.z, IDData.block.blockResTable, block.data);
			var resTable = World.addTileEntity(coords.x, coords.y, coords.z);
			var toolSlot = resTable.container.getSlot("toolSlot");
			toolSlot.id = item.id;
			toolSlot.count = item.count;
			toolSlot.data = item.data;
			Player.setCarriedItem(0, 0, 0);
		}
	}
});


IDRegistry.genItemID("itemThaumWand");
Item.createItem("itemThaumWand", "wand", {name: "wand", meta: 0});

IDRegistry.genItemID("itemThaumWandCap");
Item.createItem("itemThaumWandCap", "wand cap", {name: "wand_cap", meta: 0});

Recipes.addShaped({id: IDData.item.itemThaumWandCap, count: 4, data: 0}, [" X ", "X X"], ["X", 265, 0]);
Recipes.addShaped({id: IDData.item.itemThaumWand, count: 1, data: 0}, ["  X", " # ", "X  "], ["X", IDData.item.itemThaumWandCap, 0, "#", 280, 0]);
Recipes.addShaped({id: IDData.item.itemThaumWand, count: 1, data: 0}, ["X  ", " # ", "  X"], ["X", IDData.item.itemThaumWandCap, 0, "#", 280, 0]);

Item.registerUseFunctionForID(IDData.item.itemThaumWand, function(coords, item, block){
	if (block.id == 47){
		var drop = World.drop(coords.x + .5, coords.y + .5, coords.z + .5, IDData.item.itemResearchBook, 1, 0);
		UpdatableAPI.addUpdatable({
			dropEntity: drop,
			update: function(){
				if (!Entity.isExist(this.dropEntity)){
					this.remove = true;
					return;
				}
				var pos = Entity.getPosition(this.dropEntity);
				pos.y += .26;
				ParticleAnimation.particleSplash(pos, {id: 31}, {offset: true, vel: .3, count: 6});
				
				if (Math.random() < .1){
					ParticleAnimation.FadeBolt.randomBolt(pos, .7, 2, 1);
				}
			}
		});
		World.setBlock(coords.x, coords.y, coords.z, 0);
	}
	
	if (block.id == 118 && ResearchRegistry.isResearched("alchemy")){
		World.setBlock(coords.x, coords.y, coords.z, IDData.block.blockThaumCrucible, 0);
		var tileEntity = World.addTileEntity(coords.x, coords.y, coords.z);
		tileEntity.animate(100);
	}
	
	if (block.id == IDData.block.blockThaumTable && block.data == 0 && ResearchRegistry.isResearched("arcane workbench")){
		World.setBlock(coords.x, coords.y, coords.z, IDData.block.blockArcaneWorkbench, 0);
		var tileEntity = World.addTileEntity(coords.x, coords.y, coords.z);
	}
})



var CoreEngineGuiUtils = ModAPI.requireGlobal("GuiUtils");
/*
Callback.addCallback("PostLoaded", function(){
	var ctx = ModAPI.requireGlobal("getMcContext()");
	var parent = ctx.getWindow().getDecorView();
	parent.setOnTouchListener({
		onTouch: function(view, event){
			try{
				WandUseAnimator.registerScreenTouchEvent(view, event);
			}catch(e){
				alert("thaumcraft wand ui error: " + e);
			}
			return true;
		}
	});
	
});*/


var WandUseAnimator = {
	lastRegistredPosition: null,
	
	registerScreenTouchEvent: function(view, event){
		if (!this.ctx || !this.size){
			this.ctx = ModAPI.requireGlobal("getMcContext()");
			this.size = ModAPI.requireGlobal("GuiCore.getDisplaySize()");
		}
		
		if (World.isWorldLoaded()){
			var touchX = (event.getRawX() - this.size[0] / 2) / (this.size[0] / 2);
			var touchY = -(event.getRawY() - this.size[1] / 2) / (this.size[0] / 2);
			var player = Player.getPosition();
			
			var look = Entity.getLookVector(Player.get());
			var xzlen = Math.sqrt(look.x * look.x + look.z * look.z);
			var screenpos = {
				x: (touchX * -look.z / xzlen) + (touchY * -look.y * look.x / xzlen),
				y: touchY * xzlen,
				z: (touchX * look.x / xzlen) + (touchY * -look.y * look.z / xzlen)
			}
			
			var depth = 1.75;
			this.registerAnimationPosition(event, player.x + (look.x + screenpos.x) * depth, player.y + (look.y + screenpos.y) * depth, player.z + (look.z + screenpos.z) * depth);
		}
	},
	
	registerAnimationPosition: function(event, x, y, z){
		var action = event.getAction();
		var pos = {x: x, y: y, z: z};
		if (this.lastRegistredPosition){
			Particles.line(31, this.lastRegistredPosition, pos, 0.02);
		}
		this.lastRegistredPosition = pos;
		if(action == 1){
			this.lastRegistredPosition = null;
		}
	},
	
	animateAspect: function(aspectName){
		var aspect = AspectRegistry.getAspect(aspectName);
		if (aspect){
			ParticleAnimation.particleSplash(this.lastRegistredPosition, {id: 26, data: aspect.getFinalColor()}, {count: 20});
		}
	},
	
	fixatedLookAngle: null,
	fixatePlayerLook: function(){
		if (!this.fixatedLookAngle){
			this.fixatedLookAngle = Entity.getLookAngle(Player.get());
		}
		else{
			Entity.setLookAngle(Player.get(), this.fixatedLookAngle.yaw, this.fixatedLookAngle.pitch);
		}
	},
	
	removeFixation: function(){
		this.fixatedLookAngle = null;
	}
}

var WandUI = {
	aspectViews: [],
	
	close: function(index){
		var self = this;
		CoreEngineGuiUtils.Run(function(){
			if (self.aspectViews[index]){
				self.aspectViews[index].window.dismiss();
				delete(self.aspectViews[index]);
			}
		})
	},
	
	closeAll: function(){
		for (var index in this.aspectViews){
			this.close(index);
		}
	},
	
	getAspectSelected: function(x, y){
		for (var i in this.aspectViews){
			var rect = this.aspectViews[i].rect;
			if (rect && x > rect[0] && y > rect[1] && x < rect[2] && y < rect[3]){
				return this.aspectViews[i].name;
			}
		}
	},
	
	lastAspectTriggered: null,
	isNewAspectTriggered: function(name){
		if (this.lastAspectTriggered != name){
			this.lastAspectTriggered = name;
			return true;
		}
		return false;
	},
	
	noAspectTriggered: function(){
		return this.isNewAspectTriggered(null);
	},
	
	addAspect: function(position, aspectName, onClicked){
		var ctx = ModAPI.requireGlobal("getMcContext()");
		var size = ModAPI.requireGlobal("GuiCore.getDisplaySize()");
		var parent = ctx.getWindow().getDecorView();
		
		var width = size[1] * .125;
		var aspectView = {
			window: new android.widget.PopupWindow(ctx),
			view: new android.widget.ImageView(ctx),
			name: aspectName,
			rect: [position.x - width * .5, position.y - width * .5, position.x + width * .5, position.y + width * .5]
		}
		
		this.aspectViews.push(aspectView);
		
		var self = this;
		CoreEngineGuiUtils.Run(function(){
			aspectView.window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
			aspectView.window.setContentView(aspectView.view);
			aspectView.window.setWidth(width);
			aspectView.window.setHeight(width);
			aspectView.window.showAtLocation(parent, android.view.Gravity.TOP | android.view.Gravity.LEFT, position.x - width * .5, position.y - width * .5);
			
			var bitmapCache = ModAPI.requireGlobal("GuiCore.BitmapCache");
			var bitmap = bitmapCache.getScaled("aspectIcon_" + aspectName, 4);
			if (bitmap){
				aspectView.view.setImageBitmap(bitmap);
			}
			
			aspectView.view.setOnTouchListener({
				onTouch: function(view, event){
					try{
						WandUseAnimator.registerScreenTouchEvent(view, event);
						
						var aspectSelected = self.getAspectSelected(event.getRawX(), event.getRawY());
						if (self.isNewAspectTriggered(aspectSelected)){
							if (onClicked && aspectSelected){
								onClicked(aspectSelected);
								WandUseAnimator.animateAspect(aspectSelected);
							}
						}
						if (event.getAction() == 1){
							self.noAspectTriggered();
							WandSpellBuilder.completeSpell();
						}
					}catch(e){
						alert("thaumcraft wand ui error: " + e);
					}
					return true;
				}
			});
			
		});
	},
	
	openArrayOfAspects: function(aspectArray, onClicked){
		this.closeAll();
		var size = ModAPI.requireGlobal("GuiCore.getDisplaySize()");
		var radius = size[1] * .32;
		for (var i in aspectArray){
			var angle = Math.PI * 2 * i / aspectArray.length;
			this.addAspect({
				x: Math.sin(angle) * radius + size[0] * .5,
				y: Math.cos(angle) * radius + size[1] * .5,
			}, aspectArray[i], onClicked);
		}
	}
}
/*
WandUI.openArrayOfAspects(["aer", "terra", "ordo", "ignis", "nitor", "flux", "potentia"], function(name){
	WandSpellBuilder.addAspect(name);
});*/



var WandSpellBuilder = {
	currentAspects: [],
	
	
	getMaxAspects: function(){
		return 7;
	},
	
	
	addAspect: function(aspectName){
		var source = AspectRegistry.getInifiniteSource(aspectName);
		if (source){
			this.addAspectSource(source);
		}
	},
	
	addAspectSource: function(source){
		this.currentAspects.push(source);
		if (this.getMaxAspects() <= this.currentAspects.length){
			this.completeSpell();
		}
	},
	
	cancelSpell: function(){
		this.currentAspects = [];
	},
	
	completeSpell: function(){
		if (this.currentAspects.length > 0){
			var spell = SpellBuilder.buildSpell(this.currentAspects);
			var playerPos = Player.getPosition();
			var playerLook = Entity.getLookVector(Player.get());
			
			spell.setTargetVector(playerLook);
			spell.setCasterEntity(Player.get());
			spell.cast(playerPos.x + playerLook.x, playerPos.y + playerLook.y, playerPos.z + playerLook.z);
		}
		this.cancelSpell();
	}
}


var BIG_TEXT_THREAD_ID = 0;

function CreateBigText(text, rgb, startSize, textTime){
	var ctx = UI.getMcContext();
	
	var window = new android.widget.PopupWindow(ctx);
	var view = new android.widget.TextView(ctx);
	var screensize = ModAPI.requireGlobal("GuiUtils.GetDisplaySize()");
	UI.run(function(){
		var parent = ctx.getWindow().getDecorView();
		view.setGravity(0x11);
		view.setTextColor(android.graphics.Color.argb(0, rgb.r, rgb.g, rgb.b));
		view.setTypeface(ModAPI.requireGlobal("GuiLoader.minecraftTypeface"));
		window.setContentView(view);
		window.setWidth(screensize[0]);
		window.setHeight(screensize[1]);
		window.setTouchable(false);
		window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
		window.showAtLocation(parent, android.view.Gravity.TOP | android.view.Gravity.LEFT, 0, 0);
	});
	
	var size = startSize;
	var sizescale = screensize[0] / 1024;
	var tick = 0;
	var thread = Threading.initThread("bigText" + BIG_TEXT_THREAD_ID++, function(){
		while(size > 0){
			UI.run(function(){
				tick++;
				if (tick % 4 > 1){
					view.setTextColor(android.graphics.Color.argb(Math.min(255, tick * 8), rgb.r, rgb.g, rgb.b));
				}
				else{
					view.setTextColor(android.graphics.Color.argb(Math.min(255, tick * 8), 0, 0, 0));
				}
				view.setText(text);
				view.setTextSize(parseInt(size + 50) * sizescale);
				size -= (startSize - size) / startSize * 10 + 0.1;
			});
			java.lang.Thread.sleep(20);
		}
		UI.run(function(){
			view.setTextColor(android.graphics.Color.argb(Math.min(255, tick * 8), rgb.r, rgb.g, rgb.b));
		});
		java.lang.Thread.sleep(textTime || 1800);
		UI.run(function(){
			window.dismiss();
		});
	}, -5, true);
}


Callback.addCallback("NativeCommand", function(command){
	var splitted = command.split(" ");
	if (splitted.shift() == "thaum"){
		if (__config__.access("enable_cheats")){
			Callback.invokeCallback("ThaumcraftCommand", splitted.shift(), splitted);
		}
		else{
			Game.message("Thaumcraft PE cheats are disabled");
			Game.message("enable_cheats:true in mod config to enable");
		}
	}
});

Callback.addCallback("ThaumcraftCommand", function(name, params){
	switch(name){
		case "help":
			Game.message("----- thaumcraft pe help -----");
			Game.message("/thaum research <aspects|book>");
			break;
		case "research":
			if (params[0] == "aspects"){
				for (var name in AspectRegistry.aspects){
					AspectRegistry.setResearched(name);
				}
				Game.message("all aspects pages researched");
			}
			else if (params[0] == "book"){
				for (var name in ResearchRegistry.researches){
					ResearchRegistry.setResearched(name);
				}
				Game.message("all book pages researched");
			}
			else{
				Game.message("use /thaum research <aspects|book>");
			}
			break;
	}
});


var ThaumAddonAPI = {
	registerAddon: function(name, author){
		Logger.Log("thaumcraft pe addon registred and loaded: " + name + (author ? " by " + author : "") + "\naddon core: thaumcraft addon API & Core Engine API\nCore Engine API level: " + getCoreAPILevel(), LOGGER_TAG);
	},
	
	requireThaumcraftGlobal: function(name){
		return eval(name);
	},
	
	Aspect: {
		Registry: AspectRegistry,
		Storage: AspectStorage
	},
	
	Aura: {
		Core: Aura,
		Interaction: MagicInteraction
	},
	
	Research: {
		Registry: ResearchRegistry
	},
	
	Recipe: {
		Workbench: ArcaneWorkbenchHelper,
		Crucible: CrucibleHandler
	}
}

ModAPI.registerAPI("ThaumAPICore", ThaumAPI);
ModAPI.registerAPI("ThaumAPI", ThaumAddonAPI);

ModAPI.addAPICallback("ThaumAPI", function(){
	Logger.Log("Thaumсraft API is registred and can be accessed by ModAPI.requireAPI(\"ThaumAPI\")", LOGGER_TAG);
});


