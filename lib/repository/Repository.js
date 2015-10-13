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

    function repository() {

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
 * @param model
 * @returns {exports}
 */
proto.use = function use(model) {
    var models = model.all();

    if (model && models) {
        //加载模块中的所有配置
        this._models = this._models.concat(models);
    }

    return this;
}


/***
 * 获取当前模型总数
 * @returns {Number}
 */
proto.size = function size() {
    return this._models.length;
}

/***
 * 根据模型名称获取模型配置
 * @param name
 */
proto.get = function get(name) {
    for (var i = 0; i < this.size(); i++) {
        if (this._models[i].name === name) {
            return this._models[i];
        }
    }
}

/***
 * 根据指定名称以及初始化数据创建模型实例
 * @param name
 * @param data
 */
proto.create = function create(name, data) {

}

/**
 * 根据指定模型名称以及查询参数载入模型
 * @param name
 * @param params
 */
proto.load = function load(name, params) {

}