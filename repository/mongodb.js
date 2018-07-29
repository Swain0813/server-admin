/**
 * Created by Administrator on 2017/9/18.
 */
const mongoose = require('mongoose');
const connections = require('./../config/connections').connections;
var logger = require('../logger').logger('logInfo', 'info');
/**
 * 连接
 */
mongoose.Promise = global.Promise;
mongoose.connect(connections.mongo_url, {useMongoClient: true});

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
    logger.info('Mongoose connection to ' + connections.mongo_url);
});

/**
 * 连接异常
 */
mongoose.connection.on('error', function (err) {
    logger.error('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    logger.error('Mongoose connection disconnected');
});

module.exports = mongoose;
