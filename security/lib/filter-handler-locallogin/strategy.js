/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var debug = require("debug")("y9-mars-security-local");

exports = module.exports = function(options) {

  /**
   * 根据设备信息，决定调整地址
   */
  function getDeviceRedirect(req, redirects) {
    // 微信内置浏览器：
    redirects.micromessenger = redirects.micromessenger || redirects.weixin;
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    for (var r in redirects) {
      if (deviceAgent.match(r.toLowerCase()) && redirects[r]) {
        return redirects[r];
      }
    }
    return redirects.default;
  }
  var handler = function(req, res, item, params, next) {
    debug("路径:" + req.originalUrl + ",要求登录系统，开始检查登录信息.");
    handler._validLogin(req, item, function(pass) {
      if (pass) {
        debug("已经登录系统！");
        next();
      } else {
        debug("未登录系统！");
        handler.redirect(item.failureRedirect || "/");
        //记录原始访问路径
        if (item.recordOriginalUrl === true && req.session) {
          req.session.returnTo = req.originalUrl;
        }
      }
    });
  }

  var options = options || {},
    validLogin = options.validLogin || function(req, item, done) {
      if (req.isAuthenticated()) {
        done(true);
      } else {
        done(false);
      }
    }
  handler._validLogin = validLogin;
  //设置策略名称
  handler._name = "login";
  return handler;
};
