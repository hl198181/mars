/*!
 * mars-security
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var express = require("express");
var passport = require("passport");
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var LocalStrategy = require("passport-local").Strategy;
var mars = require("../../lib");
var securityFilter = mars.SecurityFilter;
var path = require("path");
var pause = require('pause');

var routers = require("./routes/index");

var app = express();

//设置视图引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({resave: false, saveUninitialized: false, secret: "345435345"}));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//配置本地登录验证策略
passport.use("local", new LocalStrategy({
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
    failureFlash:true
}));

//注册过滤器处理器策略
securityFilter.use(new mars.SecurityFilter.LocalLoginHandler());
securityFilter.use(new mars.SecurityFilter.LocalRoleHandler());

//注册其他自定义安全过滤器,过滤器是顺序执行的
securityFilter.use(new mars.SecurityFilter.DemoHandler());

//注册过滤器配置策略
securityFilter.store(new mars.SecurityFilter.StoreFS({
    "path": path.join(__dirname, "./conf/filter.json")
}));
securityFilter.store(new mars.SecurityFilter.StoreFS({
    "path": path.join(__dirname, "./conf/filter1.json")
}));

//注册过滤器路由
app.use(securityFilter.filter(app));


//载入路由
app.use("/", routers);

app.get("/hello", function (req, res, next) {
    res.send("hello world! - hello");
});


app.use(function (err, req, res, next) {
    res.send(err.stack);
});

function sleep(milliSecond) {
    var startTime = new Date().getTime();
    console.log(startTime);
    while (new Date().getTime() <= milliSecond + startTime) {
    }
    console.log(new Date().getTime());
}

app.listen(3000);
console.log('Express started on port 3000');