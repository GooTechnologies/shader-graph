var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = SqrtNode;

function SqrtNode(options){
	options = options || {};
	options.functionName = 'sqrt';
	MathFunctionNode.call(this, options);
}
SqrtNode.prototype = Object.create(MathFunctionNode.prototype);
SqrtNode.prototype.constructor = SqrtNode;

Node.registerClass('sqrt', SqrtNode);