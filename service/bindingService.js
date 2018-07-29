/**
 * Created by Administrator on 2017/9/19.
 */
var co = require('co');
var Bindbox = require("./../repository/model/bindbox");
var userInfoService = require('./userInfoService');
var config = require('./../config/application');
var logger = require('../logger').logger('logInfo', 'info');

module.exports = {

    /**
     * 解除绑定
     *
     * @param body
     * @param response
     */
    unbind: function (body, response) {
        var result = {};
        // 参数校验
        var mscid_param = body.mscid;
        var un_mscid_param = body.un_mscid;
        if (!mscid_param || !un_mscid_param) {
            result['code'] = '0001';
            result['msg'] = 'get param error';
            response.json(result);
            return;
        }
        co(function *() {
            try {
                // 主动方解绑
                var wherestr = {mscid: mscid_param};
                var res = yield Bindbox.find(wherestr);
                if (res.length !== 0) {
                    var binds = res[0].binds;
                    deleteClientById(binds, un_mscid_param);
                    var updatestr = {binds: binds};
                    yield Bindbox.update(wherestr, updatestr);
                }

                var statu1 = yield userInfoService.getStatusById(mscid_param);
                if (statu1 > 2) {
                    var mscIp = yield userInfoService.getAddressById(mscid_param); //查询被主动方所在服务器ip
                    inform2Server(mscIp, mscid_param, un_mscid_param);
                }

                // 被动方解绑
                var wherestr2 = {mscid: un_mscid_param};
                var res2 = yield Bindbox.find(wherestr2);
                if (res2.length !== 0) {
                    var binds = res2[0].binds;
                    deleteClientById(binds, mscid_param);
                    var updatestr = {binds: binds};
                    yield Bindbox.update(wherestr2, updatestr);
                }

                var statu2 = yield userInfoService.getStatusById(un_mscid_param);
                if (statu2 > 2) {
                    var mscIp = yield userInfoService.getAddressById(un_mscid_param); //查询被动方所在服务器ip
                    inform2Server(mscIp, un_mscid_param, mscid_param);
                }
                result['code'] = '0000';
                result['msg'] = 'unbind success';
            } catch (e) {
                result['code'] = '4000';
                result['msg'] = 'unbind failed';
                logger.error(e);
            }
            response.json(result);
        });
    },

    /**
     * 获取绑定列表
     *
     * @param body
     * @param response
     */
    getBinds: function (body, response) {
        var result = {};
        // 参数校验
        var mscid_param = body.mscid;
        if (!mscid_param) {
            result['code'] = '0001';
            result['msg'] = 'get param error';
            response.json(result);
            return;
        }
        co(function *() {
            try {
                var wherestr = {mscid: mscid_param};
                var res = yield Bindbox.find(wherestr);
                if (typeof (res) != "undefined" && res.length != 0 && typeof (res[0].binds) !== "undefined" && res[0].binds.length != 0) {
                    var binds = res[0].binds;
                    // 1、删除列表中过期设备
                    var flag = false;
                    for (var i = 0; i < binds.length; i++) {
                        if (isExpiration(binds[i].last_online_time)) {
                            flag = true;
                            console.log("删除了一个超过30天都没有登录的设备：" + binds[i].mscid);
                            binds.splice(i, 1);
                            i--;
                        }
                    }
                    if (flag) {
                        var updatestr = {binds: binds};
                        yield Bindbox.update(wherestr, updatestr);
                    }
                    // 2、查询列表设备在线状态
                    for (var i = 0; i < binds.length; i++) {
                        var statu = yield userInfoService.getStatusById(binds[i].mscid);
                        binds[i]['online'] = statu == null ? 0 : statu;
                        binds[i].last_online_time = formatDate(new Date(binds[i].last_online_time));
                    }
                    result['count'] = binds.length;
                    result['binds'] = binds;
                } else {
                    result['count'] = 0;
                    result['binds'] = [];
                }
                result['code'] = '0000';
                result['msg'] = 'getBinds success';
            } catch (e) {
                result['code'] = '4000';
                result['msg'] = 'getBinds failed';
                logger.error(e);
            }
            response.json(result);
        });
    },

    /**
     * 获取绑定关系
     *
     * @param mscId
     */
    getBind: function (mscId) {
        var wherestr = {mscid: mscId};
        return function (callback) {
            Bindbox.find(wherestr, callback);
        }
    },

    /**
     * 获取所有设备列表
     * @param res
     * @param req
     */
    getAllBind: function (res, response) {
        var result = {};
        var type = res.type;
        if (!type) {
            result['code'] = '0001';
            result['msg'] = 'get param error';
            response.json(result);
            return;
        }
        try {
            co(function *() {
                var wherestr = {type: type};
                var res = yield Bindbox.find(wherestr);
                if (typeof (res) != "undefined" && res.length != 0) {
                    result['clients'] = res;
                    result['count'] = res.length;
                } else {
                    result['clients'] = null;
                    result['count'] = 0;
                }
                result['code'] = '0000';
            });
        } catch (e) {
            result['code'] = '4000';
            result['msg'] = 'getBinds failed';
            logger.error(e);
        }
        response.json(result);
    }

}


/**
 * 判断是否过期
 *
 * @param time
 * @returns {boolean}
 */
function isExpiration(time) {
    if (Date.parse(new Date()) / 1000 - time > 30 * 24 * 60 * 60) return true;
    return false;
}


/**
 * 格式化时间
 *
 * @param date
 * @returns {string}
 */
function formatDate(date) {
    if (date == null) {
        date = new date();
    }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var s = date.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
function add0(m) {
    return m < 10 ? '0' + m : m
}
