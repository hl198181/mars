/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';
var repository = require("../lib");
var should = require('should');

describe('Resource', function () {
    before(function () {
        /**=====在所有测试之前，初始化数据*/
        // 注册model
        var model = require("../lib/model/Model")({
            name: 'WorkorderAnalysisUser',
            fields: [
                {name: "page", type: "string", required: true},
                {name: "userid", type: "string", required: true},
                {name: "allNums", type: "number"},
                {name: "completeNums", type: "number"},
                {name: "inserviceNums", type: "number"},
                {name: "waitNums", type: "number"},
                {name: "comleterate", type: "number"},
                {name: "laterate", type: "number"}
            ],
            proxy: {
                type: "y9",
                action: "com.yun9.ws.biz.service.QueryWorkorderAnalysisUserService",
                params: {
                    instid: "10000001468002"
                }
            }
        });
        var modelFactory = require("../lib/model")();
        modelFactory.reg(model);
        repository.use(modelFactory);
        // 注册proxy

    });

    it('verify Model', function () {
        var model = repository.get('WorkorderAnalysisUser');
        should(model).ok;
        should(typeof model).eql('function');
    });

    it('verify resource with static data',function(done) {
        var model = repository.get('WorkorderAnalysisUser');
        model({data:{
            "page": null,
            "userid": null,
            "allNums": 6845,
            "completeNums": 0,
            "inserviceNums": 0,
            "waitNums": 6845,
            "comleterate": 0,
            "laterate": 1
        }},function(err,resource) {
            should(err).not.ok;
            should(resource).ok;
            should(resource).have.property('getBean');
            should(resource.getBean(0)).have.property('allNums',6845);
            done();
        });
    });
});