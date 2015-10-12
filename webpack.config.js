var webpack = require("webpack");

module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname + '/build',
        filename: "shadergraph.js"
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ],
    module: {
        loaders: [
            //{ test: /\.css$/, loader: "style!css" }
        ]
    }
};