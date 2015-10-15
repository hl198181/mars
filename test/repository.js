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
                {name: "type", type: "string", label: "type"},
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
        m.convert('orderno',function(val) {
            if (val == 'B') {
                return 'B订单';
            }
            return '默认订单';
        }).convert('type',function(val) {
            if (val == 'A') {
                return 'A类';
            }
            return '其他类型';
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
    it('ModelFactory.convert().convertAsync()',function() {
        modelFactory.convert('type',function(value) {
            if (value === "A") {
                return "A类";
            } else if (value === "B") {
                return "B类";
            } else {
                return "C类";
            }
        }).convertAsync('orderno',function(value,data,done) {
            setTimeout(function(){
                if (value === "A") {
                    done("A订单");
                } else if (value === "B") {
                    done("B订单");
                } else {
                    done("C订单");
                }
            },500);
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
    it('Model()',function() {
        var demo = repository.get("demo");
        var resource = demo({id:'123',orderno:'B'});
        expect(resource).toBeDefined();
        expect(resource.orderno).toEqual('B订单');
    });

    /**
     * 测试通过Model.findOne查找Resource
     */
    it('Model.findOne()',function(done) {
        var demo = repository.get("demo");
        demo.findOne({},function(err,res) {
            expect(err).toBeNull();
            expect(res.type).toBe('A');
            expect(res.getLabel('type')).toBe('A类');
            expect(res.orderno).toEqual('默认订单');
            done();
        });
    });
});