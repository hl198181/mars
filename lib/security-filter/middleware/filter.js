/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter");

module.exports = function filter(filter, filterItem) {

    return function (req, res, next) {

        //此处通过对比访问路径与配置的路径进行正则表达式匹配，可以不需要注册全部的过滤器。

        var name = "default";

        debug("执行过滤器中间件，过滤路径:" + filterItem.path);

        var startegy = filter._strategies[name];

        startegy.success = function () {

        }

        startegy.error = function () {

        }

        startegy.redirect = function () {

        }

        startegy.fail = function () {

        }

        startegy.pass = function () {
            next();
        }

        startegy.filter(req, filterItem);
    }
}