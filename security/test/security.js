/**
 * Created by leon on 15/10/19.
 */

var security = require("../lib");
var filter = security.Filter;

describe("Security", function () {
    it("filter()", function () {
        expect(typeof filter, "function");
    });
});