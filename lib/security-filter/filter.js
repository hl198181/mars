/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-filter");
var express = require("express");
var routre = express.Router();
var filterHandler = require("./middleware/filter");
var Q = require("q");

//监控是否已经完成了路由注册
var registeredRoutes = false;


exports = module.exports = Filter

/**
 * 初始化过滤器, 通过读取的过滤器配置信息，增加安全过滤器。
 * @param app
 * @param options
 *
 */
function Filter() {
    debug("创建安全过滤器!");
    this._strategies = {};
    this._stores = [];
}

Filter.prototype.init = function init(options) {
    debug("初始化安全过滤器。");
    var options = options || {};
    this._options = options;
}

/**
 * 注册过滤处理器
 * @param name
 * @param strategy
 */
Filter.prototype.use = function use(name, strategy) {
    //如果strategy为空，则考虑用户通过第一个参数代入策略，并将名称以name属性传递
    if (!strategy) {
        strategy = name;
        name = strategy.name;
    }

    if (!name) {
        name = "default";
    }
    this._strategies[name] = strategy;

}

/**
 * 注册过滤器配置储存策略
 * @param name
 * @param strategy
 */
Filter.prototype.store = function store(strategy) {
    if (!strategy) {
        return;
    }
    this._stores.push(strategy);
}

/**
 * 将过滤器注册到app中
 * @param app
 * @param filter
 */
Filter.prototype.registerRoutes = function registerRoutes(root, app) {
    if (!this._stores) return;
    var self = this;

    if (!root) {
        throw new Error("过滤器根目录必须输入.");
    }

    if (!app) {
        throw new Error(" app对象必须输入.");
    }

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

    readFilters(this._stores).then(function (result) {
        debug("读取成功!");
        reg(self, root, app, result);
    }, function (error) {
        debug("读取失败!");
    });
}

/**
 * 注册用于反序列化过滤器的处理器方法
 * @param fn
 */
Filter.prototype.deserializeFilter = function deserializeFilter(fn) {
    if (typeof fn == "function") {
        this._deserializers.push(fn);
    }
}

function reg(self, root, app, filters) {
    if (!app) return;
    if (!filters) return;

    //防止过滤器还没有完全初始化。
    routre.all("/*", function (req, res, next) {
        //检查过滤器是否初始化完成.
        if (registeredRoutes) {
            next();
        } else {
            throw new Error("安全过滤器还没有完成初始化！");
        }
    });


    //注册配置仓库的安全过滤路由.
    filters.forEach(function (item) {

        item.all.forEach(function (filterItem) {
            debug("开始注册all安全过滤路径:" + filterItem.path);
            routre.all(filterItem.path, filterHandler(self, filterItem));
        });

        item.get.forEach(function (filterItem) {
            debug("开始注册get安全过滤路径:" + filterItem.path);
            routre.get(filterItem.path, filterHandler(self, filterItem));
        });

        item.post.forEach(function (filterItem) {
            debug("开始注册post安全过滤路径:" + filterItem.path);
            routre.post(filterItem.path, filterHandler(self, filterItem));
        });

    });

    //添加到app
    app.use(root, routre);

    registeredRoutes = true;
}
