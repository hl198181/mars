/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var Filter = require("./filter");
var StoreFS = require("./store-fs");
var HandlerLocal = require("./handler-local");

exports = module.exports = new Filter();
exports.StoreFS = StoreFS;
exports.HandlerLocal = HandlerLocal;
