/**
 * Created by Administrator on 2017/9/19.
 */
var redis = require('../repository/ioredis');
var co = require('co');
var logger = require('../logger').logger('logInfo', 'info');

module.exports = {
    //设置设备在线信息  1、2、3、4，分别表示盒子离线、手机离线、盒子在线、手机在线
    //通过mscId获取设备信息（是否在线 所在设备地址）
    getMscInfo: function (body, res) {
        var result = {};
        // 参数校验
        var mscid_param = body.mscId;
        if (!mscid_param) {
            result['code'] = '0001';
            result['msg'] = 'get param error';
            res.json(result);
            return;
        }
        co(function *() {
            try {
                var status = yield redis.zscore("userStatus", mscid_param);
                var address = yield redis.hget("userIp", mscid_param);
                result['code'] = '0000';
                result['msg'] = 'getMscInfo success';
                result['status'] = status;
                result['address'] = address;
            } catch (e) {
                result['code'] = '4000';
                result['msg'] = 'getMscInfo failed';
                logger.error(e);
            }
            res.json(result);
        })
    },
    /**
     * 改变设备状态
     */
    changeStatus: function (body, res) {
        var result = {};
        // 参数校验
        var mscid_param = body.mscId;
        if (!mscid_param) {
            result['code'] = '0001';
            result['msg'] = 'get param error';
            res.json(result);
            return;
        }
        co(function *() {
            try {
                var status = yield redis.zscore("userStatus", mscid_param);
                console.log(status);
                switch (status){
                    case "1":yield redis.zadd("userStatus",3,mscid_param);break;
                    case "2":yield redis.zadd("userStatus",4,mscid_param);break;
                    case "3":yield redis.zadd("userStatus",1,mscid_param);break;
                    case "4":yield redis.zadd("userStatus",2,mscid_param);break;
                    default:yield redis.zadd("userStatus",0,mscid_param);break
                }
                console.log( yield redis.zscore("userStatus", mscid_param));
                result['code'] = '0000';
                result['msg'] = 'changeStatus success';
            } catch (e) {
                result['code'] = '4000';
                result['msg'] = 'getMscInfo failed';
                logger.error(e);
            }
            res.json(result);
        })
    },
    //获取在线情况 (数量)
    getOnlineInfo: function (req, res) {
        var result = {};
        co(function *() {
            try {
                var data = {};
                var box_off = yield redis.zcount("userStatus", 1, 1);
                var box_on = yield redis.zcount("userStatus", 3, 3);
                var app_off = yield redis.zcount("userStatus", 2, 2);
                var app_on = yield redis.zcount("userStatus", 4, 4);
                data['box_on'] = box_on;
                data['box_off'] = box_off;
                data['app_on'] = app_on;
                data['app_off'] = app_off;
                result['code'] = '0000';
                result['msg'] = 'getOnlineInfo success';
                result['data'] = data;
            } catch (e) {
                result['code'] = '4000';
                result['msg'] = 'getOnlineInfo failed';
                logger.error(e);
            }
            res.json(result);
        });
    },

    //获取状态列表
    getStatuList: function (req, res) {
        var result = {};
        var page = req.query.page;
        var rows = req.query.rows;
        var mscId = req.query.mscId; //mscId
        var mscType = req.query.mscType; //1主屏 2从屏
        var status = req.query.status; //1在线 0离线
        console.log("mscId:" + mscId);
        console.log("mscType:" + mscType);
        console.log("status:" + status);
        var start = rows * (page - 1); //左边界
        var end = rows * page - 1; //右边界
        var userInfoes = [];
        co(function *() {
            try {
                var userStatus = yield redis.zrange("userStatus", start, end, "WITHSCORES");
                var count = yield redis.zcard("userStatus");
                var totalPage = parseInt(count / rows) + 1;
                for (var i = 0; i < userStatus.length / 2; i++) {
                    var userInfo = {};
                    userInfo["mscId"] = userStatus[i * 2];
                    userInfo["status"] = userStatus[i * 2 + 1];
                    var address = yield  redis.hget("userIp", userStatus[i * 2]);
                    userInfo["address"] = address;
                    userInfoes.push(userInfo);
                }
                result['code'] = '0000';
                result['msg'] = 'getStatuList success';
                result['data'] = userInfoes;
                result['count'] = count;
                result['totalPage'] = totalPage;
            } catch (e) {
                result['code'] = '4000';
                result['msg'] = 'getStatuList failed';
                result['data'] = userInfoes;
                result['count'] = 0;
                result['totalPage'] = 0;
                logger.error(e);
            }
            res.json(result);
        });
    },

    getAddressById: function (mscId) {
        return function (callback) {
            redis.hget("userIp", mscId, callback);
        };
    }
};