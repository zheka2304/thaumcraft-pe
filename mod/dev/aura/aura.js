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


