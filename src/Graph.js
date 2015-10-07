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

Graph.prototype.getNodeConnectedToInputPort = function(node, inputPort){
	var connection = this.connections.filter(function (conn){
		return conn.toNode === node && conn.toPortKey === inputPort;
	})[0];
	return connection && connection.fromNode;
};

Graph.prototype.getUniforms = function(){
	var uniforms = [];
	this.nodes.forEach(function (node){
		uniforms = uniforms.concat(node.getUniforms());
	});
	return uniforms;
};

Graph.prototype.getAttributes = function(){
	var attributes = [];
	this.nodes.forEach(function (node){
		attributes = attributes.concat(node.getAttributes());
	});
	return attributes;
};

Graph.prototype.getProcessors = function(){
	var processors = [];
	this.nodes.forEach(function (node){
		processors = processors.concat(node.getProcessors());
	});
	return processors;
};

Graph.prototype.buildShader = function(){
	this.sortNodes();

	var shaderSource = [];
	var i, j, node;

	var nodes = this.nodes;

	function sortByName(a1, a2){
		if(a1.name === a2.name){
			return 0;
		} else if(a1.name > a2.name){
			return 1;
		} else {
			return -1;
		}
	}

	// Add attribute declarations
	this.getAttributes().sort(sortByName).forEach(function(attribute){
		shaderSource.push('attribute ' + attribute.type + ' ' + attribute.name + ';');
	});

	// Add uniform declarations
	this.getUniforms().sort(sortByName).forEach(function(uniform){
		shaderSource.push('uniform ' + uniform.type + ' ' + uniform.name + ';');
	});

	shaderSource.push('void main(void){');

	// Add connection variable decralations
	for (i = 0; i < nodes.length; i++) {
		node = nodes[i];
		for (var k = 0; k < node.outputPorts.length; k++) {
			var key = node.outputPorts[k];
			var types = node.getOutputTypes(key);
			var names = node.getOutputVarNames(key);
			for (j = 0; j < types.length; j++) {
				shaderSource.push(types[j] + ' ' + names[j] + ';');
			}
		}
	}

	// Add node codes
	for (i = 0; i < nodes.length; i++) {
		node = nodes[i];
		if(node !== this.mainNode){ // Save main node until last
			var nodeSource = node.render();
			shaderSource.push('{', nodeSource, '}');
		}
	}

	shaderSource.push('{', this.mainNode.render(), '}');

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