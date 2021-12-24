import { isUndef } from '../../shared/util'
import { updateListeners } from '../../core/vdom/helpers/index'


let target: any


function add(
    event: string,
    handler: Function
) {
    // TODO
    target.addEventListener(event, handler, false)
}

function remove(
    event: string,
    handler: Function
) {
    // TODO
    target.removeEventListener(event, handler, false)
}


function updateDOMListeners(
    oldVnode: any,
    vnode: any
) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return
    }
    const on = vnode.data.on || {}
    const oldOn = oldVnode.data.on || {}

    target = vnode.elm

    // TODO

    updateListeners(on, oldOn, add, remove, vnode.context)

    target = undefined
}

export default {
    create: updateDOMListeners,
    update: updateDOMListeners
}

