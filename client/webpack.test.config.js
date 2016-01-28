var config = require("./webpack.config");

module.exports = Object.assign(config, {
    module: Object.assign(config.module, {
        loaders: config.module.loaders.map(function(loader) {
            // Replace the SASS loader with null loader
            if(loader.test.toString().match(/css/)) {
                return {
                    test: loader.test,
                    loaders: ["null-loader"]
                }
            } else return loader;
        })
    }),

    output: null,
    entry: null
});