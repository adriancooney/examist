var path = require("path"),
    webpack = require("webpack");

module.exports = {
    context: __dirname,
    entry: "./src/index.jsx",

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel"]
        }, {
            test: /\.jsx?$/,
            loader: "eslint-loader", 
            exclude: /node_modules/
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
    },

    plugins: [
        new webpack.DefinePlugin({
            "__DEV__": true
        })
    ]
};