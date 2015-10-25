var Node = require('./Node');
var OperatorNode = require('./OperatorNode');
var Utils = require('../Utils');

module.exports = SubtractNode;

function SubtractNode(options){
	options = options || {};
	options.operator = '-';
	OperatorNode.call(this, options);
}
SubtractNode.prototype = Object.create(OperatorNode.prototype);
SubtractNode.prototype.constructor = SubtractNode;

Node.registerClass('subtract', SubtractNode);