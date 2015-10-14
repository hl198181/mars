/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var resource = require('../resource');
var proxy = require('../../proxy');
var repository = require("../");
var util = require('util');

var proto = module.exports = function (options) {

    var model = function(data) {
        model.verify(data);
        return resource(model,data);
    }

    model.__proto__ = proto;
    model._options = options;
    model.converts = {};
    model.convertAsyncs = {};

    model.init();

    return model;
}

/**
 * 初始化model
 * 校验配置
 */
proto.init = function init() {

    configModel.verify(this._options);

    this.modelName = this._options['name'];
    this._options.converts = this._options.converts ||[];
    this._options.convertAsyncs = this._options.convertAsyncs ||[];
}

/**
 * 获取model原始配置
 * @returns {*}
 */
proto.getConfig = function() {
    return this._options;
}

/**
 * 校验数据是否符合model要求的格式
 * @param data 原始数据
 */
proto.verify = function(data) {
    if (!data) {
        throw new Error('无效的原始数据对象');
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty
    var verifyField = function(field,obj) {
        // 校验是否为空
        if (field.required
            && !hasOwnProperty.call(obj,field.name)) {
            throw new Error(field.name+' 字段不能为空')
        }
        if (hasOwnProperty.call(obj,field.name)) {
            // 校验类型是否正确
            if (field.type == 'boolean'
            && !util.isBoolean(obj[field.name])){
                throw new Error(field.name+' 字段必须为boolean类型');
            } else if (field.type == 'number'
                && !util.isNumber(obj[field.name])) {
                throw new Error(field.name+' 字段必须为number类型');
            } else if (field.type == 'string'
                && !util.isString(obj[field.name])) {
                throw new Error(field.name+' 字段必须为string类型');
            } else if (field.type == 'object') {
                if (!util.isObject(obj[field.name])){
                    throw new Error(field.name+' 字段必须为object类型');
                }
                if (field.ref) {
                    var m = repository.get(field.ref);
                    m.verify(data[field.name]);
                } else if (field.model && field.model.fields) {
                    field.model.fields.forEach(function(childField) {
                        verifyField(childField,data[field.name]);
                    });
                }

            } else if (field.type == 'array') {
                if (!util.isArray(obj[field.name])) {
                    throw new Error(field.name+' 字段必须为array类型');
                }
                if (field.ref) {
                    var m = repository.get(field.ref);
                    data[field.name].forEach(function(arrayData) {
                        m.verify(arrayData);
                    });
                } else if (field.model && field.model.fields) {
                    data[field.name].forEach(function(arrayData) {
                        field.model.fields.forEach(function(childField) {
                            verifyField(childField,arrayData);
                        });
                    });
                }
            }
        }

    }
    this.getConfig().fields.forEach(function(field) {
        verifyField(field,data)
    });
    return true;
}

/**
 * 注册转换器
 * @param name 转换器名称
 * @param callback 转换器函数(字段原始值，原始数据对象)
 */
proto.convert = function (name,callback) {
    if (name && callback) {
        this.converts[name] = callback;
        return this;
    }
    throw new Error('无效的Convert');
}

/**
 * 注册异步转换器
 * @param name 转换器名称
 * @param callback 转换器函数(字段原始值，原始数据对象,done函数-转换器函数需手动调用
 * 并传递转换后的值)
 */
proto.convertAsync = function (name,callback) {
    if (name && callback) {
        this.convertAsyncs[name] = callback;
        return this;
    }
    throw new Error('无效的ConvertAsync');
}

/**
 * 根据参数查找一个资源
 * @param params 查询条件
 * @param callback 回调函数
 */
proto.findOne = function(params,callback) {
    var self = this;
    setTimeout(function(){
        callback(null,
            self(
                {id:'1',orderno:'A'})
            );
    },200);
}

/**
 * .........数据操作方法..
 * **/

/**
 * 检验model配置的model
 */
var configModel = function(options) {
    var model = function() {
    }
    model.__proto__ = proto;
    model._options = options;
    return model;
}({
    fields: [
        {   name: "fields",
            type: "array",
            required:true,
            model:{fields:[
                {name:'name',type:'string',required:true},
                {name:'type',type:'string',required:true},
                {name:'convert',type:'string'},
                {name:'label',type:'string'}
            ]}},
        {   name: "proxy",
            type: "object",
            model:{fields:[
                {name:'type',type:'string',required:true},
                {name:'action',type:'string',required:true},,
                {name:'params',type:'object'},
            ]}},
        {
            name: "methods",
            type: "object"
        }
    ]
});