/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-service-proxy");

var proto = module.exports = function (options) {

    function proxy(type, options) {
        if (type && options) {
            return proxy.handler(type, options);
        }
        return proxy;
    }

    proxy.__proto__ = proto;
    proxy._strategies = {};

    return proxy;
}

/**
 * 获取处理器
 * @param type
 * @param options
 */
proto.handler = function handler(name, options) {
    var strategy = this._strategies[name];

    if (!strategy) {
        throw new Error("not found strategy name is " + name);
    }

    //初始化Handler
    var handler = strategy(options);
    handler._strategy = strategy;
    return handler;
}

/**
 * 加载代理策略
 */
proto.use = function use(name, strategy) {
    if (!strategy) {
        strategy = name;
        name = strategy.name;
    } else {
    }

    if (!name) {
        throw new Error('proxy strategy must have a name');
    }

    this._strategies[name] = strategy;
    return this;
}

/**
 * 获取指定名称策略
 * @param name
 * @returns {*}
 * @private
 */
proto._strategy = function _strategy(name) {
    return this._strategies[name];
}