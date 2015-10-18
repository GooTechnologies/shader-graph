var Node = require('./Node');

module.exports = FragColorNode;

function FragColorNode(options){
	options = options || {};
	Node.call(this, {
		name: 'FragColor'
	});
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

FragColorNode.prototype.getInputVarNames = function(key){
	if(key === 'rgba'){
		// Get the ID of the node connected
		var connectedNode = this.graph.getNodeConnectedToInputPort(this, key);
		if(connectedNode)
			return  ['rgba' + connectedNode.id];
	}
	return [];
};

FragColorNode.prototype.buildShader = function(){
	return function(){
		this.graph.sortNodes();
		var input = (this.getInputVarNames('rgba')[0] || 'vec4(1)');
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