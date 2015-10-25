var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = SineNode;

function SineNode(options){
	options = options || {};
	options.functionName = 'sin';
	MathFunctionNode.call(this, options);
}
SineNode.prototype = Object.create(MathFunctionNode.prototype);
SineNode.prototype.constructor = SineNode;

Node.registerClass('sine', SineNode);