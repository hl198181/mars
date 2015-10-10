/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

exports = module.exports = Model;

function Model(options) {
    this._models = {};

    this.init();
}

Model.prototype.init = function init() {

}

/**
 * 注册模型
 * @param name
 * @param model
 * @returns {Model}
 */
Model.prototype.reg = function reg(name, model) {
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