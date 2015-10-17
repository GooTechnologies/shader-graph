var Connection = require('../Connection');

module.exports = Node;

function Node(options){
	options = options || {};

	this.id = Node._idCounter++;
	this.name = options.name || 'Unnamed node';
}

Node._idCounter = 1;

Node.classes = {};

Node.registerClass = function(key, constructor){
	Node.classes[key] = constructor;
};

Node.prototype.getInputPorts = function(key){
	return [];
};

Node.prototype.getOutputPorts = function(key){
	return [];
};

Node.prototype.getInputTypes = function(key){
	return [];
};

Node.prototype.getOutputTypes = function(key){ // TODO: maybe the output should have just one type
	return [];
};

Node.prototype.inputPortIsValid = function(key){
	return true;
};

Node.prototype.outputPortIsValid = function(key){
	return true;
};

Node.prototype.canBuildShader = function(){
	return false;
};

Node.prototype.getOutputVariableNames = function(key){
	return [key + this.id]; // todo really an array?
};

Node.prototype.getInputVariableNames = function(key){
	var connectedNode = this.graph.getNodeConnectedToInputPort(this, key);
	if(connectedNode){
		var portKey = this.graph.getPortKeyConnectedToInputPort(this, key);
		return  [portKey + connectedNode.id];
	}
	return [];
};

Node.prototype.buildShader = function(){
	return this.graph.buildShader(this);
};

Node.prototype._getConnectError = function(key, targetNode, targetPortKey){
	if(!this.graph){
		return 'Node must be added to a Graph to be connected.';
	}

	if(targetNode === this){
		return 'Cannot connect the node to itself';
	}
	if(this.getInputPorts().indexOf(key) === -1){
		return this.name + ' does not have input port ' + key;
	}

	// Check if they have a type in common
	var outputTypes = targetNode.getOutputTypes(key);
	var inputTypes = this.getInputTypes(key);
	var hasSharedType = outputTypes.some(function(type){
		return inputTypes.indexOf(type) !== -1;
	});
	if(!outputTypes.length || !inputTypes.length || !hasSharedType){
		return 'the ports do not have a shared type.';
	}

	if(targetNode.getOutputPorts().indexOf(targetPortKey) === -1){
		return targetNode.name + ' does not have output port ' + targetPortKey;
	}
};

Node.prototype.canConnect = function(key, targetNode, targetPortKey){
	var errorMessage = this._getConnectError(key, targetNode, targetPortKey);
	return errorMessage ? false : true;
};

Node.prototype.connect = function(key, targetNode, targetPortKey){
	var errorMessage = this._getConnectError(key, targetNode, targetPortKey);

	if(errorMessage){
		throw new Error(errorMessage);
	}

	this.graph.addConnection(new Connection({
		fromNode: targetNode,
		fromPortKey: targetPortKey,
		toNode: this,
		toPortKey: key
	}));
};

// todo
Node.prototype.disconnect = function(key, targetNode, targetPortKey){};

Node.prototype.getAttributes = function(){
	return [];
};

Node.prototype.getUniforms = function(){
	return [];
};

Node.prototype.getUniforms = function(){
	return [];
};

Node.prototype.getVaryings = function(){
	return [];
};

Node.prototype.getProcessors = function(){
	return [];
};

Node.prototype.render = function(){
	return '';
};

Node.prototype.getBuilder = function(){};

Node.prototype.buildShader = function(){
	return function(){
		this.graph.sortNodes();
		return [
			this.graph.renderAttrubuteDeclarations(),
			this.graph.renderUniformDeclarations(),
			'void main(void){',
				this.graph.renderConnectionVariableDeclarations(),
				this.graph.renderNodeCodes(),
				'{',
					//this.mainNode.render(),
				'}',
			'}'
		].join('\n');

	}.bind(this);
};

Node.prototype._numberToGLSL = function(n){
	return (n+'').indexOf('.') === -1 ? n+'.0' : n+'';
};