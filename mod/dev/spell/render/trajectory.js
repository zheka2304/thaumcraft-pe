
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