const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HappyPack = require('happypack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        // 编译 es6, es7, react
                        presets: ['env', 'stage-0', 'react'],
                        plugins: ['transform-decorators-legacy']
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },
    plugins: [
        new DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dist/react.manifest.json')
        })
    ]
};