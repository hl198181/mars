/**
 * Created by leon on 15/10/23.
 */

var express = require("express");
var app = express();
var service = require("../");
var proxy = service.Proxy();
var request = require("supertest");
var bodyParser = require("body-parser");

describe("proxy.service()", function () {
    beforeEach(function () {
        proxy.use("Y9", service.ProxyY9({
            token: "8fc50dd14a951318ca168e40a9fa1ec78d1110e058700c9affdbe6ab5eb6b931",
            baseurl: "http://120.24.84.201:10080/ws-biz/service/action.yun9",
            header: {}
        }));

        proxy.action("queryOrderList", {
            proxy: "Y9",
            action: "com.yun9.ws.biz.service.QueryOrdersByStateService"
        });

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use("/service", proxy.service("Y9"));
    });

    it("proxy.service() client post", function (done) {

        request(app)
            .post("/service")
            .set('Content-Type', 'application/json')
            .send({
                'y9action': {
                    name: "queryOrderList"
                }
            })
            .expect(200)
            .end(function (error, res) {
                var data = res.body;
                done();
            })
    })
});