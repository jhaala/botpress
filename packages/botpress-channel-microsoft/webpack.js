const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const pkg = require('./package.json');
const configMode = process.env.NODE_ENV === 'production' || 'development';

const nodeConfig = {
    mode: configMode,
    devtool:   'source-map',
    entry:     ['./src/index.js'],
    output:    {
        path:          path.resolve(__dirname, './bin'),
        filename:      'node.bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals(), 'botpress'],
    target:    'node',
    resolve:   {
        extensions: ['.js']
    },
    module:    {
        rules: [
            {
                test:    /\.js$/,
                loader:  'babel-loader',
                exclude: /node_modules/,
                options:   {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-transform-async-to-generator'
                    ]
                }
            },
            {
                test:   /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
}

const webConfig = {
    mode: configMode,
    devtool:   'source-map',
    entry:     ['./src/views/index.jsx'],
    output:    {
        path:          path.resolve(__dirname, './bin'),
        publicPath:    '/js/modules/',
        filename:      'web.bundle.js',
        libraryTarget: 'assign',
        library:       ['botpress', pkg.name]
    },
    resolve:   {
        extensions: ['.js', '.jsx']
    },
    externals: {
        react:       'React',
        'react-dom': 'ReactDOM'
    },
    module:    {
        rules: [
            {
                test:    /\.jsx?$/,
                loader:  'babel-loader',
                exclude: /node_modules/,
                options:   {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: [
                        '@babel/plugin-proposal-object-rest-spread',
                        ['@babel/plugin-proposal-decorators', {'legacy': true}]
                    ]
                }
            },
            {
                test:    /\.scss$/,
                loaders: [
                    'style',
                    'css?modules&importLoaders=1&localIdentName=' + pkg.name + '__[name]__[local]___[hash:base64:5]',
                    'sass'
                ]
            },
            {
                test:    /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test:   /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                loader: 'file?name=../fonts/[name].[ext]'
            },
            {
                test:   /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
}

const compiler = webpack([nodeConfig, webConfig])
const postProcess = function(err, stats) {
    if (err) {
        throw err
    }
    console.log(stats.toString('minimal'))
}

if (process.argv.indexOf('--compile') !== -1) {
    compiler.run(postProcess)
} else if (process.argv.indexOf('--watch') !== -1) {
    compiler.watch(null, postProcess)
}

module.exports = {
    web:  webConfig,
    node: nodeConfig
}
