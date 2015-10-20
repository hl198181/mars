/**
 * Created by leon on 15/10/19.
 */


var should = require("should");
var express = require("express");
var app = express();

var security = require("../lib");
var filter = security.Filter();
var store = security.FilterStore();


describe("Filter", function () {
    it("filter()", function () {
        should(typeof security.Filter).be.exactly("function");
    });

    it("filter.Store()", function () {
        should(typeof security.FilterStore()).be.exactly("function");

    })

    it("store.use() store.get() store.post()", function () {
        store.use("/admin*", {
            needLogin: true,
            role: [
                "admin"
            ]
        }).use("/app*", {
            needLogin: true,
            role: ["user"]
        }).use("/hello").get("/get*", {}).post("/post*", {
            needLogin: true
        });

        store._filters.all.should.have.length(3);
        store._filters.get.should.have.length(1);
        store._filters.post.should.have.length(1);

        store._filters.all[2].needLogin.should.not.be.ok;
        store._filters.all[2].role.should.have.length(0);
        store._filters.get.should.have.length(1);

        store._filters.get[0].needLogin.should.not.be.ok;
        store._filters.post[0].needLogin.should.be.ok;

    });

    it("store()", function () {
        var filters = store();
        filters.all.should.have.length(3);

    });

    it("filter.use()", function () {
        filter.use(security.DemoHandler({
            "demo": "demo1"
        }));

        filter.use(security.DemoHandler({
            "demo": "demo2"
        }));
        filter._strategies.should.have.length(2);
    });

    it("filter.store()", function () {
        filter.store(store);
        filter._stores.should.have.length(1);
    });

    it("filter.filter()", function () {
        var midd = filter(app, {});

        should.exist(midd);
    });

});