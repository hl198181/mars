/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

module.exports = Strategy;

function Strategy() {
}

Strategy.prototype.clean = function clean(callback) {
    throw new Error('Strategy#clean must be overridden by subclass');
}

Strategy.prototype.all = function all(callback) {
    'Strategy#all must be overridden by subclass'
    throw new Error();
}