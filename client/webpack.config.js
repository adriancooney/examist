var path = require("path"),
webpack = require("webpack");

// Plugins
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    context: __dirname,
    entry: ["./node_modules/regenerator/runtime.js", "./src/index.jsx"],

    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: [path.resolve(__dirname, "src/"), path.resolve(__dirname, "i18n/")],
            loaders: ["react-hot", "babel"]
        }, {
            test: /\.jsx?$/,
            include: [path.resolve(__dirname, "src/")],
            loader: "eslint" 
        }, {
            test: /\.scss$/,
            include: [path.resolve(__dirname, "style/")],
            loaders: ["style", "css", "sass"]
        },

        {test: /\.json$/, loader: "json" },
        {test: /\.(png|jpe?g|gif|svg)$/, loader: "file" },
        {test: /font\/.+\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file?mimetype=image/svg+xml"},
        {test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "file?mimetype=application/font-woff"},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file?mimetype=application/octet-stream"},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"}]
    },

    resolve: {
        extensions: ['', '.js', '.jsx'],
        fallback: path.join(__dirname, "node_modules")
    },

    resolveLoader: {
        fallback: path.join(__dirname, "node_modules")
    },

    output: {
        filename: "index.js",
        path: __dirname + "/build",
        publicPath: "/build/"
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": "\"" + (process.env.NODE_ENV || "development") + "\""
        }),

        new CopyWebpackPlugin([{
            from: "assets",
            to: "assets"
        }])
    ]
};