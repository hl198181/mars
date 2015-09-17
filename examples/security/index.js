/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var express = require("express");
var Mars = require("../../lib/mars");
var path = require("path");

var app = express();

var filter = Mars.Security.Filter(app, {
    "store": new Mars.Security.Filter.FilterStoreFS({
        "root": "/",
        "path": path.join(__dirname, "./filter.json")
    })
});

app.use(filter);

app.get("/", function (req, res, next) {
    res.send("hello world!");
});

app.use(function (err, req, res, next) {
    res.send(err.stack);
});

app.listen(3000);
console.log('Express started on port 3000');