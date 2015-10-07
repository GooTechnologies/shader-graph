var Node = require('./Node');

module.exports = FragColor;

function FragColor(options){
	options = options || {};
	Node.call(this, {
		name: 'FragColor',
		inputPorts: ['rgba']
	});
}
FragColor.prototype = Object.create(Node.prototype);
FragColor.constructor = FragColor;

FragColor.prototype.getInputVarNames = function(key){
	if(key === 'rgba'){
		// Get the ID of the node connected
		var connectedNode = this.graph.getNodeConnectedToInputPort(this, key);
		if(connectedNode)
			return  ['rgba' + connectedNode.id];
	}
	return [];
};

FragColor.prototype.render = function(){
	return 'gl_FragColor = ' + this.getInputVarNames('rgba')[0] + ';';
};
