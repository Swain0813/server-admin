/**
 * Created by Administrator on 2017/10/9.
 */
var co = require('co');
var AppSchema = require("./../repository/model/appVerify");
var logger = require('../logger').logger('logInfo', 'info');
module.exports = {

    /**
     * 获取应用校验规则对象
     *
     * @param appId
     */
    getAppVerify: function (appId) {
        var wherestr = {appId: appId};
        return function (callback) {
            AppSchema.find(wherestr, callback);
        }
    },

    /**
     * 添加校验APP
     *
     * @param body
     * @param response
     */
    addAppVerify: function (body, response) {
        var appId = body.appId;
        var name = body.name;
        var appkey = body.key;
        var packageName = body.packageName;
        var signkey = body.signkey;
        var legalCheck = body.legalCheck;

        co(function *() {
            console.info(body);
            var result = {};
            try {
                var wherestr = {appId: appId};
                var res = yield AppSchema.find(wherestr);
                if (res.length === 0) { // 不在列表中
                    // 1、新增主屏列表
                    var appSchema = new AppSchema({
                        appId: appId,
                        name: name,
                        appkey: appkey,
                        packageName: packageName,
                        signkey: signkey,
                        legalCheck: legalCheck
                    });
                    yield appSchema.save();
                } else {
                    var updatestr = {
                        name: name,
                        appkey: appkey,
                        packageName: packageName,
                        signkey: signkey,
                        legalCheck: legalCheck
                    };
                    yield AppSchema.update(wherestr, updatestr);
                }
                result['code'] = '0000';
                result['msg'] = 'add AppVerify success';
            } catch (e) {
                result['code'] = '4000';
                result['msg'] = 'add AppVerify failed';
                logger.error(e);
            }
            response.json(result);
        });
    }
}