/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

var filter = require("../middleware/filter");

module.exports = function () {
    return {
        "filter": filter
}
}

