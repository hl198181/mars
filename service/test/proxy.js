/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var service = require("../");
var should = require("should");
var proxy = service.Proxy();
var debug = require("debug")("mars-service-test")

describe("Service", function () {
    /**
     * 测试注册代理策略
     */
    it("proxy.use()", function () {
        proxy.use("Y9", service.ProxyY9({
            token: "8fc50dd14a951318ca168e40a9fa1ec78d1110e058700c9affdbe6ab5eb6b931",
            baseurl: "http://120.24.84.201:10080/ws-biz/service/action.yun9",
            header: {}
        })).use("Y91", service.ProxyY9({
            token: "2",
            baseurl: "11"
        }));

        var strategy = proxy._strategy("Y91");

        should(strategy._token).equal("2");

    });

    /**
     * 注册动作
     */
    it("proxy.action()", function () {
        proxy.action("queryOrderList", {
            proxy: "Y91",
            action: "com.yun9.ws.biz.service.QueryOrdersByStateService",
            params: {
                "demo": "123456."
            },
            header: {
                instid: "1111"
            }
        });

        proxy._actions["queryOrderList"].should.be.not.NaN;
    })

    /**
     * 获取代理策略处理器
     */
    it("proxy.handler()", function () {
        var handler = proxy.handler("Y9", {
            action: "com.yun9.ws.biz.service.QueryProductInfoByIdService"
        });

        handler.should.not.be.NaN;
    });

    /**
     * 代理策略处理器添加参数
     */
    it("proxy.handler().params()", function () {
        var handler = proxy.handler("Y9", {
            action: "com.yun9.ws.biz.service.QueryProductInfoByIdService"
        }).params({
            demo1: "1",
            demo2: [1, 2, 3]
        });
        handler._params["demo2"].should.have.length(3);
    });

    /**
     * 代理策略处理器执行,由于单元测试是在浏览器进行，无法进行跨域操作。无法进行测试
     */
    it("proxy.handler().params().launch()", function (done) {
        debug("开始测试launch");

        proxy.handler("Y9", {
            action: "com.yun9.ws.biz.service.QueryProductInfoByIdService"
        }).params({
            "productid": "10000001447014"
        }).launch(function (res) {
            //成功
            debug("成功");
            res.body.code.should.equal("100");
        }, function (error) {
            //失败
            debug("失败");
        }, function () {
            //总是执行
            debug("总是执行");
            done();
        });
    });

    it("proxy.post().params.launch()", function (done) {
        proxy.post("queryOrderList")
            .params({
                "instid": "10000001468002",
                "userid": "10000001498059"
            })
            .header({
                "user": "abc"
            })
            .launch(function (res) {
                debug("执行成功!");
            }, function (error, res) {
                debug("执行失败!");
            }, function () {
                debug("总是执行.");
                done();
            });
    })
});