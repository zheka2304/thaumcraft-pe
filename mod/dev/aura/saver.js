Saver.addSavesScope("ThaumcraftAura",
	function read(scope){
		var nodeData = scope.nodes;
		
		Aura.clearAllData();
		for (var key in nodeData){
			var node = new AuraNode();
			node.loadNode(nodeData[key]);
			Aura.addLoadedNode(key, node);
		}
	},
	
	function save(){
		var scope = {
			nodes: {}
		};
		
		for (var key in Aura.data){
			scope.nodes[key] = Aura.data[key].saveNode();
		}
		
		return scope;
	}
);