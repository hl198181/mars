/**
 * Created by leon on 16/2/22.
 */

var service = require("../../");
var should = require("should");
var proxy = service.Proxy();
var debug = require("debug")("mars-service-bb8-test");

describe("Service", function () {
    /**
     * 测试注册代理策略
     */
    it("proxyBb8.use()", function () {
        proxy.use("BB8", service.ProxyBB8({
            AppID: "kermit",
            AppSecret: "kermit",
            baseurl: "http://www.yun9.com:8080/bb8-rest/service",
            header: {}
        }));
    });

    /**
     * 注册动作
     */
    it("proxyBb8.action()", function () {
        proxy.action("queryProcessDefinitionList", {
            proxy: "BB8",
            path: "/repository/process-definitions",
            params: {
                "demo": "123456."
            },
            header: {
                instid: "1111"
            }
        });

        proxy._actions["queryProcessDefinitionList"].should.be.not.NaN;

    })


    it("proxyBb8.post().params.launch()", function (done) {
        proxy.post("queryProcessDefinitionList")
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