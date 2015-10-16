/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

exports.createMethodArray = function (method,len) {
    if (!method || !len || typeof method != 'function') {
        throw new Error('无效的入参');
    }
    var fns = [];
    for (var i = 0; i < len;i++) {
        fns.push(method);
    }
    return fns;
}