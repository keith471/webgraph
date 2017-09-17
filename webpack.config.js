//==============================================================================
// webpack configuration
//==============================================================================
var path = require('path');

module.exports = {
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
