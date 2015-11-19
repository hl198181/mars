/*!
 * mars
 * 资源仓库管理器，提供配置、访问资源
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var repository = require("./repository");
var modelFactory = require('./model');
var model = require('./model/model');

exports = module.exports
exports.Repository = repository;
exports.Model = model;
exports.ModelFactory = modelFactory;