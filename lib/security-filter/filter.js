/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter");


//监控是否已经完成了路由注册
var registeredRoutes = false;


exports = module.exports = Filter

/**
 * 初始化过滤器, 通过读取的过滤器配置信息，增加安全过滤器。
 * @param app
 * @param options
 *
 */
function Filter() {
    debug("创建安全过滤器!");
    this._strategies = [];
    this._stores = [];
    this._framework = null;
    this.init();
}

Filter.prototype.init = function init(options) {
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
Filter.prototype.use = function use(strategy) {
    if (strategy) {
        this._strategies.push(strategy);
    }

}

/**
 * 注册过滤器配置储存策略
 * @param name
 * @param strategy
 */
Filter.prototype.store = function store(strategy) {
    if (!strategy) {
        return;
    }
    this._stores.push(strategy);
}

/**
 * 返回过滤器中间件
 */
Filter.prototype.filter = function filter(app, options) {
    var self = this;
    return this._framework.filter(app, self, options);
}

