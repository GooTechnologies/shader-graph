var Node = require('./Node');
var OperatorNode = require('./OperatorNode');
var Utils = require('../Utils');

module.exports = MultiplyNode;

function MultiplyNode(options){
	options = options || {};
	options.operator = '*';
	OperatorNode.call(this, options);
}
MultiplyNode.prototype = Object.create(OperatorNode.prototype);
MultiplyNode.prototype.constructor = MultiplyNode;

Node.registerClass('multiply', MultiplyNode);