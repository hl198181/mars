/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter-local");
var util = require("util");
var HandlerStrategy = require("../handler-strategy");

exports = module.exports = LocalStrategy

function LocalStrategy(options) {

}

/**
 * Inherit from `HandlerStrategy`.
 */
util.inherits(LocalStrategy, HandlerStrategy);

LocalStrategy.prototype.filter = function filter(req, item) {

    var self = this;

    //检查是否要求登录系统
    if (item.needLogin) {
        debug("路径:" + item.path + ",要求登录系统，开始检查登录信息.");
    } else {
        debug("路径:" + item.path + ",不要求登录系统，跳过检查.")
    }

    self.pass();

}