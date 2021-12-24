export default class VNode {
    constructor(
        tag, 
        data, 
        children, 
        elm,
        context
    ) {
        this.tag = tag
        this.data = data
        this.children = children
        this.elm = elm
        this.context = context
    }
}

export function cloneVNode (vnode) {
    const cloned = new VNode()
    return cloned
}