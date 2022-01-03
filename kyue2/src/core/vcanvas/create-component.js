import { isUndef, warn, isObject, isDef, hasOwn } from '../util/index'
import VNode from './vnode'
import { activeInstance, updateChildComponent } from '../instance/lifecycle'

const componentVNodeHooks = {
    init(vnode) {
        const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance)
        console.log(`   【patch vm${vnode.context._uid}】【组件元素】将实例挂到【vnode.componentInstance】上`)
        console.log(`   【patch vm${vnode.context._uid}】【组件元素】的实例`, child)
        child.$mount(undefined)
    },
    prepatch(oldVnode, vnode) {
        var options = vnode.componentOptions
        var child = vnode.componentInstance = oldVnode.componentInstance
        
        updateChildComponent(
            child, 
            options.propsData, 
            options.listeners, 
            vnode, 
            options.children
        )
    },
    update(vnode) {
        const componentInstance = vnode.componentInstance
        // 子组件的更新，这里需要手动更新
        componentInstance && componentInstance.updateComponent()
    }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function extractPropsFromVNodeData(
    data,
    Ctor,
    tag
) {
    const propOptions = Ctor.options.props
    if (isUndef(propOptions)) {
        return
    }
    const res = {}
    const { attrs, props } = data
    if (isDef(attrs) || isDef(props)) {
        for (let key in propOptions) {
            checkProp(res, props, key, true) || 
            checkProp(res, attrs, key, false)
        }
    }
    return res
}

function checkProp(res, hash, key, preserve) {
    if (isDef(hash)) {
        if (hasOwn(hash, key)) {
            res[key] = hash[key]
            if (!preserve) {
                delete hash[key]
                return true
            }
        }
    }
    return false
}

export function createComponentVnode (options) {
    let {
        Ctor, 
        data, 
        children, 
        context,
        tag
    } = options

    if (isUndef(Ctor)) {
        return
    }

    const baseCtor = context.$options._base// Kyue

    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor)
    }

    if (typeof Ctor !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
            warn(`Invalid Component definition: ${String(Ctor)}`, context)
        }
        return
    }

    data = data || {}
    
    let propsData = extractPropsFromVNodeData(data, Ctor, tag)

    let listeners = {}

    intallComponentHooks(data)

    const name = Ctor.options.name || tag || 'app'// TODO
    const vnode = new VNode({
        tag: `kyue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, 
        context,
        componentOptions: { 
            Ctor, 
            propsData, 
            children,
            tag, 
            listeners
        }
    }) 
    
    return vnode
}

export function createComponentInstanceForVnode(
    vnode, 
    parent// 当前vm的实例
) {
    const options = {
        _isComponent: true,
        _parentVnode: vnode,// 组件vnode，即占位符vnode
        parent
    }

    console.log(`   【patch vm${vnode.context._uid}】【组件元素】执行实例化`, vnode.tag)
    return new vnode.componentOptions.Ctor(options)
}

function intallComponentHooks(data) {
    const hooks = data.hook || (data.hook = {})
    for (let i = 0; i < hooksToMerge.length; i++) {
        const key = hooksToMerge[i]
        hooks[key] = componentVNodeHooks[key]
    }
}