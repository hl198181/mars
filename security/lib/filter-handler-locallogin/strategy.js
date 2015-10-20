/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-local");
var Q = require("q");
var util = require("util");
var HandlerStrategy = require("../filter-handler");

exports = module.exports = function (options) {

    return new LocalLoginStrategy(options);
};


function LocalLoginStrategy(options) {
    var self = this;
    var options = options || {}
        , validLogin = options.validLogin || function (req, item, done) {
                if (req.isAuthenticated()) {
                    done(true);
                } else {
                    done(false);
                }
            }
        , failureRedirect = options.failureRedirect || "/login";

    this._validLogin = validLogin;
    this._failureRedirect = failureRedirect;
}

/**
 * Inherit from `HandlerStrategy`.
 */
util.inherits(LocalLoginStrategy, HandlerStrategy);

LocalLoginStrategy.prototype.filter = function filter() {

    var self = this;

    debug("执行本地过滤器策略！");

    //检查是否要求登录系统
    if (this.filterItem.needLogin) {
        debug("路径:" + this.filterItem.path + ",要求登录系统，开始检查登录信息.");

        self._validLogin(self.req, self.filterItem, function (pass) {
            if (pass) {
                debug("已经登录系统！");
                self.success();
            } else {
                debug("未登录系统！");
                self.redirect(self._failureRedirect);
            }
        });
    } else {
        debug("路径:" + this.filterItem.path + ",不要求登录系统，跳过检查.")
        self.success();
    }

}

