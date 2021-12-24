// 这些助手由于其明确性和功能内联性，因此可以在JS引擎中生成更好的VM代码。
export function isUndef (v) {
    return v === undefined || v === null
}

export function isDef (v) {
    return v !== undefined && v !== null
}

export function isTrue (v) {
    return v === true
}

export function isFalse (v) {
    return v === false
}

/**
 * 检查值是否为基础类型的
 * @param value 
 */
export function isPrimitive (value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

/**
 * 快速对象检查-当我们知道值是JSON兼容类型时，主要用于从原始值告诉对象
 * @param obj 
 */
export function isObject (obj) {// TODO mixed
    return obj !== null && typeof obj === 'object'
}

/**
 * 获取值的原始类型字符串，例如：[object Object]
 */
const _toString = Object.prototype.toString

export function toRawType (value) {
    return _toString.call(value).slice(8, -1)
}

export function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
}

export function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
}

export function isPromise (val) {
    return (
        isDef(val) && 
        typeof val.then === 'function' && 
        typeof val.catch === 'function'
    )
}

/**
 * 将值转换为实际呈现的字符串
 * @param val 
 */
export function toString(val) {
    return val == null 
        ? ''
        : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
            ? JSON.stringify(val, null, 2)
            : String(val)
}

/**
 * 将输入值转换为数字以保持持久性
 * 如果转换失败，则返回原始字符串
 * @param val 
 */
export function toNumber (val) {
    const n = parseFloat(val)
    return isNaN(n) ? val : n
}

/**
 * 从数组中删除项目
 * @param arr 
 * @param item 
 */
export function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
}

/**
 * 将类似数组的对象转换为真实数组
 * @param list 
 * @param start 
 */
export function toArray (list, start) {
    start = start || 0
    let i = list.length - start
    const ret = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

/**
 * 将属性混合到目标对象中
 * @param to 
 * @param from 
 */
export function extend (to, from) {// TODO Object
    for (const key in from) {
        to[key] = from[key]
    }
    return to
}


export function noop(a, b, c) {}

/**
 * 返回相同的值
 * @param _ 
 */
export const identity = (_) => _

/**
 * 确保一个函数仅被调用一次
 * @param fn 
 */
export function once (fn) {
    let called = false
    return function() {
        if (!called) {
            called = true
            fn.apply(this, arguments)
        }
    }
}

export const bind = function(fn, ctx) {
    return fn.bind(ctx)
}

/**
 * 如果已定义，则返回`value`，否则返回`defaultValue`
 * @param {*} value 
 * @param {*} defaultValue 
 */
 export function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value
}

/**
 * 注意：出于性能考虑，此方法应当只使用于未知的可循环类型或者在无密集代码中，
 * 否则，最好使用常规的`for()`循环并博阿村额外的函数调用
 * @param {*} loopable 
 * @param {*} fn 
 * @param {*} thisArg 
 * @param {*} reverse 
 */
 export function each(loopable, fn, thisArg, reverse) {
    let i, len, keys

    if (Array.isArray(loopable)) {
        len = loopable.length

        if (reverse) {
            for (i = len - 1; i >= 0; i--) {
                fn.call(thisArg, loopable[i], i)
            }
        } else {
            for (i = 0; i < len; i++) {
                fn.call(thisArg, loopable[i], i)
            }
        }
    } else if (isObject(loopable)) {
        keys = Object.keys(loopable)
        len = keys.length

        for (i = 0; i < len; i++) {
            fn.call(thisArg, loopable[keys[i]], keys[i])
        }
    }
}