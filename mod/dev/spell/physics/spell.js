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