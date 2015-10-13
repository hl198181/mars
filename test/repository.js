/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';
var repository = require("../lib/repository");
var model = repository.Model();
var repos = repository.Repository();


describe("repository()", function () {

    /***
     * 测试构造方法
     */
    it("repository()", function () {
        expect(typeof repository, "'function'");
        expect(typeof repository.Repository(), "'function'");
        expect(typeof repository.Model(), "'function'");
    });

    /**
     * 测试模型注册,后续测试依赖此处注册的模型数据
     */
    it("repository.Model.reg()", function () {
        model.reg("demo", {
            fields: [
                {name: "id", type: "int"},
                {name: "orderno", type: "string"},
                {name: "price", type: "double"},
                {name: "type", type: "string", convert: "type", label: "type"},
                {name: "createdate", type: "date", convert: "t2d"}
            ],
            proxy: {
                type: "y9",
                action: "com.yun9.ws.biz.service.AddOrUpdateProductGroupService",
                params: {
                    user: "leon"
                }
            },
            converts: [{
                name: "type", rule: function (val) {
                    if (val === "A") {
                        return "A类";
                    } else if (val === "B") {
                        return "B类";
                    } else {
                        return "C类";
                    }
                }
            }]
        }).reg({
            name: "demo1",
            fields: []
        });

        expect(model.size()).toEqual(2);
    });

    /**
     * 测试根据名称获取模型配置
     */
    it("repository.Model.get()", function () {
        var moduleConfig = model.get("demo");
        expect(moduleConfig).toBeDefined();
    })

    /**
     * 测试获取所有的模型配置
     */
    it("repository.Model.all()", function () {
        expect(model.all().length).toEqual(2);
    })

    /**
     * 测试资源仓库使用模型配置
     */
    it("repository.use()", function () {
        var model1 = repository.Model().reg("test", {
            fields: []
        }).reg({
            name: "test1",
            fields: []
        });
        repos.use(model).use(model1);
        expect(repos.size()).toEqual(4);
    });

    /**
     * 测试资源仓库根据名称获取模型配置
     */
    it("repository.get()", function () {
        var modelConfig = repos.get("demo");
        expect(modelConfig).toBeDefined();

    });
});