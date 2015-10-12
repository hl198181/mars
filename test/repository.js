/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';
var repository = require("../lib/repository");
var repos = repository.Repository();

describe("repository()", function () {

    it("repository()", function () {
        expect(typeof repository, "'function'");
        expect(typeof repository.Repository(), "'function'");
        expect(typeof repository.Model(), "'function'");
    });

    it("repository.Model.reg()", function () {
        var module = repository.Model().reg("demo", {
            fields: []
        }).reg({
            name: "demo1",
            fields: []
        });

        expect(module.size()).toEqual(2);
    });

    it("repository.Model.get()", function () {
        var module = repository.Model().reg("demo", {
            fields: []
        });

        var moduleConfig = module.get("demo");
        expect(moduleConfig).toBeDefined();
    })

    it("repository.Model.all()", function () {
        var module = repository.Model().reg("demo", {
            fields: []
        });
        expect(module.all().length).toEqual(1);
    })
    
    it("repository.use()", function () {

        var module = repository.Model().reg("demo", {
            fields: []
        }).reg({
            name: "demo1",
            fields: []
        });

        var module1 = repository.Model().reg("test", {
            fields: []
        }).reg({
            name: "test1",
            fields: []
        });

        repos.use(module).use(module1);

        expect(repos.size()).toEqual(4);
    });
});