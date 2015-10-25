module.exports = {

	Node: require('./src/nodes/Node'),
	FragColorNode: require('./src/nodes/FragColorNode'),
	PositionNode: require('./src/nodes/PositionNode'),
	UberFragNode: require('./src/nodes/UberFragNode'),
	UberVertNode: require('./src/nodes/UberVertNode'),
	Vector2Node: require('./src/nodes/Vector2Node'),
	Vector3Node: require('./src/nodes/Vector3Node'),
	Vector4Node: require('./src/nodes/Vector4Node'),
	ValueNode: require('./src/nodes/ValueNode'),
	UVNode: require('./src/nodes/UVNode'),
	TimeNode: require('./src/nodes/TimeNode'),
	TextureNode: require('./src/nodes/TextureNode'),
	AppendNode: require('./src/nodes/AppendNode'),
	ReciprocalNode: require('./src/nodes/ReciprocalNode'),

	OperatorNode: require('./src/nodes/OperatorNode'),
	AddNode: require('./src/nodes/AddNode'),
	DivideNode: require('./src/nodes/DivideNode'),
	SubtractNode: require('./src/nodes/SubtractNode'),
	MultiplyNode: require('./src/nodes/MultiplyNode'),

	MathFunctionNode: require('./src/nodes/MathFunctionNode'),
	SineNode: require('./src/nodes/SineNode'),
	AbsNode: require('./src/nodes/AbsNode'),
	FloorNode: require('./src/nodes/FloorNode'),
	CeilNode: require('./src/nodes/CeilNode'),

	PowNode: require('./src/nodes/PowNode'),

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