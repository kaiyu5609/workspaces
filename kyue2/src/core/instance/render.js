import { createElement } from '../vcanvas/create-element'

export function renderMixin(Kyue) {
    Kyue.prototype._render = function() {
        const vm = this
        const { render, _parentVnode } = vm.$options
        console.log(`【vm${vm._uid}】图形组件生成渲染vnode，vm._render()`)

        // 占位符vnode，初始化 _parentVnode 为 undefined
        vm.$vnode = _parentVnode

        let vnode
        try {
            vnode = render.call(vm, vm.$createElement)
        } catch (e) {
            console.error(e)
        } finally {

        }

        // 占位符vnode是渲染vnode的父级
        vnode.parent = _parentVnode
        console.log(`【vm${vm._uid}】图形组件生成的渲染vnode:`, vnode)
        return vnode
    }
}

export function initRender(vm) {
    // TODO
    vm.$createElement = (a, b, c) => createElement(vm, a, b, c)
}

