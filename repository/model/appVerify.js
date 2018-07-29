/**
 * 认证信息模型
 *
 * Created by Administrator on 2017/9/29.
 */
var mongoose = require('./../mongodb');
Schema = mongoose.Schema;

var AppSchema = new Schema({
    /**
     * 应用id，相同应用不同类型设备，id唯一
     */
    appId: {type: String},
    /**
     * 应用名称，例如：咪咕视频-Android、咪咕视频-IOS、咪咕视频-TV
     */
    name: {type: String},
    /**
     * 应用key
     */
    appkey: {type: String},
    /**
     * 包名
     */
    packageName: {type: String},
    /**
     * 签名
     */
    signkey: {type: String},
    /**
     * 是否校验
     */
    legalCheck: {type: Boolean}
});

module.exports = mongoose.model('AppSchema', AppSchema);