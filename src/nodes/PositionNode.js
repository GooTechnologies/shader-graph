var Node = require('./Node');

module.exports = PositionNode;

function PositionNode(options){
	options = options || {};
	Node.call(this, {
		name: 'Position'
	});
}
PositionNode.prototype = Object.create(Node.prototype);
PositionNode.prototype.constructor = PositionNode;

PositionNode.prototype.buildShader = function(){
	return function(){
		this.graph.sortNodes();
		return [
			this.graph.renderVaryingDeclarations(),
			this.graph.renderAttrubuteDeclarations(),
			this.graph.renderUniformDeclarations(),
			'void main(void){',
				this.graph.renderConnectionVariableDeclarations(),
				this.graph.renderNodeCodes(),
				this.graph.renderAttributeToVaryingAssignments(),
				'{',
					'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition, 1.0);',
				'}',
			'}'
		].join('\n');

	}.bind(this);
};