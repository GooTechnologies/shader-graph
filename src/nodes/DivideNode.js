var Node = require('./Node');
var OperatorNode = require('./OperatorNode');
var Utils = require('../Utils');

module.exports = DivideNode;

function DivideNode(options){
	options = options || {};
	options.operator = '/';
	OperatorNode.call(this, options);
}
DivideNode.prototype = Object.create(OperatorNode.prototype);
DivideNode.prototype.constructor = DivideNode;

Node.registerClass('divide', DivideNode);