/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';
var superagent = require("superagent");
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

    var action = this._options["action"] || undefined;

    if (!action) {
        throw new Error("must set action!");
    }

    this._action = action;

    proxyStrategy.call(this);
}
/**
 * 继承自 `ProxyStrategy`.
 */
util.inherits(Handler, proxyStrategy);


Handler.prototype.launch = function launch(success, failed, done) {

    var data = {
        token: this._strategy._token,
        action: this._action,
        header: this._header,
        data: this._params
    }

    superagent.post(this._strategy._baseurl)
        .send(data)
        .set('Content-Type', 'application/json;charset=UTF-8')
        .end(function (err, res) {
            if (res && res.ok) {
                if (res.body.code === "100") {
		    if (success){
			success(res);
		    }
                } else {
		    if (failed){
			failed(new Error(res.body.cause), res);
		    }
                };
            } else {
		if (failed){
                    failed(err, res);
		}
            };
	    
	    if (done){
		done();
	    };
        });

}
