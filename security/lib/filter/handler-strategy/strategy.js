/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

function Strategy(){

}

Strategy.prototype.filter = function filter(req, item, options) {
    throw new Error('FilterHandlerStrategy#all must be overridden by subclass');
}

module.exports = Strategy;