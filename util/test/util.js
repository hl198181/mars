/**
 * Created by leon on 15/10/19.
 */


var util = require("../lib");
var should = require("should");

describe("util", function () {
    it("util.Array.contains()", function () {
        should(typeof util.Array.contains).be.exactly("function");

    });

    it("util.Common.createMethodArray()", function () {
        should(typeof util.Common.createMethodArray).be.exactly("function");
    })

    it("util.Merge()", function () {
        should(typeof util.Merge).be.exactly("function");
    });

    it("util.Merge.reDefine()", function () {
        should(typeof util.Merge.reDefine).be.exactly("function");
    });

    it("util.lookup", function () {
        var demo = {
            demo: "test"
        }

        var r = util.Common.lookup(demo,"demo");

        r.should.be.equal("test");
    });
});