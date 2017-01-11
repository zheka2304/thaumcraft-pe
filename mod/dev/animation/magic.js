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