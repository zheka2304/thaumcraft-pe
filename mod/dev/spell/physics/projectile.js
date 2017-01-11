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