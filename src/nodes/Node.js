var Connection = require('../Connection');

module.exports = Node;

function Node(options){
	options = options || {};

	this.id = Node._idCounter++;
	this.name = options.name || 'Unnamed node';
}

Node._idCounter = 1;

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

Node.prototype.buildShader = function(){
	return this.graph.buildShader(this);
};

Node.prototype.canConnect = function(key, targetNode, targetPortKey){
	if(!this.graph) throw new Error('Node must be added to a Graph to be connected.');
	if(targetNode === this){
		throw new Error('Cannot connect the node to itself');
	}
	if(this.getInputPorts().indexOf(key) === -1){
		throw new Error(this.name + ' does not have input port ' + key);
	}
	if(targetNode.getOutputPorts().indexOf(targetPortKey) === -1){
		throw new Error(targetNode.name + ' does not have output port ' + targetPortKey);
	}
	return true;
};

Node.prototype.connect = function(key, targetNode, targetPortKey){
	if(!this.graph) throw new Error('Node must be added to a Graph to be connected.');
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
