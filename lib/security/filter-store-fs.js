/**
 * Created by Leon on 15/9/16.
 */
'use strict';

var debug = require("debug")("mars-security-filter");
var FilterStore = require("./filter-store");
var util = require("util");

exports = module.exports = FilterStoreFS;

util.inherits(FilterStoreFS, FilterStore);


function FilterStoreFS(options) {
    FilterStore.call(this);
    options = options || {};

    if (options.path) {
        debug("从路径:" + options.path + "加载filter配置信息.");
    }
}

