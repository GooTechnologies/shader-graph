var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = SignNode;

function SignNode(options){
	options = options || {};
	options.functionName = 'sign';
	MathFunctionNode.call(this, options);
}
SignNode.prototype = Object.create(MathFunctionNode.prototype);
SignNode.prototype.constructor = SignNode;

Node.registerClass('sign', SignNode);