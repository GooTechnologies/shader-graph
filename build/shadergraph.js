/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

		Node: __webpack_require__(1),
		FragColorNode: __webpack_require__(3),
		PositionNode: __webpack_require__(4),
		UberFragNode: __webpack_require__(5),
		UberVertNode: __webpack_require__(6),
		Vector2Node: __webpack_require__(24),
		Vector3Node: __webpack_require__(25),
		Vector4Node: __webpack_require__(8),
		ValueNode: __webpack_require__(9),
		UVNode: __webpack_require__(11),
		TimeNode: __webpack_require__(14),
		TextureNode: __webpack_require__(17),
		AppendNode: __webpack_require__(18),
		ReciprocalNode: __webpack_require__(34),

		OperatorNode: __webpack_require__(30),
		AddNode: __webpack_require__(31),
		DivideNode: __webpack_require__(33),
		SubtractNode: __webpack_require__(32),
		MultiplyNode: __webpack_require__(16),

		MathFunctionNode: __webpack_require__(26),
		SineNode: __webpack_require__(15),
		AbsNode: __webpack_require__(27),
		FloorNode: __webpack_require__(28),
		CeilNode: __webpack_require__(29),

		PowNode: __webpack_require__(35),

		Utils: __webpack_require__(10),
		Attribute: __webpack_require__(12),
		Connection: __webpack_require__(2),
		FragmentGraph: __webpack_require__(19),
		Graph: __webpack_require__(20),
		GraphShader: __webpack_require__(22),
		Uniform: __webpack_require__(7),
		Varying: __webpack_require__(13)

	};

	if(typeof(window) !== 'undefined'){
		window.ShaderGraph = module.exports;
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Connection = __webpack_require__(2);

	module.exports = Node;

	function Node(options){
		options = options || {};
		if(options.id){
			Node._idCounter = Math.max(options.id + 1, Node._idCounter);
			this.id = options.id;
		} else {
			this.id = Node._idCounter++;
		}
		this.name = options.name || 'Unnamed node';
	}

	Node._idCounter = 1;

	Node.classes = {};

	Node.registerClass = function(key, constructor){
		constructor.type = key;
		Node.classes[key] = constructor;
	};

	Node.prototype.getInputPorts = function(key){
		return [];
	};

	Node.prototype.getOutputPorts = function(key){
		return [];
	};

	Node.prototype.getInputTypes = function(key){
		return [];
	};

	Node.prototype.getOutputTypes = function(key){
		return [];
	};

	Node.prototype.inputPortIsValid = function(key){
		return true;
	};

	Node.prototype.outputPortIsValid = function(key){
		return true;
	};

	Node.prototype.canBuildShader = function(){
		return false;
	};

	Node.prototype.outputPortIsConnected = function(key){
		return this.graph.outputPortIsConnected(this, key);
	};

	Node.prototype.inputPortIsConnected = function(key){
		return this.graph.inputPortIsConnected(this, key);
	};

	Node.prototype.getOutputVariableNames = function(key){
		return this.outputPortIsConnected(key) ? [key + this.id] : []; // todo really an array?
	};

	Node.prototype.getInputVariableName = function(key){
		var connectedNode = this.graph.getNodeConnectedToInputPort(this, key);
		if(connectedNode){
			var portKey = this.graph.getPortKeyConnectedToInputPort(this, key);
			return portKey + connectedNode.id;
		}
	};

	Node.prototype.getInputVariableTypes = function(key){
		var connectedNode = this.graph.getNodeConnectedToInputPort(this, key);
		if(connectedNode){
			var portKey = this.graph.getPortKeyConnectedToInputPort(this, key);
			return connectedNode.getOutputTypes(portKey);
		}
		return [];
	};

	Node.prototype.buildShader = function(){
		return this.graph.buildShader(this);
	};

	Node.prototype._getConnectError = function(key, targetNode, targetPortKey){
		if(!this.graph){
			return 'Node must be added to a Graph to be connected.';
		}

		if(targetNode === this){
			return 'Cannot connect the node to itself';
		}
		if(this.getInputPorts().indexOf(key) === -1){
			return this.name + ' does not have input port ' + key;
		}

		// Check if they have a type in common
		var outputTypes = targetNode.getOutputTypes(targetPortKey);
		var inputTypes = this.getInputTypes(key);
		var hasSharedType = outputTypes.some(function(type){
			return inputTypes.indexOf(type) !== -1;
		});
		if(!outputTypes.length || !inputTypes.length || !hasSharedType){
			return 'the ports do not have a shared type. InputTypes: ' + inputTypes.join(',') + ', Outputtypes: ' + outputTypes.join(',');
		}

		if(targetNode.getOutputPorts().indexOf(targetPortKey) === -1){
			return targetNode.name + ' does not have output port ' + targetPortKey;
		}
	};

	Node.prototype.canConnect = function(key, targetNode, targetPortKey){
		var errorMessage = this._getConnectError(key, targetNode, targetPortKey);
		this.errorMessage = errorMessage;
		return errorMessage ? false : true;
	};

	Node.prototype.connect = function(key, targetNode, targetPortKey){
		var errorMessage = this._getConnectError(key, targetNode, targetPortKey);

		if(errorMessage){
			throw new Error(errorMessage);
		}

		this.graph.addConnection(new Connection({
			fromNode: targetNode,
			fromPortKey: targetPortKey,
			toNode: this,
			toPortKey: key
		}));
	};

	// todo
	Node.prototype.disconnect = function(key, targetNode, targetPortKey){
		var conn = this.graph.connections.find(function(c){
			return (
				c.fromNode === targetNode &&
				c.fromPortKey === targetPortKey &&
				c.toNode === this &&
				c.toPortKey === key
			);
		}, this);
		if(conn)
			this.graph.removeConnection(conn);
	};

	Node.prototype.getAttributes = function(){
		return [];
	};

	Node.prototype.getUniforms = function(){
		return [];
	};

	Node.prototype.getUniforms = function(){
		return [];
	};

	Node.prototype.getVaryings = function(){
		return [];
	};

	Node.prototype.getProcessors = function(){
		return [];
	};

	Node.prototype.render = function(){
		return '';
	};

	Node.prototype.getBuilder = function(){};

	Node.prototype.buildShader = function(){
		return function(){
			this.graph.sortNodes();
			return [
				this.graph.renderAttrubuteDeclarations(),
				this.graph.renderUniformDeclarations(),
				'void main(void){',
					this.graph.renderConnectionVariableDeclarations(),
					this.graph.renderNodeCodes(),
					'{',
						//this.mainNode.render(),
					'}',
				'}'
			].join('\n');

		}.bind(this);
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = Connection;

	function Connection(options){
		options = options || {};

		this.fromNode = options.fromNode || null;
		this.fromPortKey = options.fromPortKey || null;
		this.toNode = options.toNode || null;
		this.toPortKey = options.toPortKey || null;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

	module.exports = FragColorNode;

	function FragColorNode(options){
		options = options || {};
		Node.call(this, options);
	}
	FragColorNode.prototype = Object.create(Node.prototype);
	FragColorNode.prototype.constructor = FragColorNode;

	Node.registerClass('fragColor', FragColorNode);

	FragColorNode.prototype.getInputPorts = function(key){
		return ['rgba'];
	};

	FragColorNode.prototype.getInputTypes = function(key){
		return ['vec4'];
	};

	FragColorNode.prototype.buildShader = function(){
		return function(){
			this.graph.sortNodes();
			var input = (this.getInputVariableName('rgba') || 'vec4(1)');
			return [
				this.graph.renderVaryingDeclarations(),
				this.graph.renderUniformDeclarations(),
				'void main(void){',
					this.graph.renderConnectionVariableDeclarations(),
					this.graph.renderNodeCodes(),
					'{',
						'gl_FragColor = ' + input + ';',
					'}',
				'}'
			].join('\n');

		}.bind(this);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

	module.exports = PositionNode;

	function PositionNode(options){
		options = options || {};
		Node.call(this, options);
	}
	PositionNode.prototype = Object.create(Node.prototype);
	PositionNode.prototype.constructor = PositionNode;

	Node.registerClass('position', PositionNode);

	PositionNode.prototype.buildShader = function(){
		return function(){
			this.graph.sortNodes();
			return [
				this.graph.renderVaryingDeclarations(),
				this.graph.renderAttrubuteDeclarations(),
				this.graph.renderUniformDeclarations(),
				'void main(void){',
					this.graph.renderConnectionVariableDeclarations(),
					this.graph.renderNodeCodes(),
					this.graph.renderAttributeToVaryingAssignments(),
					'{',
						'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition, 1.0);',
					'}',
				'}'
			].join('\n');

		}.bind(this);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

	module.exports = UberFragNode;

	function UberFragNode(){
		Node.call(this, options);
	}
	UberFragNode.prototype = Object.create(Node.prototype);
	UberFragNode.prototype.constructor = UberFragNode;

	UberFragNode.prototype.getInputPorts = function(key){
		return [
			'diffuse',
			'normal',
			'specular',
			'emissive',
			'alpha',
			'alphakill'
		];
	};

	UberFragNode.prototype.canBuildShader = function(){
		return true;
	};

	UberFragNode.prototype.canConnect = function(key, targetNode, targetPortKey){
		return Node.prototype.canConnect.apply(this, arguments);
	};

	UberFragNode.prototype.getInputTypes = function(key){
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

	UberFragNode.prototype.getProcessors = function(){
		return [
			ShaderBuilder.uber.processor,
			ShaderBuilder.light.processor,
			ShaderBuilder.animation.processor
		];
	};

	UberFragNode.prototype.getBuilder = function(){
		return function (shader, shaderInfo) {
			ShaderBuilder.light.builder(shader, shaderInfo);
		};
	};

	UberFragNode.prototype.getUniforms = function(){
		var uniforms = [
			// new Uniform({
			// 	name: 'color' + this.id,
			// 	defaultValue: value.slice(0),
			// 	type: 'vec4'
			// })
		];
		return uniforms;

		// viewProjectionMatrix: Shader.VIEW_PROJECTION_MATRIX,
		// worldMatrix: Shader.WORLD_MATRIX,
		// normalMatrix: Shader.NORMAL_MATRIX,
		// cameraPosition: Shader.CAMERA,
		// diffuseMap: Shader.DIFFUSE_MAP,
		// offsetRepeat: [0, 0, 1, 1],
		// normalMap: Shader.NORMAL_MAP,
		// normalMultiplier: 1.0,
		// specularMap: Shader.SPECULAR_MAP,
		// emissiveMap: Shader.EMISSIVE_MAP,
		// aoMap: Shader.AO_MAP,
		// lightMap: Shader.LIGHT_MAP,
		// environmentCube: 'ENVIRONMENT_CUBE',
		// environmentSphere: 'ENVIRONMENT_SPHERE',
		// reflectionMap: 'REFLECTION_MAP',
		// transparencyMap: 'TRANSPARENCY_MAP',
		// opacity: 1.0,
		// reflectivity: 0.0,
		// refractivity: 0.0,
		// etaRatio: -0.5,
		// fresnel: 0.0,
		// discardThreshold: -0.01,
		// fogSettings: [0, 10000],
		// fogColor: [1, 1, 1],
		// shadowDarkness: 0.5,
		// vertexColorAmount: 1.0,
		// lodBias: 0.0,
		// wrapSettings: [0.5, 0.0]
	};

	UberFragNode.prototype.buildShader = function(){
		return function(){
			this.graph.sortNodes();
			return [
				this.graph.renderAttrubuteDeclarations(),
				this.graph.renderUniformDeclarations(),
				'void main(void){',
					this.graph.renderConnectionVariableDeclarations(),
					this.graph.renderNodeCodes(),
					'{',
						'vec4 final_color = vec4(1.0);',

						'#if defined(DIFFUSE_MAP) && defined(TEXCOORD0)',
							'final_color *= texture2D(diffuseMap, texCoord0, lodBias);',
						'#endif',

						'#ifdef COLOR',
							'final_color *= mix(vec4(1.0), color, vertexColorAmount);',
						'#endif',

						'#if defined(TRANSPARENCY_MAP) && defined(TEXCOORD0)',
							'#ifdef TRANSPARENCY_BW',
								'final_color.a = texture2D(transparencyMap, texCoord0).r;',
							'#else',
								'final_color.a = texture2D(transparencyMap, texCoord0).a;',
							'#endif',
						'#endif',
						'#ifdef OPACITY',
							'final_color.a *= opacity;',
						'#endif',

						'#ifdef DISCARD',
							'if (final_color.a < discardThreshold) discard;',
						'#endif',

						'#ifdef AO_MAP',
							'#ifdef TEXCOORD1',
								'final_color.rgb *= texture2D(aoMap, texCoord1).rgb;',
							'#elif defined(TEXCOORD0)',
								'final_color.rgb *= texture2D(aoMap, texCoord0).rgb;',
							'#endif',
						'#endif',

						'#ifdef LIGHT_MAP',
							'#ifdef TEXCOORD1',
								'final_color.rgb *= texture2D(lightMap, texCoord1).rgb * 2.0;',
							'#elif defined(TEXCOORD0)',
								'final_color.rgb *= texture2D(lightMap, texCoord0).rgb * 2.0;',
							'#endif',
						'#else',
							'vec3 N = vec3(0.0, 1.0, 0.0);',
							'#if defined(NORMAL)', // Do nasty doublework for IE compliance
								'N = normalize(normal);',
							'#endif',
							'#if defined(TANGENT) && defined(NORMAL_MAP) && defined(TEXCOORD0)',
								'mat3 tangentToWorld = mat3(tangent, binormal, normal);',
								'vec3 tangentNormal = texture2D(normalMap, texCoord0, lodBias).xyz * vec3(2.0) - vec3(1.0);',
								'tangentNormal.xy *= normalMultiplier;',
								'vec3 worldNormal = (tangentToWorld * tangentNormal);',
								'N = normalize(worldNormal);',
							// '#elif defined(NORMAL)',
								// 'N = normalize(normal);',
							// '#endif',
							'#endif',

							ShaderBuilder.light.fragment,
						'#endif',

						'#ifdef REFLECTIVE',
							'if (refractivity > 0.0) {',
								'vec4 environment = vec4(0.0);',
								'#ifdef ENVIRONMENT_CUBE',
									'vec3 refractionVector = refract(normalize(viewPosition), N, etaRatio);',
									'refractionVector.x = -refractionVector.x;',
									'environment = textureCube(environmentCube, refractionVector);',
								'#elif defined(ENVIRONMENT_SPHERE)',
									'vec3 refractionVector = refract(normalize(viewPosition), N, etaRatio);',
									'refractionVector = -refractionVector;',
									'float xx = (atan(refractionVector.z, refractionVector.x) + M_PI) / (2.0 * M_PI);',
									'float yy = refractionVector.y * 0.5 + 0.5;',
									'environment = texture2D(environmentSphere, vec2(xx, yy));',
								'#endif',
								'environment.rgb = mix(clearColor.rgb, environment.rgb, environment.a);',

								'final_color.rgb = mix(final_color.rgb, environment.rgb, refractivity);',
							'}',

							'if (reflectivity > 0.0) {',
								'vec4 environment = vec4(0.0);',
								'#ifdef ENVIRONMENT_CUBE',
									'vec3 reflectionVector = reflect(normalize(viewPosition), N);',
									'reflectionVector.yz = -reflectionVector.yz;',
									'environment = textureCube(environmentCube, reflectionVector);',
								'#elif defined(ENVIRONMENT_SPHERE)',
									'vec3 reflectionVector = reflect(normalize(viewPosition), N);',
									'float xx = (atan(reflectionVector.z, reflectionVector.x) + M_PI) / (2.0 * M_PI);',
									'float yy = reflectionVector.y * 0.5 + 0.5;',
									'environment = texture2D(environmentSphere, vec2(xx, yy));',
								'#endif',
								'environment.rgb = mix(clearColor.rgb, environment.rgb, environment.a);',

								'float reflectionAmount = reflectivity;',
								'#if defined(REFLECTION_MAP) && defined(TEXCOORD0)',
									'reflectionAmount *= texture2D(reflectionMap, texCoord0).r;',
								'#endif',

								'float fresnelVal = pow(1.0 - abs(dot(normalize(viewPosition), N)), fresnel * 4.0);',
								'reflectionAmount *= fresnelVal;',

								'#if REFLECTION_TYPE == 0',
									'final_color.rgb = mix(final_color.rgb, environment.rgb, reflectionAmount);',
								'#elif REFLECTION_TYPE == 1',
									'final_color.rgb += environment.rgb * reflectionAmount;',
								'#endif',
								'final_color.a = min(final_color.a + reflectionAmount, 1.0);',
							'}',
						'#endif',

						'#ifndef LIGHT_MAP',
							'final_color.rgb += totalSpecular;',
							'final_color.a = min(final_color.a + length(totalSpecular) / 3.0, 1.0);',
						'#endif',

						'#ifdef FOG',
							'float d = pow(smoothstep(fogSettings.x, fogSettings.y, length(viewPosition)), 1.0);',
							'final_color.rgb = mix(final_color.rgb, fogColor, d);',
						'#endif',

						'gl_FragColor = final_color;',
					'}',
				'}'
			].join('\n');

		}.bind(this);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);

	module.exports = UberVertNode;

	function UberVertNode(){
		Node.call(this, options);
	}
	UberVertNode.prototype = Object.create(Node.prototype);
	UberVertNode.prototype.constructor = UberVertNode;

	UberVertNode.prototype.canBuildShader = function(){
		return true;
	};

	UberVertNode.prototype.getUniforms = function(){
		var uniforms = [
			new Uniform({
				name: 'viewProjectionMatrix',
				defaultValue: 'VIEW_PROJECTION_MATRIX',
				type: 'vec3'
			}),
			new Uniform({
				name: 'worldMatrix',
				defaultValue: 'WORLD_MATRIX',
				type: 'mat4'
			}),
			new Uniform({
				name: 'normalMatrix',
				defaultValue: 'NORMAL_MATRIX',
				type: 'mat3'
			}),
			new Uniform({
				name: 'cameraPosition',
				defaultValue: 'CAMERA',
				type: 'vec3'
			})
		];
		return uniforms;
		// diffuseMap: Shader.DIFFUSE_MAP,
		// offsetRepeat: [0, 0, 1, 1],
		// normalMap: Shader.NORMAL_MAP,
		// normalMultiplier: 1.0,
		// specularMap: Shader.SPECULAR_MAP,
		// emissiveMap: Shader.EMISSIVE_MAP,
		// aoMap: Shader.AO_MAP,
		// lightMap: Shader.LIGHT_MAP,
		// environmentCube: 'ENVIRONMENT_CUBE',
		// environmentSphere: 'ENVIRONMENT_SPHERE',
		// reflectionMap: 'REFLECTION_MAP',
		// transparencyMap: 'TRANSPARENCY_MAP',
		// opacity: 1.0,
		// reflectivity: 0.0,
		// refractivity: 0.0,
		// etaRatio: -0.5,
		// fresnel: 0.0,
		// discardThreshold: -0.01,
		// fogSettings: [0, 10000],
		// fogColor: [1, 1, 1],
		// shadowDarkness: 0.5,
		// vertexColorAmount: 1.0,
		// lodBias: 0.0,
		// wrapSettings: [0.5, 0.0]
	};

	UberVertNode.prototype.getAttributes = function(){
		var attribute = [
			new Attribute({
				name: 'vertexPosition',
				key: 'POSITION',
				type: 'vec3'
			}),
			new Attribute({
				name: 'vertexNormal',
				key: 'NORMAL',
				type: 'vec3',
				ifdef: 'NORMAL'
			}),
			new Attribute({
				name: 'vertexTangent',
				key: 'TANGENT',
				type: 'vec4',
				ifdef: 'NORMAL'
			}),
			new Attribute({
				name: 'vertexColor',
				key: 'COLOR',
				type: 'vec4',
				ifdef: 'COLOR'
			}),
			new Attribute({
				name: 'vertexUV0',
				key: 'TEXCOORD0',
				type: 'vec2',
				ifdef: 'TEXCOORD0'
			}),
			new Attribute({
				name: 'vertexUV1',
				key: 'TEXCOORD1',
				type: 'vec2',
				ifdef: 'TEXCOORD1'
			}),
			new Attribute({
				name: 'vertexJointIDs',
				key: 'JOINTIDS',
				type: 'vec4',
				ifdef: 'JOINTIDS'
			}),
			new Attribute({
				name: 'vertexWeights',
				key: 'WEIGHTS',
				type: 'vec4',
				ifdef: 'WEIGHTS'
			})
		];
		return attribute;
	};

	UberVertNode.prototype.buildShader = function(){
		return function(){
			this.graph.sortNodes();
			return [
				this.graph.renderAttrubuteDeclarations(),
				this.graph.renderUniformDeclarations(),
				'void main(void){',
					this.graph.renderConnectionVariableDeclarations(),
					this.graph.renderNodeCodes(),
					'{',
						'mat4 wMatrix = worldMatrix;',
						'#ifdef NORMAL',
							'mat3 nMatrix = normalMatrix;',
						'#endif',
						ShaderBuilder.animation.vertex,
						'vec4 worldPos = wMatrix * vec4(vertexPosition, 1.0);',
						'vWorldPos = worldPos.xyz;',
						'gl_Position = viewProjectionMatrix * worldPos;',

						'viewPosition = cameraPosition - worldPos.xyz;',

						'#ifdef NORMAL',
						'	normal = normalize(nMatrix * vertexNormal);',
						'#endif',
						'#ifdef TANGENT',
						'	tangent = normalize(nMatrix * vertexTangent.xyz);',
						'	binormal = cross(normal, tangent) * vec3(vertexTangent.w);',
						'#endif',
						'#ifdef COLOR',
						'	color = vertexColor;',
						'#endif',
						'#ifdef TEXCOORD0',
						'	texCoord0 = vertexUV0 * offsetRepeat.zw + offsetRepeat.xy;',
						'#endif',
						'#ifdef TEXCOORD1',
						'	texCoord1 = vertexUV1;',
						'#endif',

						ShaderBuilder.light.vertex,
					'}',
				'}'
			].join('\n');

		}.bind(this);
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = Uniform;

	function Uniform(options){
		options = options || {};

		this.type = options.type || 'float';
		this.name = options.name || 'uUntitled';
		this.defaultValue = options.defaultValue || 1;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

	module.exports = Vector4Node;

	// A vector with four components/values.
	function Vector4Node(options){
		options = options || {};
		Node.call(this, options);
		this.value = options.value ? options.value.slice(0) : [0,0,0,0];
	}
	Vector4Node.prototype = Object.create(Node.prototype);
	Vector4Node.prototype.constructor = Vector4Node;

	Node.registerClass('vec4', Vector4Node);

	Vector4Node.prototype.getInputPorts = function(){
		return [];
	};

	Vector4Node.prototype.getOutputPorts = function(){
		return ['rgba'];
	};

	Vector4Node.prototype.getOutputTypes = function(key){
		return key === 'rgba' ? ['vec4'] : [];
	};

	Vector4Node.prototype.render = function(){
		var outVarName = this.getOutputVariableNames('rgba')[0];
		return outVarName ? outVarName + ' = vec4(' + this.value.join(',') + ');' : '';
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Utils = __webpack_require__(10);

	module.exports = ValueNode;

	// A vector with four components/values.
	function ValueNode(options){
		options = options || {};
		Node.call(this, options);
		this.value = options.value || 0;
	}
	ValueNode.prototype = Object.create(Node.prototype);
	ValueNode.prototype.constructor = ValueNode;

	Node.registerClass('value', ValueNode);

	ValueNode.prototype.getOutputPorts = function(key){
		return ['value'];
	};

	ValueNode.prototype.getOutputTypes = function(key){
		return key === 'value' ? ['float'] : [];
	};

	ValueNode.prototype.render = function(){
		var outVarName = this.getOutputVariableNames('value')[0];
		return outVarName ? outVarName + ' = ' + Utils.numberToGlslFloat(this.value) + ';' : '';
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

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
	}

	Utils.convertGlslType = function(expression, type, newType){
		return expressionTable[type][newType].replace('X', expression);
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);
	var Attribute = __webpack_require__(12);
	var Varying = __webpack_require__(13);

	module.exports = UVNode;

	function UVNode(options){
		options = options || {};
		Node.call(this, options);
	}
	UVNode.prototype = Object.create(Node.prototype);
	UVNode.prototype.constructor = UVNode;

	Node.registerClass('uv', UVNode);

	UVNode.prototype.getOutputPorts = function(key){
		return [
			'uv',
			'u',
			'v'
		];
	};

	UVNode.prototype.getAttributes = function(){
		return [
			new Attribute({
				name: 'vertexUV0',
				key: 'TEXCOORD0',
				type: 'vec2',
				ifdef: 'TEXCOORD0'
			})
		];
	};

	UVNode.prototype.getVaryings = function(){
		return [
			new Varying({
				type: 'vec2',
				name: 'texCoord0',
				attributeKey: 'TEXCOORD0'
			})
		];
	};

	UVNode.prototype.getOutputTypes = function(key){
		var types = [];
		switch(key){
		case 'uv':
			types = ['vec2'];
			break;
		case 'u':
		case 'v':
			types = ['float'];
			break;
		}
		return types;
	};

	UVNode.prototype.render = function(){
		var source = [];

		var uvVarName = this.getOutputVariableNames('uv')[0];
		if(uvVarName){
			source.push(uvVarName + ' = texCoord0;');
		}

		var uVarName = this.getOutputVariableNames('u')[0];
		if(uVarName){
			source.push(uVarName + ' = texCoord0.x;');
		}

		var vVarName = this.getOutputVariableNames('v')[0];
		if(vVarName){
			source.push(vVarName + ' = texCoord0.y;');
		}

		return source.join('\n');
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = Attribute;

	function Attribute(options){
		options = options || {};
		this.type = options.type || 'float';
		this.name = options.name || 'aUntitled';
		this.key = options.key || 'POSITION';
		this.ifdef = options.ifdef || ''; // A define name or empty string to indicate no define dependency
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = Varying;

	function Varying(options){
		options = options || {};

		this.type = options.type || 'float';
		this.name = options.name || 'vUntitled';
		this.attributeKey = options.attributeKey || ''; // e.g. COLOR
		this.ifdef = options.ifdef || ''; // A define name or empty string to indicate no define dependency
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);

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


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var MathFunctionNode = __webpack_require__(26);

	module.exports = SineNode;

	function SineNode(options){
		options = options || {};
		options.functionName = 'sin';
		MathFunctionNode.call(this, options);
	}
	SineNode.prototype = Object.create(MathFunctionNode.prototype);
	SineNode.prototype.constructor = SineNode;

	Node.registerClass('sine', SineNode);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var OperatorNode = __webpack_require__(30);
	var Utils = __webpack_require__(10);

	module.exports = MultiplyNode;

	function MultiplyNode(options){
		options = options || {};
		OperatorNode.call(this, options);
	}
	MultiplyNode.prototype = Object.create(OperatorNode.prototype);
	MultiplyNode.prototype.constructor = MultiplyNode;

	Node.registerClass('multiply', MultiplyNode);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);
	var Attribute = __webpack_require__(12);
	var Varying = __webpack_require__(13);

	module.exports = TextureNode;

	function TextureNode(options){
		options = options || {};
		Node.call(this, options);
	}
	TextureNode.prototype = Object.create(Node.prototype);
	TextureNode.prototype.constructor = TextureNode;

	Node.registerClass('texture', TextureNode);

	TextureNode.prototype.getInputPorts = function(key){
		return ['uv'];
	};

	TextureNode.prototype.getInputTypes = function(key){
		var types = [];
		switch(key){
		case 'uv':
			types = ['vec2'];
			break;
		}
		return types;
	};

	TextureNode.prototype.getOutputPorts = function(key){
		return ['rgba'];
	};

	TextureNode.prototype.getOutputTypes = function(key){
		var types = [];
		switch(key){
		case 'rgba':
			types = ['vec4'];
			break;
		}
		return types;
	};

	TextureNode.prototype.getUniforms = function(){
		return [
			new Uniform({
				name: 'texture' + this.id,
				type: 'sampler2D',
				defaultValue: 'TEXTURE' + this.id
			})
		];
	};

	TextureNode.prototype.render = function(){
		var source = [];
		var outName = this.getOutputVariableNames('rgba')[0];
		var inName = this.getInputVariableName('uv');
		if(outName && inName){
			source.push(outName + ' = texture2D(texture' + this.id + ', vec2(' + inName + '));');
		} else if(outName){
			source.push(outName + ' = vec4(0,0,0,1);');
		}

		return source.join('\n');
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);

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
		// var sum = this.getComponentSum();

		// var a = this.inputPortIsConnected('a');
		// var b = this.inputPortIsConnected('b');
		// var c = this.inputPortIsConnected('c');
		// var d = this.inputPortIsConnected('d');

		// if(!a && !b && !c && !d)
		// 	return ['a'];
		// else if(a && !b && !c && !d && sum < 4)
		// 	return ['a', 'b'];
		// else if(a && b && !c && !d && sum < 4)
		// 	return ['a', 'b', 'c'];
		// else if(a && b && c && !d && sum < 4)
		// 	return ['a', 'b', 'c', 'd'];
		// else
			return ['a', 'b', 'c', 'd'];
	};

	AppendNode.prototype.getOutputPorts = function(){
		return ['out'];
	};

	AppendNode.prototype.getInputTypes = function(key){
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
				var type = this.getInputVariableTypes(x)[0];
				sum += weights[type];
			}
		}
		return sum;
	};

	AppendNode.prototype.getOutputTypes = function(key){
		return key === 'out' ? [AppendNode.supportedTypes[this.getComponentSum() - 1]] : [];
	};

	AppendNode.prototype.render = function(){
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
		var outType = this.getOutputTypes('out')[0];

		if(outVarName){
			return outVarName + ' = ' + outType + '(' + vars.join(',') + ');';
		}

		return '';
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Graph = __webpack_require__(20);
	var FragColorNode = __webpack_require__(3);

	module.exports = FragmentGraph;

	function FragmentGraph(options){
		options = options || {};
		options.mainNode = options.mainNode || new FragColorNode();
		Graph.call(this, options);
	}
	FragmentGraph.prototype = Object.create(Graph.prototype);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var toposort = __webpack_require__(21);

	module.exports = Graph;

	function Graph(options){
		options = options || {};

		this.shader = options.shader || null;
		this.nodes = [];
		this.connections = [];
		this.mainNode = options.mainNode || null;
		if(this.mainNode){
			this.addNode(this.mainNode);
		}
	}

	Graph.prototype.addNode = function(node){
		if(!node) throw new Error('Node not given');
		if(node.graph) throw new Error('Node was already added to a graph');
		this.nodes.push(node);
		node.graph = this;
	};

	Graph.prototype.removeNode = function(node){
		var index = this.nodes.indexOf(node);
		if(index !== -1){
			this.nodes.splice(index, 1);
			node.graph = null;
		}
	};

	Graph.prototype.getNodeById = function(id){
		return this.nodes.find(function(node){
			return node.id == id;
		});
	};

	Graph.prototype.addConnection = function(conn){
		if(conn.graph) throw new Error('Connection was already added to a graph');
		this.connections.push(conn);
		conn.graph = this;
		this.sortNodes();
	};

	Graph.prototype.removeConnection = function(conn){
		var index = this.connections.indexOf(conn);
		if(index !== -1){
			this.connections.splice(index, 1);
		}
	};

	Graph.prototype.inputPortIsConnected = function(node, inputPort){
		return this.connections.some(function (conn){
			return conn.toNode === node && conn.toPortKey === inputPort;
		});
	};
	Graph.prototype.outputPortIsConnected = function(node, outputPort){
		return this.connections.some(function (conn){
			return conn.fromNode === node && conn.fromPortKey === outputPort;
		});
	};

	Graph.prototype.getNodeConnectedToInputPort = function(node, inputPort){
		var connection = this.connections.filter(function (conn){
			return conn.toNode === node && conn.toPortKey === inputPort;
		})[0];
		return connection && connection.fromNode;
	};

	Graph.prototype.getPortKeyConnectedToInputPort = function(node, inputPort){
		var connection = this.connections.filter(function (conn){
			return conn.toNode === node && conn.toPortKey === inputPort;
		})[0];
		return connection && connection.fromPortKey;
	};

	Graph.prototype.getUniforms = function(){
		var uniforms = [];
		this.nodes.forEach(function (node){
			uniforms = uniforms.concat(node.getUniforms());
		});
		return uniforms;
	};

	Graph.prototype.getAttributes = function(){
		var attributes = [];
		this.shader.getNodes().forEach(function (node){
			attributes = attributes.concat(node.getAttributes());
		});
		return attributes;
	};

	Graph.prototype.getVaryings = function(){
		var varyings = [];
		this.shader.getNodes().forEach(function (node){
			varyings = varyings.concat(node.getVaryings());
		});
		return varyings;
	};

	Graph.prototype.getProcessors = function(){
		var processors = [];
		this.nodes.forEach(function (node){
			processors = processors.concat(node.getProcessors());
		});
		return processors;
	};

	function sortByName(a1, a2){
		if(a1.name === a2.name){
			return 0;
		} else if(a1.name > a2.name){
			return 1;
		} else {
			return -1;
		}
	}

	Graph.prototype.renderNodeCodes = function(){
		var shaderSource = [];
		var nodes = this.nodes;
		for (var i = 0; i < nodes.length; i++) {
			node = nodes[i];
			if(node !== this.mainNode){ // Save main node until last
				var nodeSource = node.render();
				if(nodeSource){
					shaderSource.push('{ // node ' + node.id + ', ' + node.constructor.type, nodeSource, '}');
				}
			}
		}
		return shaderSource.join('\n');
	};

	Graph.prototype.renderAttributeToVaryingAssignments = function(){
		var shaderSource = [];
		var keyToAttributeMap = {};
		this.getAttributes().forEach(function(attribute){
			keyToAttributeMap[attribute.key] = attribute;
		});
		this.getVaryings().sort(sortByName).forEach(function(varying){
			var attribute = keyToAttributeMap[varying.attributeKey];
			if(attribute){
				shaderSource.push(varying.name + ' = ' + attribute.name + ';');
			}
		});
		return shaderSource.join('\n');
	};

	Graph.prototype.renderConnectionVariableDeclarations = function(){
		var shaderSource = [];
		var nodes = this.nodes;
		for (var i = 0; i < nodes.length; i++) {
			node = nodes[i];
			var outputPorts = node.getOutputPorts();
			for (var k = 0; k < outputPorts.length; k++) {
				var key = outputPorts[k];
				// is the output port connected?
				if(this.outputPortIsConnected(node, key)){
					var types = node.getOutputTypes(key);
					var names = node.getOutputVariableNames(key);
					for (j = 0; j < names.length; j++) {
						shaderSource.push(types[j] + ' ' + names[j] + ';');
					}
				}
			}
		}
		return shaderSource.join('\n');
	};

	Graph.prototype.renderUniformDeclarations = function(){
		var shaderSource = [];
		this.getUniforms().sort(sortByName).forEach(function(uniform){
			shaderSource.push('uniform ' + uniform.type + ' ' + uniform.name + ';');
		});
		return shaderSource.join('\n');
	};

	Graph.prototype.renderAttrubuteDeclarations = function(){
		var shaderSource = [];
		var declarations = {}; // Only unique declarations
		this.getAttributes().sort(sortByName).forEach(function(attribute){
			declarations['attribute ' + attribute.type + ' ' + attribute.name + ';'] = true;
		});
		return Object.keys(declarations).join('\n');
	};

	Graph.prototype.renderVaryingDeclarations = function(){
		var shaderSource = [];
		var declarations = {}; // Only unique declarations
		this.getVaryings().sort(sortByName).forEach(function(varying){
			declarations['varying ' + varying.type + ' ' + varying.name + ';'] = true;
		});
		return Object.keys(declarations).join('\n');
	};

	// Topology sort the nodes
	Graph.prototype.sortNodes = function(){
		var edges = this.connections.map(function (connection) {
			return [
				connection.fromNode.id,
				connection.toNode.id
			];
		});
		var nodeIds = toposort(edges);
		var nodes = this.nodes.slice(0);
		this.nodes = nodeIds.map(function (nodeId) {
			for (var i = nodes.length - 1; i >= 0; i--) {
				var node = nodes[i];
				if(nodeId === node.id) return nodes.splice(i, 1)[0];
			}
			throw new Error('Node id not found: ' + nodeId);
		});

		// add any left overs (needed?)
		while(nodes.length){
			this.nodes.push(nodes.pop())
		}
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	
	/**
	 * Topological sorting function
	 *
	 * @param {Array} edges
	 * @returns {Array}
	 */

	module.exports = exports = function(edges){
	  return toposort(uniqueNodes(edges), edges)
	}

	exports.array = toposort

	function toposort(nodes, edges) {
	  var cursor = nodes.length
	    , sorted = new Array(cursor)
	    , visited = {}
	    , i = cursor

	  while (i--) {
	    if (!visited[i]) visit(nodes[i], i, [])
	  }

	  return sorted

	  function visit(node, i, predecessors) {
	    if(predecessors.indexOf(node) >= 0) {
	      throw new Error('Cyclic dependency: '+JSON.stringify(node))
	    }

	    if (visited[i]) return;
	    visited[i] = true

	    // outgoing edges
	    var outgoing = edges.filter(function(edge){
	      return edge[0] === node
	    })
	    if (i = outgoing.length) {
	      var preds = predecessors.concat(node)
	      do {
	        var child = outgoing[--i][1]
	        visit(child, nodes.indexOf(child), preds)
	      } while (i)
	    }

	    sorted[--cursor] = node
	  }
	}

	function uniqueNodes(arr){
	  var res = []
	  for (var i = 0, len = arr.length; i < len; i++) {
	    var edge = arr[i]
	    if (res.indexOf(edge[0]) < 0) res.push(edge[0])
	    if (res.indexOf(edge[1]) < 0) res.push(edge[1])
	  }
	  return res
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var FragmentGraph = __webpack_require__(19);
	var VertexGraph = __webpack_require__(23);

	module.exports = GraphShader;

	function GraphShader(options){
		options = options || {};
		
		this.fragmentGraph = new FragmentGraph({
			shader: this,
			mainNode: options.fragMainNode
		});
		this.vertexGraph = new VertexGraph({
			shader: this,
			mainNode: options.vertexMainNode
		});
	}

	GraphShader.prototype.getNodes = function(){
		return this.vertexGraph.nodes.concat(this.fragmentGraph.nodes);
	};

	GraphShader.prototype.buildShader = function(){
		var shaderDef = {
			processors: [],
			defines: {},
			attributes : {},
			uniforms : {},
			vshader: '',
			fshader : ''
		};

		// Uniforms and attributes
		[this.fragmentGraph, this.vertexGraph].forEach(function (graph){

			// Uniforms
			graph.getUniforms().forEach(function(uniform){
				shaderDef.uniforms[uniform.name] = uniform.defaultValue;
			});

			// Attributes
			graph.getAttributes().forEach(function(attribute){
				shaderDef.attributes[attribute.name] = attribute.key;
			});
		});

		// Source
		shaderDef.fshader = this.fragmentGraph.mainNode.buildShader();
		shaderDef.vshader = this.vertexGraph.mainNode.buildShader();

		shaderDef.builder = this.fragmentGraph.mainNode.getBuilder() || this.vertexGraph.mainNode.getBuilder();

		shaderDef.processors = shaderDef.processors.concat(this.fragmentGraph.getProcessors(), this.vertexGraph.getProcessors());

		return shaderDef;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var PositionNode = __webpack_require__(4);
	var Graph = __webpack_require__(20);
	var Uniform = __webpack_require__(7);
	var Attribute = __webpack_require__(12);

	module.exports = VertexGraph;

	function VertexGraph(options){
		options.mainNode = options.mainNode || new PositionNode();
		Graph.call(this, options);
	}
	VertexGraph.prototype = Object.create(Graph.prototype);

	VertexGraph.prototype.getUniforms = function(){
		var uniforms = Graph.prototype.getUniforms.apply(this);
		uniforms.push(
			new Uniform({
				name: 'viewProjectionMatrix',
				type: 'mat4',
				defaultValue: 'VIEW_PROJECTION_MATRIX'
			}),
			new Uniform({
				name: 'worldMatrix',
				type: 'mat4',
				defaultValue: 'WORLD_MATRIX'
			})
		);
		return uniforms;
	};

	VertexGraph.prototype.getAttributes = function(){
		var attributes = Graph.prototype.getAttributes.apply(this);
		attributes.push(new Attribute({
			name: 'vertexPosition',
			defaultValue: 'POSITION',
			type: 'vec3'
		}));
		return attributes;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

	module.exports = Vector2Node;

	function Vector2Node(options){
		options = options || {};
		Node.call(this, options);
		this.value = options.value ? options.value.slice(0) : [0,0];
	}
	Vector2Node.prototype = Object.create(Node.prototype);
	Vector2Node.prototype.constructor = Vector2Node;

	Node.registerClass('vec2', Vector2Node);

	Vector2Node.prototype.getInputPorts = function(){
		return [];
	};

	Vector2Node.prototype.getOutputPorts = function(){
		return ['rg'];
	};

	Vector2Node.prototype.getOutputTypes = function(key){
		return key === 'rg' ? ['vec2'] : [];
	};

	Vector2Node.prototype.render = function(){
		var outVarName = this.getOutputVariableNames('rg')[0];
		return outVarName ? outVarName + ' = vec2(' + this.value.join(',') + ');' : '';
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

	module.exports = Vector3Node;

	function Vector3Node(options){
		options = options || {};
		Node.call(this, options);
		this.value = options.value ? options.value.slice(0) : [0,0,0];
	}
	Vector3Node.prototype = Object.create(Node.prototype);
	Vector3Node.prototype.constructor = Vector3Node;

	Node.registerClass('vec3', Vector3Node);

	Vector3Node.prototype.getInputPorts = function(){
		return [];
	};

	Vector3Node.prototype.getOutputPorts = function(){
		return ['rgb'];
	};

	Vector3Node.prototype.getOutputTypes = function(key){
		return key === 'rgb' ? ['vec3'] : [];
	};

	Vector3Node.prototype.render = function(){
		var outVarName = this.getOutputVariableNames('rgb')[0];
		return outVarName ? outVarName + ' = vec3(' + this.value.join(',') + ');' : '';
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Utils = __webpack_require__(10);

	module.exports = MathFunctionNode;

	function MathFunctionNode(options){
		options = options || {};
		this.functionName = options.functionName || 'f';
		Node.call(this, options);
	}
	MathFunctionNode.prototype = Object.create(Node.prototype);
	MathFunctionNode.prototype.constructor = MathFunctionNode;

	MathFunctionNode.supportedTypes = [
		'float',
		'vec2',
		'vec3',
		'vec4'
	];

	MathFunctionNode.prototype.getInputPorts = function(key){
		return ['x'];
	};

	MathFunctionNode.prototype.getOutputPorts = function(key){
		return ['y'];
	};

	// Output type is same as what we get in.
	MathFunctionNode.prototype.getOutputTypes = function(key){
		var types = [];
		if(key === 'y'){
			types = this.inputPortIsConnected('x') ? this.getInputVariableTypes('x') : ['float'];
		}
		return types;
	};

	MathFunctionNode.prototype.getInputTypes = function(key){
		return key === 'x' ? MathFunctionNode.supportedTypes : [];
	};

	MathFunctionNode.prototype.render = function(){
		var outVarName = this.getOutputVariableNames('y')[0];
		var outVarType = this.getOutputTypes('y')[0];

		var inVarName = this.getInputVariableName('x');
		var inVarType = this.getInputVariableTypes('x')[0];

		if(outVarName && inVarName){
			return outVarName + ' = ' + this.functionName + '(' + Utils.convertGlslType(inVarName, inVarType, outVarType) + ');';
		} else if(outVarName){
			return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outVarType) + ';';
		} else {
			return '';
		}
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var MathFunctionNode = __webpack_require__(26);

	module.exports = AbsNode;

	function AbsNode(options){
		options = options || {};
		options.functionName = 'abs';
		MathFunctionNode.call(this, options);
	}
	AbsNode.prototype = Object.create(MathFunctionNode.prototype);
	AbsNode.prototype.constructor = AbsNode;

	Node.registerClass('abs', AbsNode);

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var MathFunctionNode = __webpack_require__(26);

	module.exports = FloorNode;

	function FloorNode(options){
		options = options || {};
		options.functionName = 'floor';
		MathFunctionNode.call(this, options);
	}
	FloorNode.prototype = Object.create(MathFunctionNode.prototype);
	FloorNode.prototype.constructor = FloorNode;

	Node.registerClass('floor', FloorNode);

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var MathFunctionNode = __webpack_require__(26);

	module.exports = CeilNode;

	function CeilNode(options){
		options = options || {};
		options.functionName = 'ceil';
		MathFunctionNode.call(this, options);
	}
	CeilNode.prototype = Object.create(MathFunctionNode.prototype);
	CeilNode.prototype.constructor = CeilNode;

	Node.registerClass('floor', CeilNode);

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Utils = __webpack_require__(10);

	module.exports = OperatorNode;

	function OperatorNode(options){
		options = options || {};
		this.operator = options.operator || '*';
		Node.call(this, options);
	}
	OperatorNode.prototype = Object.create(Node.prototype);
	OperatorNode.prototype.constructor = OperatorNode;

	OperatorNode.supportedTypes = [
		'float',
		'vec2',
		'vec3',
		'vec4'
	];

	OperatorNode.prototype.getInputPorts = function(key){
		return ['a', 'b'];
	};

	OperatorNode.prototype.getOutputPorts = function(key){
		return ['out'];
	};

	OperatorNode.prototype.getOutputTypes = function(key){
		var types = [];
		if(key === 'out'){
			if(this.inputPortIsConnected('a') || this.inputPortIsConnected('b')){
				// Something is connected to the input - choose the vector type of largest dimension
				types = [
					Utils.getHighestDimensionVectorType(
						this.getInputVariableTypes('a').concat(this.getInputVariableTypes('b'))
					)
				];
			} else {
				// Nothing connected - use default float type
				types = ['float'];
			}
		}
		return types;
	};

	OperatorNode.prototype.getInputTypes = function(key){
		return (key === 'a' || key === 'b') ? OperatorNode.supportedTypes : [];
	};

	OperatorNode.prototype.render = function(){
		var inVarNameA = this.getInputVariableName('a');
		var inVarTypeA = this.getInputVariableTypes('a')[0];

		var inVarNameB = this.getInputVariableName('b');
		var inVarTypeB = this.getInputVariableTypes('b')[0];

		var outVarName = this.getOutputVariableNames('out')[0];
		var outVarType = this.getOutputTypes('out')[0];

		if(inVarNameA && inVarNameB && outVarName){
			return outVarName + ' = ' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + this.operator + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ';';
		} else if(outVarName){
			var outType = this.getOutputTypes('out')[0];
			return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
		} else {
			return '';
		}
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var OperatorNode = __webpack_require__(30);
	var Utils = __webpack_require__(10);

	module.exports = AddNode;

	function AddNode(options){
		options = options || {};
		OperatorNode.call(this, options);
	}
	AddNode.prototype = Object.create(OperatorNode.prototype);
	AddNode.prototype.constructor = AddNode;

	Node.registerClass('add', AddNode);

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var OperatorNode = __webpack_require__(30);
	var Utils = __webpack_require__(10);

	module.exports = SubtractNode;

	function SubtractNode(options){
		options = options || {};
		OperatorNode.call(this, options);
	}
	SubtractNode.prototype = Object.create(OperatorNode.prototype);
	SubtractNode.prototype.constructor = SubtractNode;

	Node.registerClass('subtract', SubtractNode);

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var OperatorNode = __webpack_require__(30);
	var Utils = __webpack_require__(10);

	module.exports = DivideNode;

	function DivideNode(options){
		options = options || {};
		OperatorNode.call(this, options);
	}
	DivideNode.prototype = Object.create(OperatorNode.prototype);
	DivideNode.prototype.constructor = DivideNode;

	Node.registerClass('divide', DivideNode);

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Utils = __webpack_require__(10);

	module.exports = ReciprocalNode;

	function ReciprocalNode(options){
		options = options || {};
		Node.call(this, options);
	}
	ReciprocalNode.prototype = Object.create(Node.prototype);
	ReciprocalNode.prototype.constructor = ReciprocalNode;

	Node.registerClass('reciprocal', ReciprocalNode);

	ReciprocalNode.supportedTypes = [
		'float',
		'vec2',
		'vec3',
		'vec4'
	];

	ReciprocalNode.prototype.getInputPorts = function(key){
		return ['x'];
	};

	ReciprocalNode.prototype.getOutputPorts = function(key){
		return ['y'];
	};

	// Output type is same as what we get in.
	ReciprocalNode.prototype.getOutputTypes = function(key){
		var types = [];
		if(key === 'y'){
			types = this.inputPortIsConnected('x') ? this.getInputVariableTypes('x') : ['float'];
		}
		return types;
	};

	ReciprocalNode.prototype.getInputTypes = function(key){
		return key === 'x' ? ReciprocalNode.supportedTypes : [];
	};

	ReciprocalNode.prototype.render = function(){
		var outVarName = this.getOutputVariableNames('y')[0];
		var outVarType = this.getOutputTypes('y')[0];

		var inVarName = this.getInputVariableName('x');
		var inVarType = this.getInputVariableTypes('x')[0];

		if(outVarName && inVarName){
			return outVarName + ' = ' + inVarType + '(1) / (' + Utils.convertGlslType(inVarName, inVarType, outVarType) + ');';
		} else if(outVarName){
			return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outVarType) + ';';
		} else {
			return '';
		}
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Utils = __webpack_require__(10);

	module.exports = PowNode;

	function PowNode(options){
		options = options || {};
		Node.call(this, options);
	}
	PowNode.prototype = Object.create(Node.prototype);
	PowNode.prototype.constructor = PowNode;

	Node.registerClass('pow', PowNode);

	PowNode.supportedTypes = [
		'float',
		'vec2',
		'vec3',
		'vec4'
	];

	PowNode.prototype.getInputPorts = function(key){
		return ['val', 'exp'];
	};

	PowNode.prototype.getOutputPorts = function(key){
		return ['out'];
	};

	PowNode.prototype.getOutputTypes = function(key){
		var types = [];
		if(key === 'out'){
			if(this.inputPortIsConnected('val') || this.inputPortIsConnected('exp')){
				// Something is connected to the input - choose the vector type of largest dimension
				types = [
					Utils.getHighestDimensionVectorType(
						this.getInputVariableTypes('val').concat(this.getInputVariableTypes('exp'))
					)
				];
			} else {
				// Nothing connected - use default float type
				types = ['float'];
			}
		}
		return types;
	};

	PowNode.prototype.getInputTypes = function(key){
		return (key === 'val' || key === 'exp') ? PowNode.supportedTypes : [];
	};

	PowNode.prototype.render = function(){
		var inVarNameA = this.getInputVariableName('val');
		var inVarTypeA = this.getInputVariableTypes('val')[0];

		var inVarNameB = this.getInputVariableName('exp');
		var inVarTypeB = this.getInputVariableTypes('exp')[0];

		var outVarName = this.getOutputVariableNames('out')[0];
		var outVarType = this.getOutputTypes('out')[0];

		if(inVarNameA && inVarNameB && outVarName){
			return outVarName + ' = pow(' + Utils.convertGlslType(inVarNameA, inVarTypeA, outVarType) + ',' + Utils.convertGlslType(inVarNameB, inVarTypeB, outVarType) + ');';
		} else if(outVarName){
			var outType = this.getOutputTypes('out')[0];
			return outVarName + ' = ' + Utils.convertGlslType('0.0', 'float', outType) + ';';
		} else {
			return '';
		}
	};


/***/ }
/******/ ]);