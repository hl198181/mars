/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var Filter = require("./filter");
var StoreFS = require("./store-fs");
var LocalHandler = require("./handler-local");
var DemoHandler = require("./handler-demo");

exports = module.exports = new Filter();
exports.StoreFS = StoreFS;
exports.LocalHandler = LocalHandler;
exports.DemoHandler = DemoHandler;
