import { createElement } from '../vcanvas/create-element'

export function renderMixin(Kyue) {
    Kyue.prototype._render = function() {
        const vm = this
        const { render } = vm.$options

        let vnode
        try {
            vnode = render.call(vm, vm.$createElement)
        } catch (e) {
            console.error(e)
        } finally {

        }

        console.log('渲染vnode', vnode)

        return vnode
    }
}

export function initRender(vm) {
    // TODO
    vm.$createElement = (a, b, c) => createElement(vm, a, b, c)
}

