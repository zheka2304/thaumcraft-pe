var SPELL_EXECUTION_TYPE_NORMAL = "spell_normal_execution";
var SPELL_EXECUTION_TYPE_FIRST = "spell_first_execution";

var DEFAULT_SPELL_MAX_AGE = 30 * 20;

function Spell(sourceGroup){
	this.sourceGroup = sourceGroup;
	
	this.schemes = {
		
	}
	
	this.setScheme = function(name, scheme){
		this.schemes[name] = scheme;
	}
	
	this.execScheme = function(name, params){
		var scheme = this.schemes[name];
		if (scheme){
			scheme.execForSpell(this, params);
		}
	}
	
	
	
	/* basic spell entity logic */
	this.__age = 0;
	
	this.position = {
		x: 0,
		y: 0, 
		z: 0
	};
	
	this.setPosition = function(x, y, z){
		this.position = {
			x: x,
			y: y,
			z: z
		};
	}
	
	this.move = function(x, y, z){
		this.position.x += x;
		this.position.y += y;
		this.position.z += z;
	}
	
	this.moveTo = function(x, y, z, speed){
		var delta = {
			x: x - this.position.x, 
			y: y - this.position.y, 
			z: z - this.position.z
		};
		var dis = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z);
		var add = Math.min(speed, dis);
		this.move(
			delta.x / dis * add,
			delta.y / dis * add,
			delta.z / dis * add
		);
	}
	
	this.moveToTarget = function(speed){
		if (this.target){
			this.moveTo(this.target.position.x, this.target.position.y, this.target.position.z, speed);
		}
	}
	
	
	this.load = function(){
		this.__age = 0;
		SpellUpdatableRegistry.registerSpell(this);
		UpdatableAPI.addUpdatable(this);
		Debug.message(this);
	}
	
	this.cast = function(x, y, z){
		this.setPosition(x, y, z);
		this.load();
	}
	
	
	
	this.targetVector = null;
	this.setTargetVector = function(vec){
		this.targetVector = vec;
	}
	
	this.targetTile = function(x, y, z){
		this.setTarget({
			position: {
				x: x,
				y: y,
				z: z
			}
		});
	}
	
	this.targetEntity = function(entity){
		if (entity){
			this.setTarget({
				entity: entity
			});
		}
		else{
			this.setTarget(null);
		}
	}
	
	
	
	this.casterEntity = null;
	this.setCasterEntity = function(entity){
		this.casterEntity = entity;
	}
	
	
	
	this.destroy = function(){
		this.remove = true;
		SpellUpdatableRegistry.unregisterSpell(this);
	}
	
	this.toString = function(){
		var spellNames = [];
		for (var i in this.sourceGroup){
			spellNames.push(this.sourceGroup[i].name());
		}
		return "spell: " + spellNames.join(", ");
	}
	
	/* basic spell action logic */
	
	this.target = null;
	this.setTarget = function(target){
		this.target = target;
	}
	
	this.isTargetReached = function(){
		if (this.target && this.target.position){
			if(Entity.getDistanceBetweenCoords(this.target.position, this.position) < 1){
				return true;
			}
		}
		return false;
	}
	
	this.interactionDelay = 0;
	this.interactionCount = 0;
	
	this.delayInteraction = function(ticks){
		this.interactionDelay = ticks;
	}
	
	this.getInteractionCount = function(){
		return this.interactionCount;
	}
	
	this.continueInteraction = false;
	this.setContinueInteraction = function(){
		this.continueInteraction = true;
	}
	
	this.update = function(){
		var age = this.__age ++;
		
		if (age > DEFAULT_SPELL_MAX_AGE){
			this.destroy();
			return;
		}
		// DEBUG
		if (!this.target){
			this.targetEntity(SpellHelper.findEntityTarget(this));
			if (!this.target){
				Debug.warning("spell cannot find target");
				this.destroy();
			}
			return;
		}
		
		if (this.target.entity){
			this.target.position = Entity.getPosition(this.target.entity);
		}
		
		if (this.isTargetReached()){
			this.execScheme("interact");
			this.execScheme("animate");
			this.destroy();
		}
		else{
			this.execScheme("move");
		}
	}
}