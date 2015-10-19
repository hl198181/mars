/**
 * Created by leon on 15/10/19.
 */

var security = require("../lib");
var filter = security.Filter();

describe("Security", function () {
    it("filter()", function () {
        expect(typeof security.Filter, "function");
    });

    it("filter.use()", function () {
        filter.use(filter.DemoHandler({
            "demo": "demo1"
        }));

        filter.use(filter.DemoHandler({
            "demo": "demo2"
        }));

        expect(filter._strategies.length).toEqual(2);
    });
});