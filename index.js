const express = require('express');
const bodyParser = require('body-parser');// 解析body字段模块
const morgan = require('morgan'); // 命令行log显示
const passport = require('passport');// 用户认证模块passport
const Strategy = require('passport-http-bearer').Strategy;// token验证模块

import mongodb from 'mongodb';
import mongoose from 'mongoose';

const routes = require('./routes');
const config = require('./config');

const app = express();
let port = process.env.PORT || 8080;

app.use(passport.initialize());// 初始化passport模块
app.use(morgan('combined'))// 命令行中显示程序运行日志,便于bug调试
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // 调用bodyParser模块以便程序正确解析body传入值

routes(app); // 路由引入

// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true},function(err) {
    if (err) throw err;
}); // 连接数据库
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


app.listen(port, () => {
    console.log('listening on port : ' + port);
})


/**

 const MongoClient = mongodb.MongoClient;

 const dbURL = config.database

 // MongoClient.connect(url, callback) to connect to mongodb
 MongoClient.connect(dbURL, {useUnifiedTopology: true, useNewUrlParser: true}, function (err, client) {
    if (err) {
        throw err;
    } else {
        console.log("已连接!")
    }

    const db = client.db('authApi');      // 读取或创建 db : crud

    app.listen(port, () => {
        console.log('listening on port : ' + port);
    })
});

 */