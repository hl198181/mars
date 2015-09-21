/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var fs = require("fs");
var debug = require("debug")("mars-security-filter-store-fs");
var Store = require("../store-strategy");
var util = require("util");

/* 异步处理 */
var defer = typeof setImmediate === 'function'
    ? setImmediate
    : function (fn) {
    process.nextTick(fn.bind.apply(fn, arguments))
}

exports = module.exports = Strategy;

util.inherits(Strategy, Store);

/**
 * 基于文件的过滤器配置仓库
 *
 * @public
 * @param options {Object} 初始化过滤器配置参数。需要提供属性 path作为配置文件路径
 * @constructor
 */
function Strategy(options) {
    Store.call(this);
    options = options || {};

    var filters = null;

    if (options.path) {
        debug("从路径:" + options.path + "加载filter配置信息.");
        filters = loadConfigurationFile(options.path);
    } else {
        throw new Error('初始化文件过滤器配置仓库错误，请提供包含path属性选项作为输入参数.');
    }

    this.filters = Object.create(filters);
}
/**
 * 根据路径同步加载过滤器配置文件
 * @private
 * @param filename
 *
 */
function loadConfigurationFile(filename) {
    if (filename) {
        return JSON.parse(fs.readFileSync(filename, "utf8"));
    }
    return undefined;
}


Strategy.prototype.all = function all(callback) {
    callback && defer(callback, this.filters);
}

/**
 * 清除配置信息,并异步通知
 * @param callback
 */
Strategy.prototype.clean = function clean(callback) {
    this.filters = Object.create(null);
    callback && defer(callback);
}

