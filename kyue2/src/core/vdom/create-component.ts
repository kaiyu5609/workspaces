import { isUndef, warn, isObject } from '../util/index'
import VNode from './vnode'
import { activeInstance } from '../instance/lifecycle'


const componentVNodeHooks: any = {
    init(vnode: any, hydrating: boolean) {
        const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance)
        child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    },
    prepatch(oldVnode: any, vnode: any) {

    },
    insert(vnode: any) {

    },
    destroy(vnode: any) {

    }
}

const hooksToMerge = Object.keys(componentVNodeHooks)


export function createComponent (
    Ctor: any | void,
    data?: any,
    context?: any,
    children?: any,
    tag?: string
) {

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
    
    let propsData = {}

    let listeners = {}

    intallComponentHooks(data)

    const name = Ctor.options.name || tag || 'app'// TODO
    const vnode = new VNode(
        `kyue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, context,
        { Ctor, propsData, listeners, tag, children }
    ) 
    
    return vnode
}

export function createComponentInstanceForVnode(
    vnode: any, 
    parent: any// 当前vm的实例
) {
    const options: any = {
        _isComponent: true,
        _parentVnode: vnode,// 组件vnode，即占位符vnode
        parent
    }

    return new vnode.componentOptions.Ctor(options)
}

function intallComponentHooks(data: any) {
    const hooks = data.hook || (data.hook = {})
    for (let i = 0; i < hooksToMerge.length; i++) {
        const key = hooksToMerge[i]
        const existing = hooks[key]
        const toMerge = componentVNodeHooks[key]
        if (existing !== toMerge && !(existing && existing._merged)) {
            hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
        }
    }
}

function mergeHook(f1: any, f2: any): Function {
    const merged = (a: any, b: any) => {
        f1(a, b)
        f2(a, b)
    }
    merged._merged = true
    return merged
}