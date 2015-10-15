/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var express = require("express");
var debug = require("debug")("mars-repository-examples");
var repository = require("../../../lib/repository");
var router = express.Router();

router.get("/reg", function (req, res, next) {
    debug("访问注册模块examples.!");
    model.reg("demo", {});
    res.send("模块数量:" + model.size());


});

module.exports = router;