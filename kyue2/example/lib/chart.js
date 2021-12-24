
/**
 * chart v1.0.0
 * (c) 2019 kaiyu5609
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
    typeof define === 'function' && define.amd ? define(['jquery'], factory) :
    (global = global || self, (global.cn = global.cn || {}, global.cn.szse = global.cn.szse || {}, global.cn.szse.chart = factory(global.jQuery)));
}(this, function (jQuery) { 'use strict';

    jQuery = jQuery && jQuery.hasOwnProperty('default') ? jQuery['default'] : jQuery;

    function isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }

    function isPromise(val) {
        return val && typeof val.then === 'function'
    }

    var utils = {
        isObject,
        isPromise
    };
    var utils_1 = utils.isObject;

    console.log(jQuery.isArray([]));
    function test() {
    }
    function test3() {
    }
    var test4 = (x, y) => {
        if (utils_1(x)) {
            return x * y;
        }
        return x / y;
    };
    console.log(22222266777776);
    var index = {
        version: '1.0.0',
        test,
        test3,
        test4
    };

    return index;

}));
