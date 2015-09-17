/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter");
var FilterStoreFS = require("./filter-store-fs");
var express = require("express");
var routre = express.Router();
var initComplete = false;

exports = module.exports = createFilter

exports.FilterStoreFS = FilterStoreFS;

/**
 * 初始化过滤器, 通过读取的过滤器配置信息，增加安全过滤器。
 * @param app
 * @param options
 * @returns {Function}
 */
function createFilter(app, options) {
    var options = options || {},
        root = options.root || "/";

    debug("过滤器中间件初始化!");

    //注册安全过滤器
    //首先注册全局匹配过滤器，用于检查过滤器是否就绪，防止异步配置信息还没有完成就发生客户端访问，出现过滤漏掉的情况.
    routre.all("/*", function (req, res, next) {
        //检查过滤器是否初始化完成.
        if (initComplete) {
            next();
        } else {
            throw new Error("安全过滤器还没有完成初始化！");
        }
    });

    options.store.all(function (filter) {
        debug("异步获取过滤配置");
        initComplete = true;
    });

    //添加到app
    app.use(root, routre);

    return function (req, res, next) {
        debug("执行安全过滤中间件.");
        next();
    }
}

