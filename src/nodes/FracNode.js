var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = FracNode;

function FracNode(options){
	options = options || {};
	options.functionName = 'fract';
	MathFunctionNode.call(this, options);
}
FracNode.prototype = Object.create(MathFunctionNode.prototype);
FracNode.prototype.constructor = FracNode;

Node.registerClass('frac', FracNode);