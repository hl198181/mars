/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var express = require("express");
var router = express.Router();

router.get("/login", function (req, res, next) {
    res.render("login", {"title": "登录系统"});
});

module.exports = router;