/**
 * Created by Leon on 15/9/16.
 */

'use strict';

var express = require("express");
var Mars = require("../../lib/mars");
var Filter = Mars.Security.Filter;
var filterStoreFS = new Filter.FilterStoreFS({"path": "123"});
var app = express();

app.use(Filter({"store": filterStoreFS}));

app.get("/", function (req, res, next) {
    res.send("hello world!");
});

app.use(function (err, req, res, next) {
    res.send(err.stack);
});

app.listen(3000);
console.log('Express started on port 3000');