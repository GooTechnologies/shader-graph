var Node = require('./Node');
var MathFunctionNode = require('./MathFunctionNode');

module.exports = RoundNode;

function RoundNode(options){
	options = options || {};
	options.functionName = 'round';
	MathFunctionNode.call(this, options);
}
RoundNode.prototype = Object.create(MathFunctionNode.prototype);
RoundNode.prototype.constructor = RoundNode;

Node.registerClass('round', RoundNode);