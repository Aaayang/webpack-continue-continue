// express 虽然 package.json 中没有，webpack-dev-server 已经依赖了 ...
let express = require('express');
let morgan = require('morgan');
let app = express();

// 中间件
app.use(morgan('dev'));

app.get('/api/users', (req, res) => {
    res.send(req.url);
});

app.get('/users', (req, res) => {
    res.send(req.url);
});


app.listen(3000);