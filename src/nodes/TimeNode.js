var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = TimeNode;

// Adds a vec4 uniform to the shader.
function TimeNode(options){
	options = options || {};
	Node.call(this, options);
}
TimeNode.prototype = Object.create(Node.prototype);
TimeNode.prototype.constructor = TimeNode;

Node.registerClass('time', TimeNode);

TimeNode.prototype.getOutputPorts = function(key){
	return ['time'];
};

TimeNode.prototype.getOutputTypes = function(key){
	return key === 'time' ? ['float'] : [];
};

TimeNode.prototype.getUniforms = function(){
	var uniforms = [
		new Uniform({
			name: 'uTime' + this.id,
			defaultValue: 'TIME',
			type: 'float'
		})
	];
	return uniforms;
};

TimeNode.prototype.render = function(){
	var outVarName = this.getOutputVariableNames('time')[0];
	if(outVarName){
		return outVarName + ' = ' + this.getUniforms()[0].name + ';';
	} else {
		return '';
	}
};
