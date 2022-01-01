export default class VNode {
    constructor(options) {
        const {
            tag, 
            data, 
            children, 
            elm,
            context,
            componentOptions
        } = options
        
        this.tag = tag
        this.data = data
        this.children = children
        this.elm = elm
        this.context = context
        this.componentOptions = componentOptions
    }
}

export function cloneVNode (vnode) {
    const cloned = new VNode()
    return cloned
}