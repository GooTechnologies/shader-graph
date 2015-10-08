var Node = require('./Node');

module.exports = PositionNode;

function PositionNode(options){
	options = options || {};
	Node.call(this, {
		name: 'Position'
	});
}
PositionNode.prototype = Object.create(Node.prototype);
PositionNode.constructor = PositionNode;

PositionNode.prototype.buildShader = function(){
	return function(){
		this.graph.sortNodes();
		return [
			this.graph.renderAttrubuteDeclarations(),
			this.graph.renderUniformDeclarations(),
			'void main(void){',
				this.graph.renderConnectionVariableDeclarations(),
				this.graph.renderNodeCodes(),
				'{',
					'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition, 1.0);',
				'}',
			'}'
		].join('\n');
		
	}.bind(this);
};