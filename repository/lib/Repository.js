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

    }

    repository.__proto__ = proto;

    repository._models = [];
    repository._options = options || {};
    repository.init();

    return repository;
}

proto.init = function init() {

}

/***
 * 加载Model配置数据。
 * @param model modelfactory
 * @returns {exports}
 */
proto.use = function use(model) {
    model.all().map(function (item, i) {
        this._models[item.modelName] = item;
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