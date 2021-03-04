const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String,
        unique: true, // 不可重复约束
        require: true // 不可为空约束
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String
    }
});
/**
 * 中间件也称为“前置”(pre)和“后置”(post)钩子，是在执行异步功能期间传递控制的函数。中间件在模式(Schema)级别指定
 * */
// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
UserSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {   // bcrypt加密
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) { // bcrypt hash加密
                if (err) {
                    return next(err);
                }
                user.password = hash;   // 更改 password 为加密后的密码
                next(); // 上一个中间件调用 next 函数的时候，下一个执行
            });
        });
    } else {
        return next();
    }
});

// 校验用户输入密码是否正确
UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);