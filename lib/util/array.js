/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var util = require("util");

exports = module.exports;

exports.contains = contains;

/**
 * 检查source中是否包含target的内容。source必须为Array否则返回false.如果target为Array则循环比较，否则直接比较
 * @param source
 * @param target
 * @returns {boolean}
 */
function contains(source, target) {

    if (!util.isArray(source)) {
        return false;
    }

    if (util.isArray(target)) {
        var exits = false;

        for (var i = 0; i < source.length; i++) {
            var index = target.indexOf(source[i]);

            if (index >= 0) {
                exits = true;
            } else {
                exits = false;
                break;
            }
        }
        return exits;
    } else {
        var index = source.indexOf(target);
        return (index >= 0);
    }

}

exports.indexOf = indexOf;

/**
 * 检查source中是否存在item
 * @param source
 * @param item
 * @returns {number}
 */
function indexOf(source, item) {
    var length = source.length;

    if (length != 0) {
        for (var index = 0; index < length; index++) {
            if (source[index] == item) {
                return index;
            }
        }
    }
    return -1;
}
