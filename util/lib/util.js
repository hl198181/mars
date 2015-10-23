/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

exports = module.exports;


exports.createMethodArray = function (method, len) {
    if (!method || (typeof len != 'number' || len < 0) || typeof method != 'function') {
        throw new Error('无效的入参');
    }
    var fns = [];
    for (var i = 0; i < len; i++) {
        fns.push(method);
    }
    return fns;
}

exports.lookup = function (obj, field) {
    if (!obj) {
        return null;
    }
    var chain = field.split(']').join('').split('[');
    for (var i = 0, len = chain.length; i < len; i++) {
        var prop = obj[chain[i]];
        if (typeof(prop) === 'undefined') {
            return null;
        }
        if (typeof(prop) !== 'object') {
            return prop;
        }
        obj = prop;
    }
    return null;
};