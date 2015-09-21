/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter");

module.exports = function filter(filter, filterItem) {

    return function (req, res, next) {
        debug("执行过滤器中间件，过滤路径:" + filterItem.path);

        var startegy = filter._strategies.default;

        var strategy = filterItem.strategy || "default";

        //检查是否要求登录系统
        if (filterItem.needLogin) {
            debug("路径:" + filterItem.path + ",要求登录系统，开始检查登录信息.");
        } else {
            debug("路径:" + filterItem.path + ",不要求登录系统，跳过检查.")
        }


        next();
    }
}