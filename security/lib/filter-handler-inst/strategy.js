/**
 * Created by leon on 15/11/18.
 */

'use strict';

var debug = require("debug")("y9-mars-security-handler-inst");


module.exports = function(options) {

  var options = options || {},
    validInst = options.validInst || function(req, item, done) {
      if (req.isExistInst()) {
        done(true);
      } else {
        done(false);
      }
    }

  var handler = function(req, res, item, params, next) {
    debug("路径:" + item.path + ",要求机构信息，开始检查机构信息.");
    handler._validInst(req, item, function(pass) {
      if (pass) {
        debug("机构检查通过！");
        next();
      } else {
        debug("尚未设置机构信息跳转到机构设置！");
        handler.redirect(item.failureRedirect || "/");
        //记录原始访问路径
        if (item.recordOriginalUrl === true && req.session) {
          req.session.returnTo = req.originalUrl;
        }
      }
    });
  };
  handler._validInst = validInst;
  //设置策略名称
  handler._name = "inst";

  return handler;
};
