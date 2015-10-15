/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var service = require("../lib/service");
var proxy = service.Proxy();

describe("Service", function () {

    it("service()", function () {
        expect(typeof service.Proxy, "function");
    });

    /**
     * 测试创建代理对象实例
     */
    it("service.Proxy()", function () {
        expect(typeof service.Proxy(), "function");
    });

    /**
     * 测试注册代理策略
     */

    it("service.Proxy().use()", function () {
        proxy.use("Y9", service.ProxyY9({
            token: "8fc50dd14a951318ca168e40a9fa1ec78d1110e058700c9affdbe6ab5eb6b931",
            baseurl: "http://120.24.84.201:10080/ws-biz/service/action.yun9",
            header: {}
        })).use("Y91", service.ProxyY9({
            token: "2",
            baseurl: "11"
        }));

        expect(proxy._strategy("Y9")).toBeDefined();
    });

    /**
     * 获取代理策略处理器
     */
    it("service.Proxy()()", function () {
        var handler = proxy("Y9", {
            action: "com.yun9.ws.biz.service.QueryProductInfoByIdService"
        });

        expect(handler).toBeDefined();
    });

    /**
     * 代理策略处理器添加参数
     */
    it("service.Proxy()().params()", function () {
        var handler = proxy("Y9", {
            action: "com.yun9.ws.biz.service.QueryProductInfoByIdService"
        }).params({
            demo1: "1",
            demo2: [1, 2, 3]
        });

        expect(handler._params["demo2"].length).toEqual(3);
    });

    /**
     * 代理策略处理器执行,由于单元测试是在浏览器进行，无法进行跨域操作。无法进行测试
     */

    //it("service.Proxy()().launch()", function () {
    //    proxy("Y9", {
    //        action: "com.yun9.ws.biz.service.QueryProductInfoByIdService"
    //    }).params({
    //        "productid": "10000001447014"
    //    }).launch(function (handler) {
    //        //成功
    //        expect(1).toEqual(1);
    //    }, function (error) {
    //        //失败
    //        expect(1).toEqual(1);
    //    }, function () {
    //        //总是执行
    //        expect(1).toEqual(1);
    //    });
    //});
});