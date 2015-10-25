var Node = require('./Node');
var Utils = require('../Utils');

module.exports = ComponentMaskNode;

function ComponentMaskNode(options){
	options = options || {};
	this.channel = options.channel || ComponentMaskNode.CHANNEL_R;
	Node.call(this, options);
}
ComponentMaskNode.prototype = Object.create(Node.prototype);
ComponentMaskNode.prototype.constructor = ComponentMaskNode;

Node.registerClass('componentMask', ComponentMaskNode);

ComponentMaskNode.CHANNEL_R = 'r';
ComponentMaskNode.CHANNEL_G = 'g';
ComponentMaskNode.CHANNEL_B = 'b';
ComponentMaskNode.CHANNEL_A = 'a';

ComponentMaskNode.supportedTypes = [
	'vec2',
	'vec3',
	'vec4'
];

ComponentMaskNode.prototype.getInputPorts = function(key){
	return ['x'];
};

ComponentMaskNode.prototype.getOutputPorts = function(key){
	return ['y'];
};

// Output type is always one channel: float
ComponentMaskNode.prototype.getOutputTypes = function(key){
	return ['float'];
};

ComponentMaskNode.prototype.getInputTypes = function(key){
	return key === 'x' ? ComponentMaskNode.supportedTypes : [];
};

ComponentMaskNode.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('y')[0];
	var outVarType = this.getOutputTypes('y')[0];

	var inVarName = this.getInputVariableName('x');
	var inVarType = this.getInputVariableTypes('x')[0];

	if(outVarName && inVarName){
		return outVarName + '=(' + inVarName + ').' + this.channel + ';';
	} else if(outVarName){
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outVarType) + ';';
	} else {
		return '';
	}
};
