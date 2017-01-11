var WandSpellBuilder = {
	currentAspects: [],
	
	
	getMaxAspects: function(){
		return 7;
	},
	
	
	addAspect: function(aspectName){
		var source = AspectRegistry.getInifiniteSource(aspectName);
		if (source){
			this.addAspectSource(source);
		}
	},
	
	addAspectSource: function(source){
		this.currentAspects.push(source);
		if (this.getMaxAspects() <= this.currentAspects.length){
			this.completeSpell();
		}
	},
	
	cancelSpell: function(){
		this.currentAspects = [];
	},
	
	completeSpell: function(){
		if (this.currentAspects.length > 0){
			var spell = SpellBuilder.buildSpell(this.currentAspects);
			var playerPos = Player.getPosition();
			var playerLook = Entity.getLookVector(Player.get());
			
			spell.setTargetVector(playerLook);
			spell.setCasterEntity(Player.get());
			spell.cast(playerPos.x + playerLook.x, playerPos.y + playerLook.y, playerPos.z + playerLook.z);
		}
		this.cancelSpell();
	}
}