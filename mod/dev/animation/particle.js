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