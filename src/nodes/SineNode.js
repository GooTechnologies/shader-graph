var Node = require('./Node');

module.exports = SineNode;

// Adds a vec4 uniform to the shader.
function SineNode(options){
	options = options || {};
	Node.call(this, {
		name: 'Sine'
	});
}
SineNode.prototype = Object.create(Node.prototype);
SineNode.prototype.constructor = SineNode;

Node.registerClass('sine', SineNode);

SineNode.prototype.getInputPorts = function(key){
	return ['x'];
};

SineNode.prototype.getOutputPorts = function(key){
	return ['y'];
};

SineNode.prototype.getOutputTypes = function(key){
	return key === 'y' ? ['float'] : [];
};

SineNode.prototype.getOutputVarNames = function(key){
	return key === 'y' ? ['y' + this.id] : [];
};

SineNode.prototype.render = function(){
	var outVarName = this.getOutputVarNames('y')[0];
	var inVarName = this.getInputVariableNames('x')[0];
	if(outVarName && inVarName){
		return outVarName + ' = sin(' + inVarName + ');';
	} else if(outVarName){
		return outVarName + ' = 0.0;';
	} else {
		return '';
	}
};
