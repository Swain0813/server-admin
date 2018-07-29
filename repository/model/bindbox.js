/**
 * 多屏互动客户端绑定关系数据模型
 *
 * Created by Administrator on 2017/9/19.
 */
var mongoose = require('./../mongodb');
Schema = mongoose.Schema;

var BindboxSchema = new Schema({
    /**
     * 多屏互动设备id
     */
    mscid: {type: String},
    /**
     * 报备的应用id,可以做校验
     */
    appid: {type: String},
    /**
     *  客户端类型，0:主屏,1:从屏
     */
    type: {type: Number},
    /**
     * 多屏互动客户端昵称
     */
    mscid_name: {type: String},
    /**
     * 已绑定的客户端列表，其中从屏客户端列表最多只有一个主屏客户端，主屏客户端列表可以有多个从屏客户端
     *
     */
    binds: {type: Array}//备绑定的对端设备,1个盒子可以绑多个手机,1个手机同时只能连接1个盒子
});

module.exports = mongoose.model('Bindbox', BindboxSchema);