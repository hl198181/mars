/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var util = require("util");
var HandlerStrategy = require("../filter-handler");
var debug = require("debug")("mars-security-handler-demo");


module.exports = function (options) {
    return new Handler(options);
};

function Handler(options) {
    this._options = options || {};
}

util.inherits(Handler, HandlerStrategy);

Handler.prototype.filter = function filter() {
    debug("Demo处理器策略");

    this.success();
}

