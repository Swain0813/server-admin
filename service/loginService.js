/**
 * Created by Administrator on 2017/9/19.
 */
// var redis = require('../repository/ioredis');
var co = require('co');
var logger = require('../logger').logger('logInfo', 'info');
var account = require('../config/application').account;

module.exports = {
    checkLogin: function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (req.body.username == account.username && req.body.password == account.password) {
            var user = {'username': 'admin'};
            req.session.user = user;
            return true;
        }
        return false;
    }
};