const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const mock = require('./mock');

const bootstrapPath = path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css');

// env 环境变量
// argv 命令行参数对象
module.exports = (env,argv) => ({
    // 优化相关的
    optimization: {
        minimizer: argv.mode === 'production' ? [
            new UglifyjsWebpackPlugin(), // 压缩 JS
            new OptimizeCssAssetsWebpackPlugin() // 压缩 CSS
        ] : []
    },
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/' // 生成的文件都变成绝对路径 /
        // publicPath: 'http://img.baidu.com' // 生成的文件都变成绝对路径 /
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css'],
        alias: {
            // bootstrap: bootstrapPath
        },
        // 先找模块中的 index.js 再找 root
        mainFiles: ['index', 'root'],
        // 现在 package.json 中的 style，再找 main，那上面 bootstrap alias 就不用配了
        mainFields: ['style', 'main'],
        modules: [
            // 不要东奔西走了，都去 node_modules 下找
            path.resolve('node_modules'),
            // 找不到来这也看一下，再找不到就算啦
            // path.resolve('src/loaders')
        ],
        // 寻找 loader 的配置
        // resolveLoader: {
        //     modules: [
        //         path.resolve('node_modules'),
        //         path.resolve('src/loaders')
        //     ]
        // }
    },
    watch: false, // 默认false
    watchOptions: {
        ignored: /node_modules/,
        poll: 1000,
        aggregateTimeout: 500
    },
    // 服务
    devServer: {
        // 静态文件根目录
        contentBase: './dist',
        port: 8080,
        host: 'localhost',
        /* proxy: {
            // 请求的 8080/api 会被代理到 http://localhost:3000
            // "/api": "http://localhost:3000"
            "/api": {
                // 路径的重命名
                // http://localhost:8080/api/users
                // http://localhost:3000/users
                target: "http://localhost:3000",
                pathRewrite: {
                    "^/api": ""
                }
            }
        } */
        // webpack-dev-server 内部用的也是 express
        before(app) {
            mock(app);
        }
    },
    // devtool: 'source-map', // 在单独文件中生成 sourcemap，可以映射到列
    // devtool: 'cheap-module-source-map', // 在单独文件中生成，不能映射到列
    devtool: 'eval-source-map', // 在同一文件中生成，可以映射到列
    // devtool: 'cheap-module-eval-source-map', // 在同一文件中生成，不能映射到列
    externals: {
        // 这个模块是外部提供的，不需要打包，jQuery 来自 window.jQuery
        jquery: 'jQuery'
    },
    // loader
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        // 编译 es6, es7, react
                        presets: ['env', 'stage-0', 'react']
                    }
                }],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/ // 排除，优化，node_modules 是编译过的
            },
            // css
            {
                test: /\.css$/,
                use: [{
                    // 负责收集所有的 css 文件
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader', 'postcss-loader'],
                // exclude: /node_modules/, // 比如 bootsrap 要使用
                // include: path.resolve(__dirname, 'src')
            },
            // scss
            {
                test: /\.scss$/,
                use: [{
                    // 负责收集所有的 css 文件
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader', 'sass-loader'],
                // exclude: /node_modules/,
                // include: path.resolve(__dirname, 'src')
            },
            // less
            {
                test: /\.less$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader', 'less-loader'],
                // exclude: /node_modules/,
                // include: path.resolve(__dirname, 'src')
            },
            // img
            {
                test: /\.(gif|jpg|jpeg|png|bmp|eot|woff|woff2|ttf|svg)$/,
                use: [
                    {
                        // url-loader 里面封装了 file-loader
                        loader: 'url-loader',
                        options: {
                            limit: 2, // 2 * 1024 => 2kb
                            outputPath: 'images', // 输出路径
                            // 解决 CSS 中路径
                            publicPath: '/images' // 构建后在 html 中的路径
                        }
                    }
                ]
            },
            // in html use img
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            }
        ]
    },
    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                // 删除属性的双引号，通过审查元素查看
                removeAttributeQuotes: true
            },
            // 加 hash 避免缓存
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new webpack.ProvidePlugin({
            "_": 'lodash'
        }),
        new webpack.BannerPlugin('weixian'),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/assets'),
            to: path.resolve(__dirname, 'dist/assets')
        }]),
        new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
        // 定义一些可以在模块中使用的全局变量
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false), // 是否生成环境
            VERSION: "1+1",
            INFO: {
                NAME: JSON.stringify("XXX")
            }
        }),
        // moment 有一堆语言包，非常大
        new webpack.IgnorePlugin(/^\.\/locale/,/moment$/)
    ]
});