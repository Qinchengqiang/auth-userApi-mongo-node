const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;

const User = require('./models/user');
// const config = require('./config');

module.exports = function() {
    // passport 验证函数架构
    passport.use(new Strategy(
        function(token, done) { // 传入参数 token
            User.findOne({  // 从数据库的User集合中查询token
                token: token
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
};