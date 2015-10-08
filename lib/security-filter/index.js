/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var Filter = require("./filter");
var StoreFS = require("./store-fs");
var LocalLoginHandler = require("./handler-local-login");
var LocalRoleHandler = require("./handler-local-role");
var DemoHandler = require("./handler-demo");

exports = module.exports = new Filter();
exports.StoreFS = StoreFS;
exports.LocalLoginHandler = LocalLoginHandler;
exports.LocalRoleHandler = LocalRoleHandler;
exports.DemoHandler = DemoHandler;

