var Node = require('./Node');

module.exports = MultiplyNode;

// Adds a vec4 uniform to the shader.
function MultiplyNode(options){
	options = options || {};
	Node.call(this, {
		name: 'Multiply'
	});
}
MultiplyNode.prototype = Object.create(Node.prototype);
MultiplyNode.prototype.constructor = MultiplyNode;

Node.registerClass('multiply', MultiplyNode);

MultiplyNode.prototype.getInputPorts = function(key){
	return ['a', 'b'];
};

MultiplyNode.prototype.getOutputPorts = function(key){
	return ['product'];
};

MultiplyNode.prototype.getOutputTypes = function(key){
	return key === 'product' ? ['float'] : [];
};

MultiplyNode.prototype.getInputTypes = function(key){
	return key === 'a' || key === 'b' ? ['float'] : [];
};

MultiplyNode.prototype.getOutputVarNames = function(key){
	return key === 'product' ? ['product' + this.id] : [];
};

MultiplyNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableNames('a')[0];
	var inVarNameB = this.getInputVariableNames('b')[0];
	var outVarName = this.getOutputVarNames('product')[0];
	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = ' + inVarNameA + ' * ' + inVarNameB + ';';
	} else if(outVarName){
		return outVarName + ' = 0.0;';
	} else {
		return '';
	}
};
