# webpack 优化

## libray Target 和 library

当用 webpack 去构建一个可以被其他模块导入使用的库时需要用到它们

- output library Target 配置以何种方式导出库

- output libray 配置导出库的名称

```
// var
var weixian = xxx
```

```
<script src="bundle.js"></script>
<script>
console.log(weixian);
</script>
```

```
// commonjs
exports["weixian"] = xxx
```

```
// commonjs2
module.exports = xxx
```

```
// this
this["weixian"]
```

```
// window
window["weixian"]
```

```
// global
global["weixian"]
```

## DLL

DLL 文件是动态链接库，动态库中可以包含给其他模块调用的函数和数据

- 把基础模块独立出来打包到单独的动态链接库

- 当需要导入的模块在动态库里的时候，模块不能再次被打包，而是去动态库里获取

- dll-plugin

```
npx webpack --config react.webpack.config.js --mode development
```

## HappyPack

Webpack 是单线程的，CPU 处理慢

## CDN

内容分发网络，把资源部署到世界各地可以就近获取资源，从而加快速度

## Tree Shaking

剔除死代码

webpack4 production 模式默认就实现了

## 提取公共代码

common-chunk-and-vendor-chunk




