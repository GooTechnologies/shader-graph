module.exports = Connection;

function Connection(options){
	options = options || {};

	this.fromNode = options.fromNode || null;
	this.fromPortKey = options.fromPortKey || null;
	this.toNode = options.toNode || null;
	this.toPortKey = options.toPortKey || null;
}