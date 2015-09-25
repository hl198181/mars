/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var express = require("express");
var debug = require("debug")("mars-demo");
var app = express();
var router = express.Router();

app.use(function (req, res, next) {
    res.locals = {"demo": "你好！"};

    debug("执行中间件!");
    next();
});

router.get("/home*", function (req, res, next) {

    next();
});

app.use("/", router);


app.listen(3000);