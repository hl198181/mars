/**
 * Created by leon on 15/10/20.
 */

var express = require("express")
    , request = require("supertest")
    , security = require("../")
    , filter = security.Filter()
    , store = security.FilterStore();

describe("filter.all", function (done) {
    it("request", function () {
        var app = express();
        var router = express.Router();

        //注册过滤器仓库
        store.use("/hello", {}).use("/admin*").use("/app*");
        filter.store(store);

        //注册过滤策略
        filter.use(security.DemoHandler());

        //注册中间件
        filter(app, {
            demo: "demo1"
        });

        router.get("/hello", function (req, res) {

            req.local = {
                title: "aadfadf"
            };

            res.send(200, {
                name: "tobi"
            });
        });

        app.use("/", router);

        request(app)
            .get("/hello")
            .expect(302)
            .end(function () {
                done();
            });
    });
})