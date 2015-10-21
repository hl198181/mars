/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';

var Q = require("q");
var debug = require("debug")("test-promise");

module.exports = function (errorIndex, done) {

    debug("测试开始.");

    var index = errorIndex || 3;
    var i = -1;


    var mainFn = function (baseInfo) {


        var oneFn = function (options) {
            i++
            var defered = Q.defer();


            if (!options) {
                options = [];
            }

            var nextFn = function (params) {
                debug("next");

                if (params instanceof Error) {
                    defered.reject(params);
                } else {
                    defered.resolve(params);
                }
            }

            baseInfo["next"] = nextFn;

            setTimeout(function (next) {
                debug('第：' + i + " 次执行" + ",BaseInfo:" + baseInfo.base + "; ");
                if (i == index) {
                    baseInfo.next(new Error("在第" + i + "停止处理!"));
                } else {
                    options.push("第" + i + "次成功处理!" + ",BaseInfo:" + baseInfo.base);
                    baseInfo.next(options);

                }
            }, 100, nextFn);


            return defered.promise;
        };

        return oneFn;
    }


    debug("执行");

    [mainFn({"base": "0"})
        , mainFn({"base": "1"})
        , mainFn({"base": "2"})
        , mainFn({"base": "3"})
        , mainFn({"base": "4"})
        , mainFn({"base": "5"})
        , mainFn({"base": "6"})]
        .reduce(function (prev, current) {
            return prev.then(current);
        }, Q()).then(function (options) {
            debug('成功结束所有;' + options.toString());
            done();
        }, function (error) {
            debug(error.toString());
            done();
        });
}

