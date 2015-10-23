var Node = require('./Node');
var Uniform = require('../Uniform');

module.exports = AppendNode;

// A vector with four components/values.
function AppendNode(options){
	options = options || {};
	Node.call(this, options);
}
AppendNode.prototype = Object.create(Node.prototype);
AppendNode.prototype.constructor = AppendNode;

Node.registerClass('append', AppendNode);

AppendNode.supportedTypes = [
	'float',
	'vec2',
	'vec3',
	'vec4'
];

AppendNode.prototype.getInputPorts = function(){
	var sum = this.getComponentSum();

	console.log(sum)

	if(!this.inputPortIsConnected('a'))
		return ['a'];

	else if(!this.inputPortIsConnected('b') && sum < 4)
		return ['a', 'b'];

	else if(!this.inputPortIsConnected('c') && sum < 4)
		return ['a', 'b', 'c'];

	else if(!this.inputPortIsConnected('d') && sum < 4)
		return ['a', 'b', 'c', 'd'];
};

AppendNode.prototype.getOutputPorts = function(){
	return ['out'];
};

AppendNode.prototype.getInputTypes = function(key){
	//var sum = this.getComponentSum();
	var types;
	switch(key){
	case 'a':
	case 'b':
	case 'c':
	case 'd':
		types = AppendNode.supportedTypes.slice(0/*, 4 - sum*/);
		break;
	}
	return types;
};

AppendNode.prototype.getComponentSum = function(){
	var ports = 'abcd';
	var weights = {
		'float': 1,
		'vec2': 2,
		'vec3': 3,
		'vec4': 4
	};
	var sum = 0;
	for(var i=0; i<ports.length; i++){
		var x = ports[i];
		if(this.inputPortIsConnected(x)){
			var type = this.getInputTypes(x)[0];
			sum += weights[type];
		}
	}
	return sum;
};

AppendNode.prototype.getOutputTypes = function(key){
	console.log('getOutputTypes')
	return key === 'out' ? [AppendNode.supportedTypes[this.getComponentSum() - 1]] : [];
};

AppendNode.prototype.render = function(){
	console.log('render')
	var a = this.getInputVariableName('a');
	var b = this.getInputVariableName('b');
	var c = this.getInputVariableName('c');
	var d = this.getInputVariableName('d');
	var vars = [];
	if(a) vars.push(a);
	if(b) vars.push(b);
	if(c) vars.push(c);
	if(d) vars.push(d);

	var outVarName = this.getOutputVariableNames('out')[0];
	var outType = this.getOutputTypes()[0];

	if(outVarName){
		return outVarName + ' = ' + outType + '(' + vars.join(',') + ');';
	}

	return '';
};