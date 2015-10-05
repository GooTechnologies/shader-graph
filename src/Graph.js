var toposort = require('toposort');

module.exports = Graph;

function Graph(options){
	options = options || {};

	this.nodes = [];
	this.connections = [];
	this.mainNode = options.mainNode || null;
	if(this.mainNode){
		this.addNode(this.mainNode);
	}
}

Graph.prototype.addNode = function(node){
	if(node.graph) throw new Error('Node was already added to a graph');
	this.nodes.push(node);
	node.graph = this;
};

Graph.prototype.removeNode = function(node){
	var index = this.nodes.indexOf(node);
	if(index !== -1){
		this.nodes.splice(index, 1);
		node.graph = null;
	}
};

Graph.prototype.addConnection = function(conn){
	if(conn.graph) throw new Error('Connection was already added to a graph');
	this.connections.push(conn);
	conn.graph = this;
	this.sortNodes();
};

Graph.prototype.removeConnection = function(conn){
	var index = this.connections.indexOf(conn);
	if(index !== -1){
		this.connections.splice(index, 1);
	}
};

Graph.prototype.inputPortIsConnected = function(node, inputPort){
	return this.connections.some(function (conn){
		return conn.toNode === node && conn.toPortKey === inputPort;
	});
};

Graph.prototype.getUniforms = function(){
	var uniforms = [];
	this.nodes.forEach(function (node){
		uniforms = uniforms.concat(node.getUniforms());
	});
	return uniforms;
};

Graph.prototype.getAttributes = function(){
	var attributes = {};
	this.nodes.forEach(function (node){
		var u = node.getAttributes();
		for(var key in u){
			attributes[key] = u[key];
		}
	});
	return attributes;
};

Graph.prototype.buildShader = function(){
	this.sortNodes();

	var shaderSource = [];
	var i,j;

	var nodes = this.nodes;

	// Add attribute declarations
	function sortByName(a1, a2){
		if(a1.name === a2.name){
			return 0;
		} else if(a1.name > a2.name){
			return 1;
		} else {
			return -1;
		}
	}
	Object.keys(this.getAttributes()).sort(sortByName).forEach(function(name){
		shaderSource.push('attribute ' + name + ';');
	});

	// Add uniform declarations
	this.getUniforms().sort(sortByName).forEach(function(uniform){
		shaderSource.push('uniform ' + uniform.type + ' ' + uniform.name + ';');
	});

	shaderSource.push('void main(void){');

	// Add connection variable decralations
	for (i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		for (var k = 0; k < node.outputPorts.length; k++) {
			var key = node.outputPorts[k];
			var types = node.getOutputTypes(key);
			var names = node.getOutputVarNames(key);
			for (j = 0; j < types.length; j++) {
				shaderSource.push(types[j] + ' ' + names[j] + ';');
			}
		}
	}

	// Add node code
	for (i = 0; i < nodes.length; i++) {
		var nodeSource = nodes[i].render();
		shaderSource.push('{', nodeSource, '}');
	}

	shaderSource.push('}');

	return shaderSource.join('\n');
};

Graph.prototype.buildSampleShader = function(endNode){
	this.sortNodes();

	endNode = endNode || this.mainNode;

	// TODO: remove nodes that arent connected to endNode

	var varCount = 0;
	var shaderDef = {
		attributes : {},
		uniforms : {},
		vshader: '',
		fshader : ''
	};

	return shaderDef;
};

// Topology sort of the nodes
Graph.prototype.sortNodes = function(){
	var edges = this.connections.map(function (connection) {
		return [
			connection.fromNode.id,
			connection.toNode.id
		];
	});
	var nodeIds = toposort(edges);
	var nodes = this.nodes;
	this.nodes = nodeIds.map(function (nodeId) {
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if(nodeId === node.id) return node;
		}
	});
};

// // https://github.com/marcelklehr/toposort
// Graph._toposort = (function () {
// 	return function (edges){
// 		return toposort(uniqueNodes(edges), edges);
// 	};

// 	function toposort(nodes, edges) {
// 		var cursor = nodes.length
// 			, sorted = new Array(cursor)
// 			, visited = {}
// 			, i = cursor;

// 		while (i--) {
// 			if (!visited[i]) visit(nodes[i], i, []);
// 		}

// 		return sorted;

// 		function visit(node, i, predecessors) {
// 			if(predecessors.indexOf(node) >= 0) {
// 				throw new Error('Cyclic dependency: '+JSON.stringify(node));
// 			}

// 			if (visited[i]) return;
// 			visited[i] = true;

// 			// outgoing edges
// 			var outgoing = edges.filter(function(edge){
// 				return edge[0] === node;
// 			});
// 			if (i = outgoing.length) {
// 				var preds = predecessors.concat(node);
// 				do {
// 					var child = outgoing[--i][1];
// 					visit(child, nodes.indexOf(child), preds);
// 				} while (i);
// 			}

// 			sorted[--cursor] = node;
// 		}
// 	}

// 	function uniqueNodes(arr){
// 		var res = [];
// 		for (var i = 0, len = arr.length; i < len; i++) {
// 			var edge = arr[i];
// 			if (res.indexOf(edge[0]) < 0) res.push(edge[0]);
// 			if (res.indexOf(edge[1]) < 0) res.push(edge[1]);
// 		}
// 		return res;
// 	}
// })();