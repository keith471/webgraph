//==============================================================================
// webpack configuration
//==============================================================================
var path = require('path');

var config = {
    entry: './src/content.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    /* Specify third party libraries here so they won't be added to the bundle (keep the bundle file as small as possible)
    externals: {
        "ramda": "R"
    },
    */
    module: {
        loaders: [
            {
                test: /\.js$/,
               loader: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map'
};

// so that the request module doesn't break webpack...
// see https://github.com/request/request/issues/1529
/*
config.node = {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
};
*/

module.exports = config;
