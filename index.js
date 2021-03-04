const express = require('express');
const bodyParser = require('body-parser');  // 解析body字段模块
const morgan = require('morgan');           // 命令行log显示
const passport = require('passport');       // 用户认证模块passport
const fs = require('fs');           //加了文件操作的模块
const path = require('path');       //加了解析路径的模块
const helmet = require('helmet');   // security
const {expressCspHeader, INLINE, NONE, SELF, NONCE} = require('express-csp-header');      // security
const cors = require('cors');   // 跨域设置, 用于api的中间件，在routes中使用
const corsOptions = require('./cors'); // use white list
import mongoose from 'mongoose';

const routes = require('./routes');
const config = require('./config');

const app = express();
let port = process.env.PORT || 8080;
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flag: 'a'});//创建一个写文件流，并且保存在当前文件夹的access.log文件中

/** 安全设置 */
app.use(helmet());
app.use(expressCspHeader({
    directives: {
        'default-src': [NONE],
        'script-src': [NONCE],
        'style-src': [NONCE],
        'img-src': [SELF],
        'font-src': [NONCE, 'fonts.gstatic.com'],
        'object-src': [NONE],
        'block-all-mixed-content': true
    }
}));
app.use(passport.initialize());// 初始化passport模块
// format 可选：dev, combined, tiny
// app.use(morgan('tiny', {stream: accessLogStream}));     // 保存程序运行日志
app.use(morgan('tiny'));     // 或者命令行中显示程序运行日志,便于bug调试
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());     // 调用bodyParser模块以便程序正确解析body传入值


/** 路由引入 */
app.use(cors(corsOptions));
routes(app);

// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) throw err;
}); // 连接数据库
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


app.listen(port, () => {
    console.log('listening on port : ' + port);
})
