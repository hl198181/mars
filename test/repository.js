/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

describe("repository()", function () {

    var repository = require("../lib/repository");

    it("测试导出构造方法", function () {
        expect(typeof repository.Repository).toEqual('function');
        expect(repository.Repository()).toEqual('success');
    });

});