/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';

var Q = require("q");

var index  = 3;
var i = -1;
var oneFn = function() {
    i++
    var defered = Q.defer();
    setTimeout(function() {
        console.log('第：'+i+" 次执行");
        if(i == index) {
            defered.reject();
        } else {
            defered.resolve();
        }
    },100);

    return defered.promise;
};
[oneFn,oneFn,oneFn,oneFn,oneFn,oneFn,oneFn].reduce(function(prev,current) {
    return prev.then(current);
},Q()).fail(function() {
    // 如果最后定义了reject方法，这个方法不执行
    console.log('fail,i:'+i);
}).then(function() {
    console.log('成功结束所有');
},function() {
    console.log('最后一个异常，i:'+i);
});