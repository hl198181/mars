/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter-local");
var util = require("util");
var HandlerStrategy = require("../handler-strategy");

exports = module.exports = LocalStrategy;


function LocalStrategy(options) {
    var self = this;
    var options = options || {}
        , validLogin = options.validLogin || function () {
                self.error(new Error("must set validLogin function!"));
            }
        , validRole = options.validRole || function () {
                self.error(new Error("must set validRole function!"));
            };
}

/**
 * Inherit from `HandlerStrategy`.
 */
util.inherits(LocalStrategy, HandlerStrategy);

LocalStrategy.prototype.filter = function filter() {

    var self = this;

    debug("执行本地过滤器策略！");

    //检查是否要求登录系统
    if (this.filterItem.needLogin) {
        debug("路径:" + this.filterItem.path + ",要求登录系统，开始检查登录信息.");

        validLogin(self.req, function (isLogin) {
            if (isLogin) {
                debug("用户已经登录系统！");
            } else {
                debug("还未登录系统");
            }
        });


    } else {
        debug("路径:" + this.filterItem.path + ",不要求登录系统，跳过检查.")
    }

    this.success();
}

