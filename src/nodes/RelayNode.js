var Node = require('./Node');

module.exports = RelayNode;

// A vector with four components/values.
function RelayNode(options){
	options = options || {};
	Node.call(this, options);
}
RelayNode.prototype = Object.create(Node.prototype);
RelayNode.prototype.constructor = RelayNode;

RelayNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

Node.registerClass('relay', RelayNode);

RelayNode.prototype.getInputPorts = function(){
	return ['in'];
};

RelayNode.prototype.getOutputPorts = function(){
	return ['out'];
};

// Output type is same as what we get in.
RelayNode.prototype.getOutputTypes = function(key){
	var types = [];
	if(key === 'out'){
		types = this.inputPortIsConnected('in') ? this.getInputVariableTypes('in') : ['float'];
	}
	return types;
};

RelayNode.prototype.getInputTypes = function(key){
	return key === 'in' ? RelayNode.supportedTypes : [];
};


RelayNode.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('out')[0];
	var inVarName = this.getInputVariableName('in');
	return outVarName ? outVarName + ' = ' + inVarName + ';' : '';
};
