'use strict';

var debug = require("debug")("mars-security");
var Security = require("./security");

exports = module.exports = createMars;

exports.Security = Security;

function createMars() {
    debug("初始化Mars中间件.");

    return function mars(req, res, next) {
        next();
    }
}


