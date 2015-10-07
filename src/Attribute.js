module.exports = Attribute;

function Attribute(options){
	options = options || {};

	this.type = options.type || 'float';
	this.name = options.name || 'aUntitled';
	this.defaultValue = options.defaultValue || 'POSITION';
}