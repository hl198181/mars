/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security");


/**
 * 初始化过滤器, 通过读取的过滤器配置信息，增加安全过滤器。
 * @param app
 * @param options
 *
 */
var proto = module.exports = function () {

    debug("创建安全过滤器!");

    var filter = function () {

    }

    filter._strategies = [];
    filter._stores = [];
    filter._framework = null;
    filter.__proto__ = proto;


    return filter;
}

function Filter() {

    this.init();
}

proto.init = function init(options) {
    debug("初始化安全过滤器。");
    var options = options || {};
    this._options = options;
    var connect = require("./framework/connect")();
    this._framework = connect;

}

/**
 * 注册过滤处理器
 * @param name
 * @param strategy
 */
proto.use = function use(strategy) {
    if (strategy) {
        this._strategies.push(strategy);
    }

}

/**
 * 注册过滤器配置储存策略
 * @param name
 * @param strategy
 */
proto.store = function store(strategy) {
    if (!strategy) {
        return;
    }
    this._stores.push(strategy);
}

/**
 * 返回过滤器中间件
 */
proto.filter = function filter(app, options) {
    var self = this;
    return this._framework.filter(app, self, options);
}

