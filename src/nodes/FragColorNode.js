var Node = require('./Node');

module.exports = FragColorNode;

function FragColorNode(options){
	options = options || {};
	Node.call(this, options);
}
FragColorNode.prototype = Object.create(Node.prototype);
FragColorNode.prototype.constructor = FragColorNode;

Node.registerClass('fragColor', FragColorNode);

FragColorNode.prototype.getInputPorts = function(key){
	return ['rgba'];
};

FragColorNode.prototype.getInputTypes = function(key){
	return ['vec4'];
};

FragColorNode.prototype.buildShader = function(){
	return function(){
		this.graph.sortNodes();
		var input = (this.getInputVariableName('rgba') || 'vec4(1)');
		return [
			this.graph.renderVaryingDeclarations(),
			this.graph.renderUniformDeclarations(),
			'void main(void){',
				this.graph.renderConnectionVariableDeclarations(),
				this.graph.renderNodeCodes(),
				'{',
					'gl_FragColor = ' + input + ';',
				'}',
			'}'
		].join('\n');

	}.bind(this);
};