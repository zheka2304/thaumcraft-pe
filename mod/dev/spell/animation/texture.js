function SpellAnimationTexture(name, radius){
	this.name = name;
	this.radius = radius;
	
	this.convertSize = function(size){
		return parseInt(size * 256 / (radius * 2));
	}
	
	this.getSkin = function(){
		return this.name;
	}
}

function SpellTextureSet(textures){
	this.textures = textures || [];
	
	this.getRandom = function(){
		return this.textures[parseInt(Math.random() * this.textures.length)];
	}
	
	this.get = function(index){
		return this.textures[index];
	}
}

var TEXTURE_SET_FIRE = new SpellTextureSet([
	new SpellAnimationTexture("spell_fire_0.png", 128),
	new SpellAnimationTexture("spell_fire_1.png", 128),
	new SpellAnimationTexture("spell_fire_2.png", 128),
]);

var TEXTURE_SET_MYSTIC = new SpellTextureSet([
	new SpellAnimationTexture("spell_mystic_0.png", 128),
	new SpellAnimationTexture("spell_mystic_1.png", 128),
	new SpellAnimationTexture("spell_mystic_2.png", 128),
]);

var TEXTURE_SET_LIFE = new SpellTextureSet([
	new SpellAnimationTexture("spell_life_0.png", 128),
]);

var TEXTURE_SET_ARCANE = new SpellTextureSet([
	new SpellAnimationTexture("spell_arcane_0.png", 128),
	new SpellAnimationTexture("spell_arcane_1.png", 128),
	new SpellAnimationTexture("spell_arcane_2.png", 128),
	new SpellAnimationTexture("spell_arcane_3.png", 128),
]);