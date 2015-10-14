/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var proxyStrategy = require("../proxy-strategy");
var util = require("util");

var proto = module.exports = function (options) {
    function Y9(options) {
        //返回处理器
        var handler = new Handler(options);
        return handler;
    }

    Y9.__proto__ = proto;

    var options = options || {},
        token = options.token || undefined,
        baseurl = options.baseurl || undefined;

    if (!token) {
        throw new Error("must set token!");
    }

    if (!baseurl) {
        throw new Error("must set baseurl!");
    }

    Y9._options = options;
    Y9._token = token;
    Y9._baseurl = baseurl;

    return Y9;
}

function Handler(options) {
    this._options = options || {};

    proxyStrategy.call(this);
}
/**
 * 继承自 `ProxyStrategy`.
 */
util.inherits(Handler, proxyStrategy);


Handler.prototype.launch = function launch(success, failed, done) {

    if (this._params["hello"]) {
        success(this);
    } else {
        failed(new Error("请输入hello参数!"))
    }

    done();

    return this;
}