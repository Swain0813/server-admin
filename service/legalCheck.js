/**
 * Created by Administrator on 2017/10/11.
 */
var logger = require('../logger').logger('logInfo', 'info');
var crypto = require('crypto');

module.exports = {
//验证算法
    legalCheck: function (appVerify, appkey, time, mscId, secretkey) {
        var md5 = crypto.createHash('md5');
        console.log(appkey + " =================");
        try {
            if (appVerify[0].appkey == appkey) {
                console.log('secret_param:' + secretkey);
                var a = appkey + appVerify[0].packageName + appVerify[0].signkey + mscId + time;
                var b = (parseInt(time.substr(10, 1)) + parseInt(time.substr(11, 1)) + parseInt(time.substr(12, 1))) % 10;
                console.log(b);
                var c = a.substring(b);
                console.log(c);
                md5.update(c);
                var secret1 = md5.digest('hex').toUpperCase();
                console.log('secret_operation:' + secret1);
                if (secretkey == secret1) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }
}