const express = require('express');
const User = require('../models/user');     // model
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');       // 用于验证

const router = express.Router();

require('../passport')(passport);

// 注册账户
/**
 * body = {
 *     name: abc
 *     password: abc123
 * }
 */
router.post('/signup', (req, res) => {
    if (!req.body.name || !req.body.password) {
        res.json({success: false, message: 'Please enter your username and password.'});
    } else {
        let newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        // 保存用户账号
        newUser.save((err) => {
            if (err) {
                return res.json({success: false, message: err.message});
            }
            res.json({success: true, message: 'Created successfully!'});
        });
    }
});

// 检查用户名与密码并生成一个accesstoken如果验证通过
/**
 * body = {
 *     name: abc
 *     password: abc123
 * }
 */
router.post('/user/accesstoken', (req, res) => {
    User.findOne({
        name: req.body.name
    }, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            res.json({success: false, message:'Failed verification, this user not exist!'});
        } else if(user) {
            // 检查密码是否正确
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    let token = jwt.sign({name: user.name}, config.secret,{
                        expiresIn: 10080 // token 过期销毁时间设置
                    });
                    user.token = token;
                    user.save(function(err){
                        if (err) {
                            res.send(err);
                        }
                    });
                    res.json({
                        success: true,
                        message: 'Verified successfully!',
                        token: 'Bearer ' + token,
                        name: user.name
                    });
                } else {
                    res.send({success: false, message: 'Failed verification, wrong password!'});
                }
            });
        }
    });
});

// passport-http-bearer token 中间件验证
/**
 * 通过 header 发送 Authorization : "Bearer " + token
 * 或者通过 api_url + ?access_token = token
 * 或者body = { access_token : token }
 * */
router.get('/user/user_info',
    passport.authenticate('bearer', { session: false }),    // 中间件，在默认情况下，认证失败后 Passport 会返回 401 Unauthorized 状态的响应，其后面的处理函数也不会被触发。
                                                                            // 当然认证成功后，处理函数被触发
    function(req, res) {    //处理函数
        res.json({username: req.user.name});
    });

module.exports = router;