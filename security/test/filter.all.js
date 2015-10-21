/**
 * Created by leon on 15/10/20.
 */

var request = require("supertest");
var express = require("express");
var app = express();
app = require("./super/builder-app")(app);

describe("filter.all", function () {


    it("request", function (done) {

        request(app)
            .get("/hello")
            .expect(200)
            .end(function (error, res) {
                done(error);
            });
    });

    it("request order not login", function (done) {
        request(app)
            .get("/app/order")
            .expect(200)
            .end(function (error, res) {
                done(error);
            });
    })

    it("request order on login in", function (done) {

        //调用订单
        var requestOrder = function () {
            request(app)
                .get("/app/order")
                .expect(200)
                .end(function (error, res) {
                    done(error);
                });
        }

        //登录系统
        request(app)
            .post("/auth?userno=admin&password=pass")
            .expect(200)
            .end(function (error, res) {
                requestOrder();
            });

    })
})