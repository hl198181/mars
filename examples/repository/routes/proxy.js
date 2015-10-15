/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var express = require("express");
var service = require("../../../lib/service");
var proxy = service.Proxy();
var debug = require("debug")("mars-proxy");

var router = express.Router();

router.get("/demo", function (req, res, next) {
    res.send("Demo!");
});

router.get("/send", function (req, res, next) {
    debug("访问/send");
    proxy("Y9", {
        action: "com.yun9.ws.biz.service.QueryProductInfoByIdService"
    }).params({
        "productid": "10000001447014"
    }).launch(function (result) {
        debug("执行成功！");
        res.send(result.body);
    }, function (err, result) {
        debug("执行失败！")
        res.send(err.message);
    }, function () {
        //总是执行
        debug("执行完成");
    });


});


module.exports = function () {

    proxy.use(service.ProxyY9({
        token: "8fc50dd14a951318ca168e40a9fa1ec78d1110e058700c9affdbe6ab5eb6b931",
        baseurl: "http://120.24.84.201:10080/ws-biz/service/action.yun9",
        header: {}
    }));


    return router;
};