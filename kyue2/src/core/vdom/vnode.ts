export default class VNode {
    tag: string | void;
    data: any;
    children: any;
    text: string;
    elm: any;
    context: any;
    componentOptions: any;

    constructor(
        tag?: string, 
        data?: any, 
        children?: any, 
        text?: string, 
        elm?: Element,
        context?: any,
        componentOptions?: any,
    ) {
        this.tag = tag
        this.data = data
        this.children = children

        this.text =  text
        this.elm = elm

        this.context = context
        this.componentOptions = componentOptions
    }
}

export const createEmptyVNode = (text: string = '') => {
    const node = new VNode()
    node.text = text
    return node
}

export function createTextVNode (val: string | number) {
    return new VNode(undefined, undefined, undefined, String(val))
}

export function cloneVNode (vnode: VNode): VNode {
    const cloned = new VNode()

    return cloned;
}