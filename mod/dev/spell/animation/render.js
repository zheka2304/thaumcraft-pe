function SpellAnimation(x, y, z){
	this.parent = Animation.Base;
	this.parent(x, y, z);
	
	this.describeSpell = function(texture, size, rotation){
		var size = texture.convertSize(size);
		var render = new Render();
		render.setPart("body", [{
			type: "box",
			coords: {
				x: 0,
				y: 25,
				z: 0,
			},
			size: {
				x: size,
				y: size,
				z: 0
			},
			uv: {
				x: 0,
				y: 0
			}
		}], {width: size * 2, height: size * 2});
		
		this.describe({
			renderAPI: render,
			skin: texture.getSkin()
		});
		
		return this;
	}
}

Callback.addCallback("ItemUse", function(coords, item, block){
	if (item.id == 264){
		var textureSet = [TEXTURE_SET_MYSTIC, TEXTURE_SET_FIRE, TEXTURE_SET_ARCANE, TEXTURE_SET_LIFE][parseInt(Math.random() * 4)];
		var texture = textureSet.getRandom();
		(new SpellAnimation(coords.relative.x + .5, coords.relative.y + 1.5, coords.relative.z + .5).describeSpell(texture, 32)).load();
	}
});