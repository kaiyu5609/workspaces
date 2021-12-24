import VNode from '../vdom/vnode'
import { isDef } from '../util/index'


// k-for
export function renderList(
    val: any,
    render: Function
): Array<VNode> | void {
    let ret: any, i, l

    if (Array.isArray(val) || typeof val === 'string') {
        ret = new Array(val.length)
        for (i = 0, l = val.length; i < l; i++) {
            ret[i] = render(val[i], i)
        }
    }
    // TODO
    

    if (!isDef(ret)) {
        return []
    }

    ret._isKyList = true

    return ret
}