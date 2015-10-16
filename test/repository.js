/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';
var repository = require("../lib/repository");
var modelFactory = require("../lib/repository/model")();


describe("repository()", function () {

    /***
     * 测试构造方法
     */
    it("repository", function () {
        expect(typeof repository, "'function'");
    });

    /**
     * 测试模型注册,后续测试依赖此处注册的模型数据
     */
    it("ModelFactory.reg()", function () {
        var m = require("../lib/repository/model/Model")({
            name:'demo',
            fields: [
                {name: "id", type: "string",required:true},
                {name: "orderno", type: "string",required:true, convert: "orderno"},
                {name: "price", type: "number"},
                {name: "type", type: "string", label: "类型",convert:"type"},
                {name: "createdate", type: "string", convert: "t2d"}
            ],
            proxy: {
                type: "y9",
                action: "com.yun9.ws.biz.service.AddOrUpdateProductGroupService",
                params: {
                    user: "leon"
                }
            }
        });
        m.convert('orderno',function(value,dataObj,done) {
            setTimeout(function(){
                if (value === "A") {
                    done("A订单");
                } else if (value === "B") {
                    done("B订单");
                } else {
                    done("C订单");
                }
            },500);
        }).convert('type',function(value,dataObj,done) {
            if (value === 'A') {
                return done('A类');
            }
            done('其他类型');
        });
        modelFactory.reg(m);
        modelFactory.reg({
            name: "demo1",
            fields: []
        });

        expect(modelFactory.get("demo")).toBeDefined();
        expect(modelFactory.all().length).toBe(2);
    });

    /**
     * 测试ModelFactory注册转换器
     */
    it('ModelFactory.convert()',function() {
        modelFactory.convert('type',function(value,dataObj,done) {
            if (value === "A") {
                done("A类");
            } else if (value === "B") {
                done("B类");
            } else {
                done("C类");
            }
        }).convert('orderno',function(value,dataObj,done) {
            setTimeout(function(){
                if (value === "A") {
                    done("A订单");
                } else if (value === "B") {
                    done("B订单");
                } else {
                    done("C订单");
                }
            },100);
        });
    });

    /**
     * 测试Model能够继承ModelFactory的convert
     */
    it('Model.converts',function() {
        modelFactory.reg('demo3',{
            name: "demo3",
            fields: [{name: "id", type: "string"}]
        });
        var demo3 = modelFactory.get('demo3');
        var demo = modelFactory.get('demo');
        expect(demo.converts['type']).toBeDefined();
        expect(typeof demo3.converts['type']).toBe('function');
    });

    /**
     * 测试根据名称获取模型配置
     */
    it("ModelFactory.get()", function () {
        var moduleConfig = modelFactory.get("demo");
        expect(moduleConfig).toBeDefined();
    });

    /**
     * 测试获取所有的模型配置
     */
    it("ModelFactory.all()", function () {
        expect(modelFactory.all()).toBeDefined();
    })

    /**
     * 测试资源仓库使用模型配置
     */
    it("repository.use()", function () {
        var modelFactory1 = require("../lib/repository/model")().reg("test", {
            fields: []
        }).reg({
            name: "test1",
            fields: []
        });
        repository.use(modelFactory1).use(modelFactory);
        expect(repository.get("test")).toBeDefined();
        expect(repository.get("demo")).toBeDefined();
    });

    /**
     * 测试资源仓库根据名称获取模型配置
     */
    it("repository.get()", function () {
        var repository2 = require("../lib/repository");
        var model = repository2.get("demo");
        expect(model).toBeDefined();
        expect(model.modelName).toEqual('demo');
    });

    /**
     * 测试创建资源
     */
    it('Model()',function(done) {
        var demo = repository.get("demo");
        demo({id:'123',orderno:'B'},function(err,resource) {
            expect(err).toBeNull();
            expect(resource).toBeDefined();
            expect(resource.get('orderno')).toEqual('B订单');
            done();
        });
    });

    /**
     * 测试通过Model.findOne查找Resource
     */
    it('Model.findOne()',function(done) {
        var demo = repository.get("demo");
        demo.findOne({},function(err,res) {
            expect(err).toBeNull();
            expect(res.get('type')).toBe('A类');
            expect(res.getMeta('type')).toBe('A');
            expect(res.get('orderno')).toEqual('A订单');
            done();
        });
    });
});