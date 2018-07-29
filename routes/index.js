var express = require('express');
var router = express.Router();

var bindingService = require("./../service/bindingService");
var verifyService = require("./../service/verifyService");
var userInfoService = require("./../service/userInfoService");
var loginService = require("./../service/loginService");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', function (req, res) {
    res.render('login', {msg: ''});
});

router.post('/login', function (req, res) {
    if (loginService.checkLogin(req, res)) {
        res.redirect('/');
    } else {
        res.render('login', {msg: '用户名或者密码错误！'});
    }
});
router.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/login');
});

router.get('/status', function (req, res, next) {
    res.render('status/status');
});

/**
 * 总体在线情况
 */
router.post('/getOnlineInfo', function (req, res, next) {
    userInfoService.getOnlineInfo(req, res);
});

/**
 * 总体在线情况
 */
router.all('/getStatuList', function (req, res, next) {
    userInfoService.getStatuList(req, res);
});

/**
 * 获取设备所在ip
 */
router.post('/getAddressById', function (req, res, next) {
    userInfoService.getAddressById(req.body, res);
});

/**
 * 获取设备信息（是否在线 所在设备地址）
 */
router.post('/getMscInfo', function (req, res, next) {
    userInfoService.getMscInfo(req.body, res);
});

/**
 * 改变设备在线状态
 */
router.post('/changeStatus', function (req, res, next) {
    userInfoService.changeStatus(req.body, res);
});

/**
 * 解除绑定
 */
router.post('/unbind', function (req, res) {
    bindingService.unbind(req.body, res);
});

/**
 * 获取所有设备列表
 */
router.post('/getAllBind', function (req, res) {
    bindingService.getAllBind(req, res);
});

module.exports = router;
