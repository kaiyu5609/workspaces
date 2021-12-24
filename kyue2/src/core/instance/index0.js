// @ts-nocheck

import { warn, query, mergeOptions } from '../util/index'
import { initMixin } from './init'
import { lifecycleMixin, mountComponent } from './lifecycle'
import { renderMixin } from './render'
import { patch } from '../vdom/patch'

/**
 * compile
 * TODO
 */
import { compileToFunctions } from '../../compiler/index'



function Kyue(options) {
    if (process.env.NODE_ENV !== 'production' && !(this instanceof Kyue)) {
        warn('Kyue is a constructor and should be called with the `new` keyword')
    }
    
    this._init(options)
}

Kyue.prototype.$mount = function(el, hydrating) {
    // compile TODO
    const options = this.$options
    
    if (!options.render) {
        let template = options.template

        if (template) {
            // TODO


        } else if (el) {
            // TODO
            // template = getOuterHTML(el)
        }

        if (template) {
            const { render } = compileToFunctions(template, {

            })
            options.render = render
        }
    }
    

    el = el && query(el)
    return mountComponent(this, el, hydrating)
}

Kyue.prototype.__patch__ = patch

/**
 * 1、给实例添加_init方法
 * 2、组件调用 $mount 方法进行挂载
 */ 
initMixin(Kyue)
/**
 * 1、给实例添加_update方法 
 *  
 */ 
lifecycleMixin(Kyue)
/**
 * 1、给实例添加_render方法
 *  该方法生成虚拟DOM：vnode
 */ 
renderMixin(Kyue)


/**
 * 全局API
 * 书写位置TODO
 */ 
Kyue.options = Object.create(null)
Kyue.options._base = Kyue

Kyue.cid = 0
let cid = 1

Kyue.extend = function(extendOptions) {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name

    const Sub = function KyueComponent(options) {
        this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    
    Sub.options = mergeOptions(
        Super.options,
        extendOptions
    )
    Sub.super = Super

    Sub.extend = Super.extend

    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    
    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
}


export default Kyue