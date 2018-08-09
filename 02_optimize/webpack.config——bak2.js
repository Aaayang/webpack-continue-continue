const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HappyPack = require('happypack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: 'happypack/loader?id=babel'
                }]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'happypack/loader?id=css'
                }]
            }
        ]
    },
    plugins: [
        new DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dist/react.manifest.json')
        }),
        new HappyPack({
            id: 'babel',
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'stage-0', 'react'],
                    plugins: ['transform-decorators-legacy']
                }
            }]
        }),
        new HappyPack({
            id: 'css',
            use: ['style-loader', 'css-loader'],
            threads: 3, // 代表开启几个子进程去处理
            verbose: true // 是否允许输出日志
        })
    ]
};