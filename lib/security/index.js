/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var Filter = require("./filter");
var express = require("express");
var router = express.Router();
var debug = require("debug")("mars-security");

exports = module.exports = createSecurity;

exports.Filter = Filter;

function createSecurity(options) {
    options = options || {};
    debug("初始化安全中间件.");

    function security(req, res, next) {

        debug("执行安全中间件.");

        next();
    }

    //security.__proto__ = proto;

    return security;
}