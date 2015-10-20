/**
 * Created by leon on 15/10/20.
 */

var express = require("express")
    , request = require("supertest")
    , security = require("../lib")
    , filter = security.Filter();

describe("filter.all", function (done) {
    it("request", function () {
        var app = express();

        //注册过滤策略
        filter.use(security.DemoHandler());

        request(app)
            .post("/hello")
            .expect(4041, function () {
                done();
            });
    });
})