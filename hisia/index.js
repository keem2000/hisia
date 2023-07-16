const app = require('./server/server');
require('dotenv').config();


module.exports = (req, res) => {
    app(req, res);
};