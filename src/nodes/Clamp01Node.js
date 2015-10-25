var Node = require('./Node');
var Utils = require('../Utils');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = Clamp01Node;

function Clamp01Node(options){
	options = options || {};
	MathFunctionNode.call(this, options);
}
Clamp01Node.prototype = Object.create(MathFunctionNode.prototype);
Clamp01Node.prototype.constructor = Clamp01Node;

Node.registerClass('clamp01', Clamp01Node);

Clamp01Node.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('y')[0];
	var outVarType = this.getOutputTypes('y')[0];

	var inVarName = this.getInputVariableName('x');
	var inVarType = this.getInputVariableTypes('x')[0];

	if(outVarName && inVarName){
		return outVarName + ' = clamp(' + Utils.convertGlslType(inVarName, inVarType, outVarType) + ', 0.0, 1.0);';
	} else if(outVarName){
		return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outVarType) + ';';
	} else {
		return '';
	}
};
