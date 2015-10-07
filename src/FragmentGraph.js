var Graph = require('./Graph');
var FragColorNode = require('./FragColorNode');

module.exports = FragmentGraph;

function FragmentGraph(options){
	options.mainNode = new FragColorNode();
	Graph.call(this, options);
}
FragmentGraph.prototype = Object.create(Graph.prototype);