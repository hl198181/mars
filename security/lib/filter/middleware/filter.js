/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security");
var express = require("express");
var router = express.Router();
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
        var attemptIndex = -1;//当前策略下标
        var attempt = function () {
            attemptIndex++;

            var deferred = Q.defer();
            var startegy = filter._strategies[attemptIndex];
            startegy.filterItem = item;
            startegy.req = req;
            startegy.res = res;

            // 记录策略执行信息
            var processInfo = {
                name: startegy.constructor.name,
                startTime: new Date().getTime(),
                endTime: 0,
                costTime: 0
            };

            //策略执行过程中出现错误。带上错误内容结束本次请求
            startegy.error = function (err) {
                processReject(deferred, {error: err || new Error('未知错误')});
            }

            //策略执行过程中需要重定向到指定页面
            startegy.redirect = function (url, status) {
                processReject(deferred, {action: "redirect", "stateCode": 302, "url": url});
            }

            //正常结束全部策略。后续的策略也将不再执行
            startegy.pass = function () {
                processReject(deferred, {});
            }

            //记录发生的错误，并继续执行策略
            startegy.fail = function (error) {
                processResolve(deferred, {error: error || new Error('未知错误')});
            }


            //策略执行成功,继续执行下一个策略
            startegy.success = function () {
                processResolve(deferred, {});
            }

            // 记录日志
            var log = function (options) {
                for (var item in options) {
                    processInfo[item] = options[item];
                }
                processInfo['endTime'] = new Date().getTime();
                processInfo['costTime'] = processInfo['endTime'] - processInfo['startTime'];
                // 记录运行信息
                debug('过滤策略执行完毕：' + JSON.stringify(processInfo, function (key, value) {
                        if (key === 'error' && value) {
                            return JSON.stringify(value.stack);
                        }
                        return value;
                    }));
            }

            // 完成本次策略，执行下一个策略
            var processResolve = function (deferred, options) {
                deferred.resolve();
                log(options);
            }

            // 结束策略循环
            var processReject = function (deferred, options) {
                deferred.reject();
                if (options.error) {
                    next(options.error);
                }

                log(options);

                if (options.action === 'redirect') {
                    res.statusCode = options.stateCode || 302;
                    res.setHeader('Location', options.url);
                    res.setHeader('Content-Length', '0');
                    res.end();
                } else {
                    next();
                }
            }

            startegy.filter();//执行过滤

            return deferred.promise;

        };

        // 开始遍历执行策略
        var attempts = [];
        for (var i = 0; i < filter._strategies.length; i++) {
            attempts.push(attempt);
        }
        attempts.reduce(function (prev, current) {
            return prev.then(current);
        }, Q());

    }
}

function reg(app, filter, options) {
    var options = options || {}
        , root = options.root || "/"
        , failureRedirect = "/notRight";

    if (!app) return;
    if (!filter) return;
    if (!filter._stores) return;

    //防止过滤器还没有完全初始化。
    router.all("/*", function (req, res, next) {
        //检查过滤器是否初始化完成.
        if (registeredRoutes) {
            next();
        } else {
            throw new Error("安全过滤器还没有完成初始化！");
        }
    });

    //加载注册安全过滤器
    filter._stores.forEach(function (item, index) {
        if (item) {
            var filterConfigs = item();

            filterConfigs.all.forEach(function (filterItem, i) {
                debug("开始注册all安全过滤路径:" + filterItem.path);
                router.all(filterItem.path, doHandler(filter, filterItem));
            });

            filterConfigs.get.forEach(function (filterItem, i) {
                debug("开始注册get安全过滤路径:" + filterItem.path);
                router.get(filterItem.path, doHandler(filter, filterItem));
            });

            filterConfigs.post.forEach(function (filterItem, i) {
                debug("开始注册post安全过滤路径:" + filterItem.path);
                router.post(filterItem.path, doHandler(filter, filterItem));
            });
        }
    });

    //添加到app
    app.use(root, router);
    registeredRoutes = true;
}
