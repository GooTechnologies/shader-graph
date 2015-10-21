var Node = require('./Node');

module.exports = MultiplyNode;

// Adds a vec4 uniform to the shader.
function MultiplyNode(options){
	options = options || {};
	Node.call(this, options);
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
	var types = [];
	switch(key){
	case 'product':
		types = ['float', 'vec2', 'vec3', 'vec4'];
		var inVarName = this.getInputVariableName('a') || this.getInputVariableName('b');
		if(inVarName){
			// Something is connected to the input - restrict
			var incomingTypes = this.getInputVariableTypes('a').length ? this.getInputVariableTypes('a') : this.getInputVariableTypes('b');
			types = incomingTypes.filter(function(type){
				return types.indexOf(type) !== -1;
			});
		}
		break;
	}
	return types;
};

MultiplyNode.prototype.getInputTypes = function(key){
	var types = [];
	switch(key){
	case 'a':
	case 'b':
		var outVarName = this.getOutputVariableNames(key)[0];
		if(outVarName){
			var outTypes = this.getOutputVariableTypes(key);
			types = outTypes;
		} else {
			types = ['float', 'vec2', 'vec3', 'vec4'];
		}
		break;
	}
	return types;
};

MultiplyNode.prototype.render = function(){
	var inVarNameA = this.getInputVariableName('a');
	var inVarNameB = this.getInputVariableName('b');
	var outVarName = this.getOutputVariableNames('product')[0];
	if(inVarNameA && inVarNameB && outVarName){
		return outVarName + ' = ' + inVarNameA + ' * ' + inVarNameB + ';';
	} else if(outVarName){
		var outType = this.getOutputTypes('product')[0];
		return outVarName + ' = ' + outType + '(0);';
	} else {
		return '';
	}
};
