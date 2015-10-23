module.exports = {

	Node: require('./src/nodes/Node'),
	FragColorNode: require('./src/nodes/FragColorNode'),
	PositionNode: require('./src/nodes/PositionNode'),
	UberFragNode: require('./src/nodes/UberFragNode'),
	UberVertNode: require('./src/nodes/UberVertNode'),
	Vector4Node: require('./src/nodes/Vector4Node'),
	ValueNode: require('./src/nodes/ValueNode'),
	UVNode: require('./src/nodes/UVNode'),
	TimeNode: require('./src/nodes/TimeNode'),
	SineNode: require('./src/nodes/SineNode'),
	MultiplyNode: require('./src/nodes/MultiplyNode'),
	TextureNode: require('./src/nodes/TextureNode'),
	AppendNode: require('./src/nodes/AppendNode'),

	Utils: require('./src/Utils'),
	Attribute: require('./src/Attribute'),
	Connection: require('./src/Connection'),
	FragmentGraph: require('./src/FragmentGraph'),
	Graph: require('./src/Graph'),
	GraphShader: require('./src/GraphShader'),
	Uniform: require('./src/Uniform'),
	Varying: require('./src/Varying')

};

if(typeof(window) !== 'undefined'){
	window.ShaderGraph = module.exports;
}