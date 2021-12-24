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
    }

    let vnode

    if (typeof tag === 'string') {
        vnode = new VNode(tag, data, children)
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