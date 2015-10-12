/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';
var debug = require("debug")("mars-repository-model");


var proto = module.exports = function (options) {

    function model() {

    }

    model.__proto__ = proto;
    model._options = options || {};
    model._models = [];

    model.init();

    return model;
}

proto.init = function init() {
    debug("初始化Model.");
}

/**
 * 注册模型
 * @param name
 * @param model
 * @returns {Model}
 */
proto.reg = function reg(name, model) {
    debug("注册Model，名称：" + name);

    if (!model) {
        model = name;
        name = model.name;
    } else {
        model.name = name;
    }

    if (!name) {
        throw new Error('Model must have a name');
    }

    this._models.push(model);
    return this;
}

proto.get = function get(name) {
    debug("获取名称为：" + name + "，的Model配置。");

    var self = this;

    for (var i = 0; i < self.size(); i++) {
        if (self._models[i].name === name) {
            return self._models[i];
        }
    }
}

proto.all = function all(){
    return this._models;
}

proto.size = function size() {
    return this._models.length;
}