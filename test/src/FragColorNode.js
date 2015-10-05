var Node = require('./Node');

module.exports = FragColor;

function FragColor(options){
	options = options || {};
	Node.call(this, {
		name: 'FragColor',
		inputPorts: ['rgba']
	});
}
FragColor.prototype = Object.create(Node.prototype);
FragColor.constructor = FragColor;

FragColor.prototype.render = function(){
	return 'gl_FragColor = ' + this.getInputVarNames('rgba')[0] + ';';
};
