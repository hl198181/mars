/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

module.exports = Strategy;

function Strategy() {
    this._params = {};
}


/**
 * 执行策略
 */
Strategy.prototype.launch = function launch() {
    throw new Error('Proxy Strategy #all must be overridden by subclass');
}

/**
 * 为策略添加执行参数
 * @param params
 */
Strategy.prototype.params = function params(params) {

    if (params) {
        for (var key in params) {
            this._params[key] = params[key];
        }
    }
    return this;
}

