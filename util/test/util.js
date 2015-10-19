/**
 * Created by leon on 15/10/19.
 */


var util = require("../lib");

describe("util", function () {
    it("util.Array.contains()", function () {
        expect(typeof util.Array.contains, "function");
    });

    it("util.Util.createMethodArray()", function () {
        expect(typeof util.Util.createMethodArray, "function");
    })

    it("util.Merge()", function () {
        expect(typeof util.Merge, "function");
    });

    it("util.Merge.reDefine()", function () {
        expect(typeof util.Merge.reDefine, "function");
    });
});