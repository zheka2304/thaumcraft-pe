var INTERACTIVE_ASPECT_AMOUNT = 8;

/*
 * object, thats provides aspect essence storing
*/

function AspectStorage(){
	this.aspectAmounts = {};
	this.aspectNames = [];
	
	/* ------------------------- BASIC ------------------------- */
	/* cleans storage */
	this.clear = function(){
		this.aspectNames.splice(0, this.aspectNames.length);
		for (var name in this.aspectAmounts){
			delete this.aspectAmounts[name];
		}
		this.validate();
	}
	
	/* counts essences */
	this.getCount = function(){
		return this.aspectNames.length;
	}
	
	/* returns random aspect name/aspect object from storage */
	this.getRandomName = function(){
		return this.aspectNames[parseInt(this.aspectNames.length * Math.random())];
	}
	
	this.getRandomAspect = function(){
		return AspectRegistry.getAspect(this.getRandomName());
	}
	
	/* returns if storage has given aspect registred */
	this.hasEssenceByName = function(aspectName){
		return this.aspectAmounts[aspectName] || this.aspectAmounts[aspectName] == 0;
	}
	
	this.hasEssence = function(aspect){
		if (aspect){
			return this.hasEssenceByName(aspect.name);
		}
	}
	
	/* ------------------------- ADD & GET ------------------------- */
	/* adds some amount of given aspect to storage */
	this.addEssenceByName = function(aspectName, amount){
		if (aspectName){
			if (!this.hasEssenceByName(aspectName)){
				this.aspectNames.push(aspectName);
				this.aspectAmounts[aspectName] = 0;
			}
			this.aspectAmounts[aspectName] += amount;
			return true;
		}
		return false;
	}
	
	this.addEssence = function(aspect, amount){
		if (aspect){
			return this.addEssenceByName(aspect.name, amount);
		}
	}
	
	
	/* gets some amount of given aspect from storage */
	this.getEssenceByName = function(aspectName, amount){
		if (aspectName){
			if (this.hasEssenceByName(aspectName)){
				var got = Math.min(this.aspectAmounts[aspectName], amount);
				this.aspectAmounts[aspectName] -= got;
				return got;
			}
			return 0;
		}
		return 0;
	}
	
	this.getEssence = function(aspect, amount){
		if (aspect){
			return this.getEssenceByName(aspect.name, amount);
		}
		return 0;
	}
	
	/* ------------------------- SOURCES ------------------------- */
	/* returns source for given aspect essence, to manipulate with it */
	this.getSource = function(aspectName){
		if (this.hasEssenceByName(aspectName)){
			return {
				__name: aspectName,
				__storage: this,
				
				/* returns aspect name */
				name: function(){
					return this.__name;
				},
				/* returns aspect object */
				aspect: function(){
					return AspectRegistry.getAspect(this.__name);
				},
				/* returns aspect element */
				element: function(){
					return this.aspect().element;
				},
				/* returns parent storage object */
				storage: function(){
					return this.__storage;
				},
				/* adds essence to storage */
				add: function(amount){
					return this.__storage.addEssenceByName(this.__name, amount);
				},
				/* gets some essence from storage, returns amount got */
				get: function(amount){
					return this.__storage.getEssenceByName(this.__name, amount);
				},
				/* returns amount of essence */
				amount: function(){
					return this.__storage.aspectAmounts[this.__name];
				},
			};
		}
	}
	
	/* returns group of sources to given aspects */
	this.getSourceGroup = function(aspectNames){
		var group = {};
		for (var index in aspectNames){
			var source = this.getSource(aspectNames[index]);
			if (source){
				group[aspectNames[index]] = source;
			}
		}
		return group;
	}
	
	/* returns source by index */
	this.byIndex = function(index){
		return this.getSource(this.aspectNames[index]);
	}
	
	/* returns source by index from end */
	this.byIndexEnd = function(index){
		return this.byIndex(this.getCount() - index - 1);
	}
	
	
	/* ------------------------- OTHER ------------------------- */
	/* sorts names array by amounts */
	this.sort = function(reverse){
		var count = this.getCount() - 1;
		for (var i = 0; i < count; i++){
			for (var j = 0; j < count; j++){
				if (this.aspectAmounts[this.aspectNames[i]] > this.aspectAmounts[this.aspectNames[i + 1]] == !reverse){
					var name1 = this.aspectNames[i];
					this.aspectNames[i] = this.aspectNames[i + 1];
					this.aspectNames[i + 1] = name1;
				}
			}
		}
	}
	
	/* reapiring missing data */
	this.validate = function(){
		this.aspectNames = this.aspectNames || [];
		this.aspectAmounts = this.aspectAmounts || {};
		
		for (var i in this.aspectNames){
			var name = this.aspectNames[i];
			if (!AspectRegistry.getAspect(name)){
				this.aspectNames.splice(i--, 1);
				delete this.aspectAmounts[name];
				continue;
			}
			if (!this.aspectAmounts[name]){
				this.aspectAmounts[name] = 0;
			}
		}
	}
	
	
	/* ------------------------- SAVING & READING ------------------------- */
	this.filterLowAmounts = function(){
		var names = [];
		var amounts = {};
		
		for (var i in this.aspectNames){
			var name = this.aspectNames[i];
			if (this.aspectAmounts[name] >= INTERACTIVE_ASPECT_AMOUNT * .5 || name == "flux"){
				names.push(name);
				amounts[name] = this.aspectAmounts[name];
			}
		}
		
		this.aspectNames = names;
		this.aspectAmounts = amounts;
	}
	
	this.save = function(filterLow){
		if (filterLow){
			this.filterLowAmounts();
		}
		return {
			names: this.aspectNames,
			amounts: this.aspectAmounts
		};
	}
	
	this.read = function(data){
		this.aspectNames = data.names;
		this.aspectAmounts = data.amounts;
		this.validate();
	}
	
	this.syncWithTileEntity = function(tileEntity){
		var data = tileEntity.data;
		if (!data.s_aspectNames){
			data.s_aspectNames = [];
		}
		if (!data.s_aspectAmounts){
			data.s_aspectAmounts = {};
		}
		this.aspectNames = data.s_aspectNames;
		this.aspectAmounts = data.s_aspectAmounts;
	}
	
	
	
	/* ------------------------- DEBUG ------------------------- */
	this.getDebugMessage = function(){
		var lines = [];
		for (var i in this.aspectNames){
			lines.push(this.aspectNames[i] + " : " + parseInt(this.aspectAmounts[this.aspectNames[i]] * 100) / 100)
		}
		return lines.join("\n");
	}
}