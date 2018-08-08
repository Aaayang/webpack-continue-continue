# webpack-continue-continue

## 命令

- npx webpack --mode development，npx 会去找 node_modules 下的 webpack

- webpack-dev-server --mode development

## loader

- style-loader css-loader

- file-loader url-loader

- html-withimg-loader 在 HTML 中使用图片

- less/less-loader

- node-sass/sass-loader

- postcss-loader/autoprefixer，加前缀

## 编译 ES6, ES7, React 的 loader 和 包

cnpm i babel-core babel-loader babel-preset-env babel-preset-stage-0 babel-preset-react babel-plugin-transform-decorators-legacy -D

## 插件

- html-webpack-plugin 插件，会自动引入 bundle.js

- mini-css-extract-plugin 分离 css

配置 Plugin 并替换掉 style-loader


## 优化相关插件

- uglifyjs-webpack-plugin，压缩 JS

- optimize-css-assets-webpack-plugin，压缩 CSS

## 调试打包后的代码

通过配置 webpack 可以自动生成 source maps 文件

生产环境是没有 build 是没有 sourcemap 的

开发模式才有：npx webpack --mode development 

## 全局使用第三方类库

new webpack.ProvidePlugin({}) 这样是在各个 JS 模块中可以直接使用

let $ = require('expose-loader?jQuery!jquery'); 真全局

## 想用库，不想被打包

配置 externals

首先全局已经引用 CDN 了

```
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.js"></script>
```

```
// 这里不需要在打包了
// 这里不引用也可以使用 $，之所以又引用是为了解决语法报错
import $ from 'jquery';
console.log($);
```

```
// 配置
externals: {
    // 这个模块是外部提供的，不需要打包，jQuery 来自 window.jQuery
    jquery: 'jQuery'
},
```

## 监控

npx webpack --mode development 编译完就断开了，默认 watch: false

```
watch: true,
watchOptions: {
    ignored: /node_modules/,
    poll: 1000,
    aggregateTimeout: 500
}
```

用 webpack-dev-server 其实对上面已经处理了

## 商标

```
new webpack.BannerPlugin('weixian')
```

## 拷贝静态文件（文档，设计稿）

copy-webpack-plugin

```
new CopyWebpackPlugin([{
    from: path.resolve(__dirname, 'src/assets'),
    to: path.resolve(__dirname, 'dist/assets')
}])
```

## 打包前先清空输出目录

clean-webpack-plugin

```
new CleanWebpackPlugin([path.resolve(__dirname, 'dist')])
```

## 服务器代理

```
/users => http://localhost:3000
```

```
proxy: {
    // 请求的 http://localhost:8080/api 开头的会被代理到 http://localhost:3000
    "/api": "http://localhost:3000"
}
```

```
proxy: {
    "/api": {
        // 路径的重命名
        // http://localhost:8080/api/users
        // http://localhost:3000/users
        target: "http://localhost:3000",
        pathRewrite: {
            "^/api": ""
        }
    }
}
```

// 实现简单的数据 Mock
```
before(app) {
    app.get('/api/users', (req, res)=> {
        res.send({
            user: 'wx',
            age: 18
        });
    });
}
```

## Express 中集成 webpack

express 中集成 webpack，好处是方便利用 express，例如 mock 服务，代理 API 等

```
webpack-dev-middleware
```

## resolve 解析

指定 extension 之后可以不用在 require 或是 import 的时候加文件扩展名，会依次寻找

```
resolve: {
    extensions: ['.js', '.jsx', '.json', '.css']
}
```

## alias

配置别名可以加快 webpack 查找模块的速度

```
// 查找慢，容易出错
import 'bootstrap/dist/css/bootstrap.min.css';
```

```
// 解决
const bootstrapPath = path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css');

resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
    alias: {
        bootstrap: bootstrapPath
    }
}
```

## mainFields

默认情况下 package.json 文件按照文件中 main 字段的文件名来查找文件，其实是否先找 main 是可以配置的

## resolveLoader

解析 loader 时相关的配置

## noParse

配置不需要解析的模块

例如 jQuery, Lodash等现成的库，例如转ES5，它也不是个模块，加快编译速度

使用 noParse 忽略的模块不能再使用 import、require、define 等导入机制

## DefinePlugin

定义一些可以在模块中使用的全局变量

## IgnorePlugin

忽略不希望打包的模块，例如 moment

## 区分环境变量

 



