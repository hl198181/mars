/**
 * Created by Leon on 15/9/16.
 */
'use strict';

var debug = require("debug")("mars-security-filter");
var FilterStoreFS = require("./filter-store-fs");

exports = module.exports = createFilter

exports.FilterStoreFS = FilterStoreFS;

function createFilter(options) {
    options = options || {};
    debug("过滤器中间件初始化!");

    return function (req, res, next) {
        debug("执行安全过滤中间件.");
        next();
    }
}