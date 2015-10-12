/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var proto = module.exports = function (options) {

    function repository() {

    }

    repository.__proto__ = proto;

    repository._models = [];
    repository._options = options || {};
    repository.init();

    return repository;
}

proto.init = function init() {

}

proto.use = function use(model) {
    var models = model.all();

    if (model && models) {
        //加载模块中的所有配置
        this._models = this._models.concat(models);
    }

    return this;
}


proto.size = function size() {
    return this._models.length;
}
