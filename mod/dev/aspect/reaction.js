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