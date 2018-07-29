/**
 * Created by Administrator on 2017/9/20.
 */
var Redis = require('ioredis');
var connections = require('../config/connections');//redis配置文件
var logger = require('../logger').logger('logInfo', 'info');

// var redis = new Redis.Cluster([connections.connections.someRedisServer]);//集群模式
var redis = new Redis(connections.connections.someRedisServer);//单机模式


redis.on("connect", function () {
    logger.info("ioredis connect to " + connections.connections.someRedisServer.host + ":" + connections.connections.someRedisServer.port);
});

redis.on("error", function (err) {
    logger.error("ioredis connect " + err);
});

redis.on("end", function () {
    logger.error("ioredis connect end ");
});




module.exports = redis;