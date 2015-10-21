/**
 * Created by leon on 15/10/21.
 */


var request = require("superagent");

describe("supertest", function () {
    beforeEach(function () {

    });

    it("supertest", function (done) {

        request.post("http://120.24.84.201:10080/ws-biz/service/action.yun9")
            .set('Content-Type', 'application/json;charset=UTF-8')
            .send({
                "action": "com.yun9.ws.biz.service.QueryProductInfoByIdService",
                "token": "8fc50dd14a951318ca168e40a9fa1ec78d1110e058700c9affdbe6ab5eb6b931",
                "data": {
                    "productid": "10000001447014"
                }
            }).end(function (err, res) {
                done();
            })
    })
});