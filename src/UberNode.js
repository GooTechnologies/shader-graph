var Node = require('./Node');

module.exports = UberNode;

function UberNode(){
	Node.call(this, {
		name: 'Uber',
		inputPorts: [
			'diffuse',
			'normal',
			'specular',
			'emissive',
			'alpha',
			'alphakill'
		]
	});
}
UberNode.prototype = Object.create(Node.prototype);
UberNode.constructor = UberNode;

UberNode.prototype.canBuildShader = function(){
	return this.graph.inputPortIsConnected(this, 'color');
};

UberNode.prototype.canConnect = function(key, targetNode, targetPortKey){
	// todo
	return (key === 'color' && targetNode.getOutputTypes(targetPortKey)[0] === 'vec4') && Node.prototype.canConnect.apply(this, arguments);
};

UberNode.prototype.getInputTypes = function(key){
	var types = [];
	switch(key){
	case 'diffuse':
		types = ['vec4'];
		break;
	case 'normal':
		types = ['vec3'];
		break;
	case 'specular':
		types = ['vec3'];
		break;
	case 'emissive':
		types = ['vec3'];
		break;
	case 'alpha':
		types = ['float'];
		break;
	case 'alphakill':
		types = ['float'];
		break;
	}
	return types;
};