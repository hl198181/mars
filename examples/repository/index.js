/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */
'use strict';

var express = require("express");
var debug = require("debug")("mars-repository-examples");
var router = require("./routes/index");
var proxyRouter = require("./routes/proxy");

var app = express();

app.use("/model", router);
app.use("/proxy", proxyRouter());


app.listen(3000, function () {
    console.log("Repository examples started on port 3000.");
});


