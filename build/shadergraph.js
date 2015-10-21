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
		Vector4Node: __webpack_require__(8),
		ValueNode: __webpack_require__(9),
		UVNode: __webpack_require__(10),
		TimeNode: __webpack_require__(13),
		SineNode: __webpack_require__(14),
		MultiplyNode: __webpack_require__(15),
		TextureNode: __webpack_require__(21),

		Attribute: __webpack_require__(11),
		Connection: __webpack_require__(2),
		FragmentGraph: __webpack_require__(16),
		Graph: __webpack_require__(17),
		GraphShader: __webpack_require__(19),
		Uniform: __webpack_require__(7),
		Varying: __webpack_require__(12)

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

	Node.prototype._numberToGLSL = function(n){
		return (n+'').indexOf('.') === -1 ? n+'.0' : n+'';
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

	FragColorNode.prototype.getInputVarNames = function(key){
		if(key === 'rgba' && this.inputPortIsConnected(key)){
			// Get the ID of the node connected
			var connectedNode = this.graph.getNodeConnectedToInputPort(this, key);
			if(connectedNode){
				return  ['rgba' + connectedNode.id];
			}
		}
		return [];
	};

	FragColorNode.prototype.buildShader = function(){
		return function(){
			this.graph.sortNodes();
			var input = (this.getInputVarNames('rgba')[0] || 'vec4(1)');
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
	var Uniform = __webpack_require__(7);

	module.exports = Vector4Node;

	// A vector with four components/values.
	function Vector4Node(options){
		options = options || {};
		Node.call(this, options);
		this.defaultValue = options.defaultValue ? options.defaultValue.slice(0) : [0,0,0,0];
	}
	Vector4Node.prototype = Object.create(Node.prototype);
	Vector4Node.prototype.constructor = Vector4Node;

	Node.registerClass('vec4', Vector4Node);

	Vector4Node.prototype.getInputPorts = function(){
		return ['r', 'g', 'b', 'a'];
	};

	Vector4Node.prototype.getOutputPorts = function(){
		return ['rgba'];
	};

	Vector4Node.prototype.getInputTypes = function(key){
		var types;
		switch(key){
		case 'r': types = ['float']; break;
		case 'g': types = ['float']; break;
		case 'b': types = ['float']; break;
		case 'a': types = ['float']; break;
		}
		return types;
	};

	Vector4Node.prototype.getOutputTypes = function(key){
		return key === 'rgba' ? ['vec4'] : [];
	};

	Vector4Node.prototype.getOutputVarNames = function(key){
		return key === 'rgba' ? ['rgba' + this.id] : [];
	};

	Vector4Node.prototype.render = function(){
		var r = this.getInputVariableName('r') || "0";
		var g = this.getInputVariableName('g') || "0";
		var b = this.getInputVariableName('b') || "0";
		var a = this.getInputVariableName('a') || "1";
		var outVarName = this.getOutputVariableNames('rgba')[0];
		return outVarName ? outVarName + ' = vec4(' + r + ',' + g + ',' + b + ',' + a + ');' : '';
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);

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
		return outVarName ? outVarName + ' = ' + this._numberToGLSL(this.value) + ';' : '';
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);
	var Attribute = __webpack_require__(11);
	var Varying = __webpack_require__(12);

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
/* 11 */
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
/* 12 */
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
/* 13 */
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

	TimeNode.prototype.getOutputVarNames = function(key){
		return key === 'time' ? ['time' + this.id] : [];
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
		var outVarName = this.getOutputVarNames('time')[0];
		if(outVarName){
			return outVarName + ' = ' + this.getUniforms()[0].name + ';';
		} else {
			return '';
		}
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

	module.exports = SineNode;

	// Adds a vec4 uniform to the shader.
	function SineNode(options){
		options = options || {};
		Node.call(this, options);
	}
	SineNode.prototype = Object.create(Node.prototype);
	SineNode.prototype.constructor = SineNode;

	Node.registerClass('sine', SineNode);

	SineNode.prototype.getInputPorts = function(key){
		return ['x'];
	};

	SineNode.prototype.getOutputPorts = function(key){
		return ['y'];
	};

	SineNode.prototype.getOutputTypes = function(key){
		return key === 'y' ? ['float'] : [];
	};

	SineNode.prototype.getInputTypes = function(key){
		return key === 'x' ? ['float'] : [];
	};

	SineNode.prototype.render = function(){
		var outVarName = this.getOutputVariableNames('y')[0];
		var inVarName = this.getInputVariableName('x');
		if(outVarName && inVarName){
			return outVarName + ' = sin(' + inVarName + ');';
		} else if(outVarName){
			return outVarName + ' = 0.0;';
		} else {
			return '';
		}
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);

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


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Graph = __webpack_require__(17);
	var FragColorNode = __webpack_require__(3);

	module.exports = FragmentGraph;

	function FragmentGraph(options){
		options = options || {};
		options.mainNode = options.mainNode || new FragColorNode();
		Graph.call(this, options);
	}
	FragmentGraph.prototype = Object.create(Graph.prototype);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var toposort = __webpack_require__(18);

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
				shaderSource.push('{', nodeSource, '}');
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
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var FragmentGraph = __webpack_require__(16);
	var VertexGraph = __webpack_require__(20);

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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var PositionNode = __webpack_require__(4);
	var Graph = __webpack_require__(17);
	var Uniform = __webpack_require__(7);
	var Attribute = __webpack_require__(11);

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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var Uniform = __webpack_require__(7);
	var Attribute = __webpack_require__(11);
	var Varying = __webpack_require__(12);

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

	TextureNode.prototype.getOutputVariableNames = function(key){
		return key === 'rgba' && this.outputPortIsConnected(key) ? ['rgba' + this.id] : [];
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


/***/ }
/******/ ]);