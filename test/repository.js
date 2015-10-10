/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var repository = require("../lib/repository");
var assert = require("assert");

describe("repository()", function () {

    it("测试导出构造方法", function () {
        assert.equal(typeof repository.Repository(), "function");
        assert.equal(typeof repository.Model(), "function");
    });

});