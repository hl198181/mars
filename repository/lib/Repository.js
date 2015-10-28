/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

/**
 * 资源构造方法，初始化相关参数
 * @type {Function}
 */
var proto = module.exports = function (options) {

    var repository = function () {
        return function (res, req, next) {
            //repository
            res.y9Repository = repository;
            next();
        }
    }

    repository.__proto__ = proto;

    repository._models = [];
    repository._options = options || {};
    repository._modelNameField = repository._options.modelNameField || 'y9ModelName';
    repository._paramsField = repository._options.paramsField || 'y9Params';
    repository.init();

    return repository;
}

proto.init = function init() {

}

/**
 * 中间件，处理model请求
 * 根据model名称以及参数，返回具体资源
 * @returns {Function}
 */
proto.service = function() {
    var self = this;

    return function(req, res, next) {
        //从请求获取参数
        var modelName = req.body[self._modelNameField];
        var params = req.body[self._paramsField];

        var errResData = {
            code: "500",
        }

        if (!modelName) {
            errResData.cause = "请求参数中无法找到名称为:" + self._modelNameField+ "的模块名称参数."
            res.statusCode = 500;
            res.send(errResData);
            return;
        }

        var model = req.y9Repository.get(modelName);
        if (!model) {
            errResData.cause = "无法获取名称为："+modelName+" 的模块配置";
            res.statusCode = 500;
            res.send(errResData);
            return;
        }
        model.action(req.y9proxy,params,function(err,resource) {
            if (err) {
                errResData.cause = err.message;
                res.statusCode = 500;
                res.send(errResData);
            } else {
                res.send(resource.toJSON());
            }
        });
    }
}

/***
 * 加载Model配置数据。
 * @param model modelfactory
 * @returns {exports}
 */
proto.use = function use(model) {
    model.all().map(function (item, i) {
        this.model(item);
        return item;
    }, this);

    return this;
}

/**
 * 增加单个model
 * @param model
 * @returns {proto}
 */
proto.model = function(model) {
    model.y9Repository = this;
    this._models[model.modelName] = model;
    return this;
}

/***
 * 根据模型名称获取模型配置
 * @param name
 */
proto.get = function get(name) {
    return this._models[name];
}