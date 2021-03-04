const config = require('./config');

module.exports = {
    origin: function (origin, callback) {
        if (config.whitelist.indexOf(origin) !== -1 || !origin) {
            console.log('allowed')
            callback(null, true)
        } else {
            callback(new Error(`Not allowed ${origin} by CORS`))
        }
    }
}