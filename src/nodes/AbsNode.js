var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = AbsNode;

function AbsNode(options){
	options = options || {};
	options.functionName = 'abs';
	MathFunctionNode.call(this, options);
}
AbsNode.prototype = Object.create(MathFunctionNode.prototype);
AbsNode.prototype.constructor = AbsNode;

Node.registerClass('abs', AbsNode);