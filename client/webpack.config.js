var path = require("path");

module.exports = {
    context: __dirname,
    entry: "./src/index.jsx",

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel?presets[]=react&presets[]=es2015"]
        }, {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }]
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    output: {
        filename: "index.js",
        path: __dirname + "/build",
        publicPath: "/build/"
    }
};