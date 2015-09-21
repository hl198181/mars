/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var util = require("util");
var HandlerStrategy = require("../handler-strategy");

exports = module.exports = LocalStrategy

function LocalStrategy(options) {

}

/**
 * Inherit from `HandlerStrategy`.
 */
util.inherits(LocalStrategy, HandlerStrategy);

LocalStrategy.prototype.filter = function filter() {

}