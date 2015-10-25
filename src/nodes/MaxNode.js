var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = MaxNode;

function MaxNode(options){
	options = options || {};
	options.functionName = 'max';
	MathFunctionNode.call(this, options);
}
MaxNode.prototype = Object.create(MathFunctionNode.prototype);
MaxNode.prototype.constructor = MaxNode;

Node.registerClass('max', MaxNode);