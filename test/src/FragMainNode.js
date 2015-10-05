var Node = require('./Node');

module.exports = FragMainNode;

function FragMainNode(){
	Node.call(this, {
		name: 'FragMain',
		inputPorts: ['color']
	});
}
FragMainNode.prototype = Object.create(Node.prototype);
FragMainNode.constructor = FragMainNode;
FragMainNode.prototype.canBuildShader = function(){
	return this.graph.inputPortIsConnected(this, 'color');
};
FragMainNode.prototype.canConnect = function(key, targetNode, targetPortKey){
	return (key === 'color' && targetNode.getOutputTypes(targetPortKey)[0] === 'vec4') && Node.prototype.canConnect.apply(this, arguments);
};
FragMainNode.prototype.getInputTypes = function(key){
	return key === 'color' ? ['vec4'] : [];
};