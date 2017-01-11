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