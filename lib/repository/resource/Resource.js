/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var mixin = require('../../util/merge');
var Q = require("q");

/**
 * 数据强制依靠dataReadyFn返回，
 * 导出方法不直接返回数据
 * @type {Function}
 */
var proto = module.exports = function (model, data,dataReadyFn) {
    var resource = function() {
    }
    resource.__proto__ = proto;
    resource._model = model;
    resource._meta = data;
    resource._data = {};
    resource._dataReadyFn = dataReadyFn;
    resource.init();
}

proto.init = function() {
    if (!this._model || !this._meta) {
        throw new Error('入参错误，无法创建Resource对象');
    }
    if (!this._dataReadyFn || typeof this._dataReadyFn != 'function') {
        throw new Error('入参错误，无效的dataReadyFn函数，无法创建Resource对象');
    }
    this._convertData();
}

/**
 * 将data数据进行处理，并添加到当前Resource对象
 */
proto._convertData = function() {
    mixin(this._data,this._meta);
    var self = this;
    var index = -1;
    var convertField = function() {
        index++;
        var defered = Q.defer();
        var field = self._model.getConfig().fields[index];
        var doConvert = function() {
            if (field.convert
                && self._data[field.name]) {
                var convertFn = self._model.converts[field.convert];
                if (!convertFn || typeof convertFn != 'function') {
                    var err = new Error('无效的转换函数：'+field.convert);
                    self._dataReadyFn(err,self);
                    defered.reject(err);
                } else {
                    convertFn(self._data[field.name],self._data,function(ret) {
                        if (ret instanceof Error) {
                            self._dataReadyFn(ret,self);
                            defered.reject(ret);
                        } else {
                            self._data[field.name] = ret;
                            defered.resolve();
                        }
                    });
                }

            } else {
                defered.resolve();
            }
        }
        setTimeout(doConvert,0);
        return defered.promise;
    }
    var fns = [];
    self._model.getConfig().fields.forEach(function() {
        fns.push(convertField);
    });
    fns.push(function(){
        self._dataReadyFn(null,self);
    });
    fns.reduce(function(prev,current) {
        return prev.then(current);
    },Q());
}

/**
 * 将Resource对象组装成JSON
 */
proto.toJSON = function() {

}


/**
 * 根据名称获取值
 * @param name
 */
proto.get = function get(name) {
    return name?this._data[name]:this._data;
}

/**
 * 获取资源对象的元数据
 */
proto.getMeta = function getMeta(name) {
    return name?this._meta[name]:this._meta;
}