import { createComponentVnode } from './create-component'
import VNode from './vnode'

export function createElement(
    context, 
    tag, 
    data, 
    children
) {
    if (Array.isArray(data)) {
        children = data
        data = {}
    }

    return _createElement(context, tag, data, children)
}

export function _createElement(
    context, 
    tag, 
    data, 
    children
) {
    if (Array.isArray(children)) {
        children = simpleNormalizeChildren(children)
    } else if (children) {
        // TODO
        children = [children]
    }

    let vnode

    if (typeof tag === 'string') {
        // 普通元素
        console.log(`   【vnode vm${context._uid}】普通vnode创建`, tag)
        vnode = new VNode({
            tag, 
            data, 
            children,
            context
        })
    } else {
        // 组件
        console.log(`   【vnode vm${context._uid}】【组件vnode】创建`, tag.options.name)
        vnode = createComponentVnode({
            Ctor: tag, 
            data,
            children,
            context
        })
    }

    return vnode
}

export function simpleNormalizeChildren (children) {
    for (let i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
}