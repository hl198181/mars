/*!
 * 数据库模型
 * Copyright(c) 2016 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("y9-mysql");
var mysql = require("mysql");

function Y9MySql(options){
  debug("开始初始化Mysql!");
  this._options = options;
}

Y9MySql.prototype.connectPool = function(){
  var pool  = mysql.createPool(this._connectParams);
  this._pool = pool;
}

Y9MySql.prototype.getPool = function(){
  if (this._pool){
    return this._pool;
  }else{
    throw new Error("pool not connection!");
  }
}

Y9MySql.prototype.setConnectParams = function(params){
  this._connectParams = params;
}

Y9MySql.prototype.setConnectParam = function(key,value){
  this._connectParams = this._connectParams || {};
  this._connectParams[key] = value;
}

module.exports = function(options){
  return new Y9MySql(options);
}
