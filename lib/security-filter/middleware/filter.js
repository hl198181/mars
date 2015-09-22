/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter");

module.exports = function filter(filter) {

    return function (req, res, next) {

        //TODO 此处通过对比访问路径与配置的路径进行正则表达式匹配，可以不需要注册全部的过滤器。

        //debug("执行过滤器中间件，过滤路径:" + filterItem.path);
        debug("过滤器中间件。");

        (function attempt(i) {
            var startegy = filter._strategies[i];

            //如果没有找到任何策略，直接结束。
            if (!startegy) {
                return;
            }

            //策略执行过程中出现错误。带上错误内容结束本次请求
            startegy.error = function (err) {
                next(err);
            }

            //策略执行过程中需要重定向到指定页面
            startegy.redirect = function (url, status) {
                res.statusCode = status || 302;
                res.setHeader('Location', url);
                res.setHeader('Content-Length', '0');
                res.end();
            }


            //记录发生的错误，并继续执行策略
            startegy.fail = function () {
                attempt(i + 1);
            }

            //正常结束全部策略。后续的策略也将不再执行
            startegy.pass = function () {
                next();
            }

            //策略执行成功,继续执行下一个策略
            startegy.success = function () {
                attempt(i + 1);
            }

            startegy.filter(req);
        })(0);

        next();
    }
}