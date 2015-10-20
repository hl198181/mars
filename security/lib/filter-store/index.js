/**
 * Created by leon on 15/10/20.
 */



var proto = module.exports = function () {

    var store = function () {
        return store._filters;
    }

    store._filters = {
        all: [],
        get: [],
        post: []
    };
    store.__proto__ = proto;

    return store;
}

/**
 * 注册过滤配置
 * @param options
 */
proto.use = function (path, options) {
    return this.push("all", path, options);
}

proto.get = function (path, options) {
    return this.push("get", path, options);
}

proto.post = function (path, options) {
    return this.push("post", path, options);
}

proto.push = function (method, path, options) {
    if (!path) {
        throw new Error('filter store must have a path');
    }

    var options = options || {};

    options.needLogin = options.needLogin || false;
    options.role = options.role || [];
    options["path"] = path;

    if (method === "all") {
        this._filters["all"].push(options);
    } else if (method === "get") {
        this._filters["get"].push(options);
    } else if (method === "post") {
        this._filters["post"].push(options);
    } else {
        throw new Error('unknow method:' + method);
    }

    return this;
}