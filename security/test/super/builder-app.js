/**
 * Created by leon on 15/10/21.
 */

var express = require("express")
    , flash = require('express-flash')
    , security = require("../../")
    , filter = security.Filter()
    , store = security.FilterStore()
    , router = express.Router()
    , session = require('express-session')
    , passport = require("passport")
    , PassportLocalStrategy = require("passport-local").Strategy;

module.exports = function (app) {
    //注册session
    app.use(session({resave: false, saveUninitialized: false, secret: "345435345"}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    //配置本地登录验证策略
    passport.use("local", new PassportLocalStrategy({
            "usernameField": "userno",
            "passwordField": "password"
        },
        function (username, password, done) {
            var user = {
                id: "1",
                username: "admin",
                password: "pass",
                role: ["user"]
            }

            if (username !== user.username) {
                return done(null, false, {"message": "登录失败！无效的用户编号！"});
            }

            if (password !== user.password) {
                return done(null, false, {"message": "登录失败！无效的密码！"});
            }

            return done(null, user);
        }
    ));

    //配置用户持久化以及读取用户
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    //配置路由
    app.post("/auth", passport.authenticate('local', {
        successRedirect: "/hello",
        failureRedirect: "/login",
        failureFlash: true
    }));

    //注册过滤器仓库
    store.use("/hello", {}).use("/admin*").use("/app*", {needLogin: true}).use("/demo1/hello");
    filter.store(store);

    //注册过滤策略
    filter.use(security.DemoHandler());
    //filter.use(security.LocalLoginHandler());
    filter.use(security.LocalRoleHandler());


    //注册中间件
    filter(app, {
        root: "/"
    });

    //注册业务路由
    router.get("/app/order", function (req, res) {
        res.send({
            orderid: "123457767867"
        })
    });

    router.get("/hello", function (req, res) {
        res.send({
            name: "tobi"
        });
    });

    router.get("/hello", function (req, res) {
        res.send({
            name: "tobi"
        });
    });

    app.use("/", router);

    return app;
}