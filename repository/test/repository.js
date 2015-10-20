/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';
var repository = require("../lib");
var modelFactory = require("../lib/model")();
var should = require('should');


describe("repository()", function () {

    /***
     * 测试构造方法
     */
    it("repository", function () {
        should(typeof repository).eql('function');
    });

    /**
     * 测试模型注册,后续测试依赖此处注册的模型数据
     */
    it("ModelFactory.reg()", function () {
        var m = require("../lib/model/Model")({
            name:'demo',
            fields: [
                {name: "id", type: "string",required:true},
                {name: "orderno", type: "string",required:true, convert: "orderno"},
                {name: "price", type: "number"},
                {name: "type", type: "string", label: "类型",convert:"type"},
                {name: "createdate", type: "string", convert: "t2d"},
                {name: "demo1", type: "object",ref:"demo1"}
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
            fields: [{name: "id", type: "string",required:true}]
        });

        should(modelFactory.get("demo")).ok;
        should(modelFactory.all()).have.length(2);
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
        should(demo.converts['type']).ok;
        should(typeof demo3.converts['type']).eql('function');
    });

    /**
     * 测试根据名称获取模型配置
     */
    it("ModelFactory.get()", function () {
        var moduleConfig = modelFactory.get("demo");
        should(moduleConfig).ok;
    });

    /**
     * 测试获取所有的模型配置
     */
    it("ModelFactory.all()", function () {
        should(modelFactory.all()).ok;
    })

    /**
     * 测试资源仓库使用模型配置
     */
    it("repository.use()", function () {
        var modelFactory1 = require("../lib/model")().reg("test", {
            fields: []
        }).reg({
            name: "test1",
            fields: []
        });
        repository.use(modelFactory1).use(modelFactory);
        should(repository.get("test")).ok;
        should(repository.get("demo")).ok;
    });

    /**
     * 测试资源仓库根据名称获取模型配置
     */
    it("repository.get()", function () {
        var repository2 = require("../lib");
        var model = repository2.get("demo");
        should(model).ok;
        should(model.modelName).eql('demo');
    });

    /**
     * 测试创建资源
     */
    it('Model()',function(done) {
        var demo = repository.get("demo");
        demo({data:{id:'123',orderno:'B',
            demo1:{id:"123",dddd:"不应该存在的字段"},
            lala:'不应该存在的字段'}},
            function(err,resource) {
                should(err).eql(null);
                should(resource).ok;
                should(resource.get('orderno')).eql('B订单');
                should(resource.get('lala')).not.ok;
                should(resource.get("demo1")).ok;
                should(resource.get("demo1").id).eql('123');
                should(resource.get("demo1.id")).eql('123');
                should(resource.get("demo1").dddd).not.ok;
                done();
        });
    });

    /**
     * 测试通过Model.findOne查找Resource
     */
    it('Model.findOne()',function(done) {
        var demo = repository.get("demo");
        demo.findOne({},function(err,res) {
            should(err).eql(null);
            should(res.get('type')).eql('A类');
            should(res.getMeta('type')).eql('A');
            should(res.get('orderno')).eql('A订单');
            done();
        });
    });
});