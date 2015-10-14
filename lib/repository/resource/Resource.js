/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var mixin = require('../../util/merge');

var proto = module.exports = function (model, data,dataReadyFn) {

    var resource = function() {
    }
    resource.__proto__ = proto;
    resource._model = model;
    resource._meta = data;
    resource._data = {};
    resource._labelData = {};
    resource.init();
    return resource;

}

proto.init = function() {
    if (!this._model || !this._meta) {
        throw new Error('入参错误，无法创建Resource对象');
    }
    this.convertData();
}

/**
 * 将data数据进行处理，并添加到当前Resource对象
 */
proto.convertData = function() {
    mixin(this._data,this._meta);
    var self = this;
    // TODO 怎么处理需要异步的convert？
    this._model.getConfig().fields.forEach(function(field) {
        if (field.convert && self._data[field.name]) {
            var convertFn = self._model.converts[field.convert];
            if (!convertFn || typeof convertFn != 'function') {
                throw new Error('无效的转换函数：'+field.convert);
            }
            self._data[field.name] = convertFn(self._data[field.name],self._data);
        }
    });
    mixin(this,this._data);
}


/**
 * 根据名称获取值
 * @param name
 */
proto.get = function get(name) {
    this.getData()[name];
}

/**
 * 获取数据集合
 */
proto.getData = function data() {
    return this._data;
}


/**
 * 获取资源对象的元数据
 */
proto.getMeta = function getMeta() {
    return this._meta;
}