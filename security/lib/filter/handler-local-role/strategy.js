/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("mars-security-local-role");
var Q = require("q");
var util = require("util");
var y9util = require("y9-mars-util");
var HandlerStrategy = require("../handler-strategy");

exports = module.exports = function (options) {
    return new LocalRoleHandler(options);
};


function LocalRoleHandler(options) {
    var self = this;
    var options = options || {}
        , validRole = options.validRole || function (req, item, done) {
                var property = 'user';
                if (this._passport && this._passport.instance) {
                    property = this._passport.instance._userProperty || 'user';
                }

                var userInfo = req[property];

                if (item && item.role && userInfo && userInfo.role) {
                    if (y9util.Array.contains(item.role, userInfo.role)) {
                        done(true);
                    } else {
                        done(false);
                    }
                } else {
                    done(false);
                }
            }
        , failureRedirect = options.failureRedirect || "/access-denied";

    this._validRole = validRole;
    this._failureRedirect = failureRedirect;
}

/**
 * Inherit from `HandlerStrategy`.
 */
util.inherits(LocalRoleHandler, HandlerStrategy);

LocalRoleHandler.prototype.filter = function filter() {

    var self = this;

    //检查是否要求登录系统
    if (self.filterItem.role) {
        debug("路径:" + this.filterItem.path + ",要求检查角色.");

        self._validRole(self.req, self.filterItem, function (pass) {
            if (pass) {
                debug("角色验证通过！");
                self.success();
            } else {
                debug("角色验证失败!");
                self.redirect(self._failureRedirect);
            }
        });

        //var valid = function (req, item) {
        //    var deferred = Q.defer();
        //
        //    self._validRole(req, item, function (pass) {
        //        if (pass) {
        //            deferred.resolve();
        //        } else {
        //            deferred.reject();
        //        }
        //    });
        //
        //    return deferred.promise;
        //}
        //
        //valid(self.req, self.filterItem).then(function (result) {
        //    debug("角色验证通过！");
        //    self.success();
        //}, function (error) {
        //    debug("角色验证失败!");
        //    self.redirect(self._failureRedirect);
        //});
    } else {
        debug("路径:" + this.filterItem.path + ",不要求角色验证，跳过检查.")
        self.success();
    }

}

