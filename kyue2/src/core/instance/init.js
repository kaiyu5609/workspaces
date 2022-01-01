import { initLifecycle, callHook } from './lifecycle'
import { initState } from './state'
import { initRender } from './render'
import { mergeOptions } from '../util/index'

let uid = 0

export function initMixin(Kyue) {
    Kyue.prototype._init = function(options) {
        const vm = this
        
        vm._uid = uid++
        
        console.log(`【vm${vm._uid}】图形组件实例化，vm._init()`)

        vm._isKyue = true

        options = options || {}

        if (options._isComponent) {
            // 优化内部组件实例化，因为动态选项合并非常慢，并且没有内部组件选项需要特殊处理。
            initInternalComponent(vm, options)
        } else {
            vm.$options = mergeOptions(
                resolveConstructorOptions(vm.constructor),
                options,
                vm
            )
        }
        
        vm._self = vm
        /**
         * 1、noop
         */
        initLifecycle(vm)

        /**
         * initEvents   TODO
         */

        /**
         * 1、给实例添加$createElement方法
         */
        initRender(vm)

        callHook(vm, 'beforeCreate')

        /**
         * initInjections   TODO
         */
        
        /**
         * 1、给实例添加options.data中数据的代理 
         */ 
        initState(vm)

        /**
         * initProvide  TODO
         */

        callHook(vm, 'created')

        if (vm.$options.el) {
            // 返回的是 vm
            vm.$mount(vm.$options.el)
        }

        // me
        callHook(vm, 'mounted')
    }
}

export function initInternalComponent(vm, options) {
    const opts = vm.$options = Object.create(vm.constructor.options)
    const parentVnode = options._parentVnode
    opts.parent = options.parent
    opts._parentVnode = parentVnode

    const vnodeComponentOptions = parentVnode.componentOptions
    opts.propsData = vnodeComponentOptions.propsData
    opts._parentListeners = vnodeComponentOptions.listeners
    opts._renderChildren = vnodeComponentOptions.children
    opts._componentTag = vnodeComponentOptions.tag

    if (options.render) {
        opts.render = options.render
    }
}

export function resolveConstructorOptions(Ctor) {
    let options = Ctor.options

    // TODO

    return options
}