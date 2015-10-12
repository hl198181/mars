/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';
var debug = require("debug")("mars-repository-model");


module.exports = createModel;

function createModel() {
    debug("创建新的Model！");
    return new Model()
}

function Model(options) {
    debug("执行Model构造方法!");
    this._models = {};
    this.init();
}

Model.prototype.init = function init() {
    debug("初始化Model.");
}

/**
 * 注册模型
 * @param name
 * @param model
 * @returns {Model}
 */
Model.prototype.reg = function reg(name, model) {
    debug("注册Model，名称：" + name);

    if (!model) {
        model = name;
        name = model.name;
    }

    if (!name) {
        throw new Error('Model must have a name');
    }

    this._models[name] = model;
    return this;
}

Model.prototype.size = function size(){
    return this._models.length;
}