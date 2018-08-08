// express 虽然 package.json 中没有，webpack-dev-server 已经依赖了 ...
let express = require('express');
let morgan = require('morgan');
let app = express();
const webpack = require('webpack');

/**
 * 1、webpack 中集成了 express(webpack-dev-server)
 * 2、express 中集成 webpack
 */

const webpackDevMiddleware = require('webpack-dev-middleware');
app.use(morgan('dev'));

app.get('/api/users', (req, res) => {
    res.send(req.url);
});

const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler));

app.listen(3000);