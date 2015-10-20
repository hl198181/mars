/**
 * Created by leon on 15/10/20.
 */

var express = require("express")
    , request = require("supertest")
    , security = require("../")
    , filter = security.Filter()
    , store = security.FilterStore()
    , app = express()
    , router = express.Router();


describe("filter.all", function () {
    beforeEach(function () {
        //注册过滤器仓库
        store.use("/hello", {}).use("/admin*").use("/app*").use("/demo1/hello");
        filter.store(store);

        //注册过滤策略
        filter.use(security.DemoHandler());

        //注册中间件
        filter(app, {
            root: "/demo1"
        });

        //注册业务路由
        router.get("/app/order", function (req, res) {
            res.send({
                orderid: "123457767867"
            })
        });

        router.get("/hello", function (req, res) {
            res.send({
                name: "tobi"
            });
        });

        router.get("/demo1/hello", function (req, res) {
            res.send({
                name: "tobi"
            });
        });

        app.use("/", router);
    });

    it("request", function (done) {
        request(app)
            .get("/demo1/hello")
            .expect(200)
            .end(function (error, res) {
                done(error);
            });
    });

    it("request order", function (done) {
        request(app)
            .get("/app/order")
            .expect(200)
            .end(function (error, res) {
                done(error);
            });
    })
})