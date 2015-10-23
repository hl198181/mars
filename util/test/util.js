/**
 * Created by leon on 15/10/19.
 */


var util = require("../lib");
var should = require("should");

describe("util", function () {
    it("util.Array.contains()", function () {
        should(typeof util.Array.contains).be.exactly("function");

    });

    it("util.Util.createMethodArray()", function () {
        should(typeof util.Util.createMethodArray).be.exactly("function");
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

        var r = util.Util.lookup(demo,"demo");

        r.should.be.equal("test");
    });
});