/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter");
var express = require("express");
var routre = express.Router();
var Q = require("q");

var registeredRoutes = false;

module.exports = function filter(app, filter, options) {

    //注册过滤器
    reg(app, filter, options);

    return function (req, res, next) {
        next();
    }
}

function doHandler(filter, item) {
    return function (req, res, next) {
        (function attempt(i) {
            var startegy = filter._strategies[i];

            //如果没有找到任何策略，直接结束。
            if (!startegy) {
                return;
            }

            startegy.filterItem = item;
            startegy.req = req;
            startegy.res = res;

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
            startegy.fail = function (error) {
                //TODO 记录发生错误的内容
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

function reg(app, filter, options) {
    var options = options || {}
        , root = options.root || "/";

    if (!app) return;
    if (!filter) return;
    if (!filter._stores) return;

    //防止过滤器还没有完全初始化。
    routre.all("/*", function (req, res, next) {
        //检查过滤器是否初始化完成.
        if (registeredRoutes) {
            next();
        } else {
            throw new Error("安全过滤器还没有完成初始化！");
        }
    });

    //利用Promise读取过滤器配置,方法体中的所有异步方法都保证全部调用后返回
    var readFilters = function (stores) {
        var deferred = Q.defer();
        var filters = [];
        stores.forEach(function (strategy) {
            strategy.all(function (filter) {
                debug("从过滤器仓库策略读取配置.");
                filters.push(filter);
                deferred.resolve(filters);
            });
        });

        return deferred.promise;
    }

    readFilters(filter._stores).then(function (result) {
        debug("读取成功!");


        //注册配置仓库的安全过滤路由.
        result.forEach(function (item) {
            item.all.forEach(function (filterItem) {
                debug("开始注册all安全过滤路径:" + filterItem.path);
                routre.all(filterItem.path, doHandler(filter, filterItem));
            });

            item.get.forEach(function (filterItem) {
                debug("开始注册get安全过滤路径:" + filterItem.path);
                routre.get(filterItem.path, doHandler(filter, filterItem));
            });

            item.post.forEach(function (filterItem) {
                debug("开始注册post安全过滤路径:" + filterItem.path);
                routre.post(filterItem.path, doHandler(filter, filterItem));
            });
        });

        //添加到app
        app.use(root, routre);
        registeredRoutes = true;

    }, function (error) {
        debug("读取失败!");
    });
}
