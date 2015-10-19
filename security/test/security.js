/**
 * Created by leon on 15/10/19.
 */

var security = require("../lib");
var filter = security.Filter;

describe("Security", function () {
    it("filter()", function () {
        expect(typeof filter, "function");
    });

    it("filter.use()", function () {
        filter.use(filter.DemoHandler());

        expect(filter._strategies.length).toEqual(1);
    });
});