module.exports = Uniform;

function Uniform(options){
	options = options || {};

	this.type = options.type || 'float';
	this.name = options.name || 'uUntitled';
	this.defaultValue = options.defaultValue || 1;
}