/**
 * Created by leon on 15/10/21.
 */

var should = require("should");

describe("promise", function () {
    it("promise", function (done) {
        var promiseTest = require("./promiseChain");

        promiseTest(3, done);

        promiseTest.should.not.be.NaN;
    })
})