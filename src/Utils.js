module.exports = Utils;

function Utils(){}

// Utils.arrayIntersect(['a', 'b', 'c'], ['a', 'c']) => ['a', 'c']
Utils.arrayIntersect = function(a, b){
	return a.filter(function (item){
		return b.indexOf(item) !== -1;
	});
};

// Utils.getHighestDimensionVectorType(['float', 'vec2', 'vec3']) => 'vec3'
Utils.getHighestDimensionVectorType = function(array){
	return array.sort().reverse()[0];
};

// Utils.numberToGlslFloat(2) => '2.0'
Utils.numberToGlslFloat = function(n){
	return (n+'').indexOf('.') === -1 ? n+'.0' : n+'';
};

var expressionTable = {
	'float': {
		'float': 'X',
		'vec2': 'vec2(X)',
		'vec3': 'vec3(X)',
		'vec4': 'vec4(X)'
	},
	'vec2': {
		'float': 'X.x',
		'vec2': 'X',
		'vec3': 'vec3(X,0)',
		'vec4': 'vec4(X,0,0)'
	},
	'vec3': {
		'float': 'X.x',
		'vec2': 'X.xy',
		'vec3': 'X',
		'vec4': 'vec4(X,0)'
	},
	'vec4': {
		'float': 'X.x',
		'vec2': 'X.xy',
		'vec3': 'X.xyz',
		'vec4': 'X'
	}
};

/**
 * Manually cast a GLSL type to another one. For example, a float can be casted to a vec3: convertGlslType('myFloatVar', 'float', 'vec3') => 'vec3(myFloatVar)'
 * @param  {string} expression
 * @param  {string} type
 * @param  {string} newType
 * @return {string}
 */
Utils.convertGlslType = function(expression, type, newType){
	return expressionTable[type][newType].replace('X', expression);
};