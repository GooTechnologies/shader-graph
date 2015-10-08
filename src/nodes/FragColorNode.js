var Node = require('./Node');

module.exports = FragColorNode;

function FragColorNode(options){
	options = options || {};
	Node.call(this, {
		name: 'FragColor'
	});
}
FragColorNode.prototype = Object.create(Node.prototype);
FragColorNode.constructor = FragColorNode;

FragColorNode.prototype.getInputPorts = function(key){
	return ['rgba'];
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
		return [
			this.graph.renderAttrubuteDeclarations(),
			this.graph.renderUniformDeclarations(),
			'void main(void){',
				this.graph.renderConnectionVariableDeclarations(),
				this.graph.renderNodeCodes(),
				'{',
					'gl_FragColor = ' + this.getInputVarNames('rgba')[0] + ';',
				'}',
			'}'
		].join('\n');
		
	}.bind(this);
};