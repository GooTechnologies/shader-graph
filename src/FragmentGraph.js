var Graph = require('./Graph');
var FragColorNode = require('./FragColorNode');

module.exports = FragmentGraph;

function FragmentGraph(options){
	Graph.call(this, options);

	this.fragColorNode = new FragColorNode(); // TODO should this be called mainNode?
	this.addNode(this.fragColorNode);
}
FragmentGraph.prototype = Object.create(Graph.prototype);