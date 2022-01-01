import { noop, bind } from '../util/index'
// import { observe } from '../observer/index'

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

export function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}


export function initState(vm) {
    // 初始化vm的监视器列表
    vm._watchers = []

    const opts = vm.$options

    if (opts.props) {
        debugger
        initProps(vm, opts.props)
    }
    if (opts.methods) {
        initMethods(vm, opts.methods)
    }
    
    if (opts.data) {
        initData(vm)
    }
}

function initProps(vm, propsOptions) {
    const propsData = vm.$options.propsData || {}
    const props = vm._props = propsData

    // TODO
    for (const key in props) {
        if (!(key in vm)) {
            proxy(vm, `_props`, key)
        }
    }
}


function initData(vm) {
    let data = vm.$options.data

    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}

    const keys = Object.keys(data)

    let i = keys.length

    while (i--) {
        const key = keys[i]

        proxy(vm, `_data`, key)
    }

    // observe data
    // observe(data, true)/* asRootData */
}

export function getData(data, vm) {
    try {
        return data.call(vm, vm)
    } catch (e) {
        // TODO
        return {}
    } finally {

    }
}

function initMethods(vm, methods) {

    for (const key in methods) {
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
    }
}