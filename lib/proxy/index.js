/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var proto = module.exports = function (options) {

    function proxy() {

    }

    this.__proto__ = proto;
    proxy._serializers = [];

    return proxy;
}

/**
 * 调用服务
 * @param type
 * @param options
 */
proto.call = function call(type, options) {

}