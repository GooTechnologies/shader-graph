var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = TanNode;

function TanNode(options){
	options = options || {};
	options.functionName = 'tan';
	MathFunctionNode.call(this, options);
}
TanNode.prototype = Object.create(MathFunctionNode.prototype);
TanNode.prototype.constructor = TanNode;

Node.registerClass('tan', TanNode);