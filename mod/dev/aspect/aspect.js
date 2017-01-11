function Aspect(name){
	/* core params */
	this.name = name;
	this.icon = null;
	/* stability - 0 means most active mutation chance, 1 - least*/
	this.stability = 0;
	/* power 0 - neutral, -1 - negative, 1 - positive */
	this.power = 0;
	/* aspect type - aspect with close types react more stable and fast, with more far - unstable */
	this.type = 0;
	/* aspect element - type of world interaction */
	this.element = "none";
	/* spell id for spell casting */
	this.spellID = 0;
	/* graphics */
	this.color = {
		r: 0,
		g: 0,
		b: 0
	};
	
	this.setup = function(customParams, graphicsParams){
		if (customParams){
			this.power = customParams.power || 0;
			this.type = customParams.type || 0;
			this.stability = customParams.stability || 0;
			this.spellID = customParams.spellID || 1;
			this.element = customParams.element || "none";
		}
		if (graphicsParams){
			if (graphicsParams.color){
				this.color = graphicsParams.color;
			}
			if (graphicsParams.icon){
				this.icon = graphicsParams.icon;
			}
		}
		return this;
	}
	
	
	
	this.setColor = function(r, g, b){
		this.color = {
			r: r,
			g: g,
			b: b
		}
	}
	
	this.getFinalColor = function(){
		return (this.color.r * 256 + this.color.g) * 256 + this.color.b;
	}	
}
