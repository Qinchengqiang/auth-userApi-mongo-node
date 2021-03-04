// const cors = require('cors');   // 跨域设置
// const corsOptions = require('../cors'); // white list

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send('hello index!');
    });

    app.use('/api', require('./users')); // 在所有users路由前加/api
};