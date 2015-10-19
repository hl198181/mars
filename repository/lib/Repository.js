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
    repository._proxys = {};
    repository._options = options || {};
    repository.init();

    return repository;
}

proto.init = function init() {

}

/***
 * 加载Model配置数据。
 * @param model
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
 * 注入代理对象
 * @param proxy
 */
proto.useProxy = function(proxy) {
    if (!proxy) {
        throw new Error('无效的代理');
    }
    this._proxys[proxy.type] = proxy;
}

/***
 * 根据模型名称获取模型配置
 * @param name
 */
proto.get = function get(name) {
    return this._models[name];
}