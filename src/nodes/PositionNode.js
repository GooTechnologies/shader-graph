var Node = require('./Node');

module.exports = PositionNode;

function PositionNode(options){
	options = options || {};
	Node.call(this, {
		name: 'PositionNode'
	});
}
PositionNode.prototype = Object.create(Node.prototype);
PositionNode.constructor = PositionNode;

PositionNode.prototype.render = function(){
	return 'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition, 1.0);';
};
