/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var util = require("util");
var HandlerStrategy = require("../handler-strategy");
var debug = require("debug")("mars-security-filter-handler-demo");


module.exports = HandlerDemo;

function HandlerDemo() {

}

util.inherits(HandlerDemo, HandlerStrategy);

HandlerDemo.prototype.filter = function filter(req, item) {
    debug("Demo处理器策略");

    this.success();
}

