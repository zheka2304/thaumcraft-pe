var ThaumAPI = {
	/*  */
	SeededRandomGenerator: {
		precious: 100000,
		forSeed: function(seed){
			seed = Math.abs(seed % this.precious);
			return {
				seed: seed,
				precious: this.precious,
				/* returns integer in range 0 - (precious - 1) */
				next: function(){
					this.seed = (this.seed * 67671 + 1) % this.precious;
					return this.seed;
				},
				
				/* returns float in range 0 - 1 */
				nextFloat: function(){
					return this.next() / this.precious;
				},
				
				/* returns float in range a - b*/
				rangedFloat: function(a, b){
					return this.nextFloat() * (b - a) + a;
				},
				
				/* returns int in range a - b*/
				rangedInt: function(a, b){
					return parseInt(this.rangedFloat(a, b));
				},
				
				/* adds more randomization */
				randomize: function(){
					var count = this.rangedInt(0, 10);
					for(var i = 0; i < count; i++){
						this.next();
					}
				}
			};
		},
		
		forChunk: function(x, z){
			var gen = this.forSeed(x * 1632 + z * 1639 + 1937);
			gen.randomize();
			return gen;
		}
	},
	
	
}

