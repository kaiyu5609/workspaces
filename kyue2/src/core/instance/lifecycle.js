export let activeInstance = null

export function lifecycleMixin(Kyue) {
    Kyue.prototype._update = function(vnode) {
        const vm = this
        console.log(`【vm${vm._uid}】图形组件执行更新，vm._update()`)
        const prevVnode = vm._vnode
        const prevActiveInstance = activeInstance
        activeInstance = vm

        vm._vnode = vnode

        if (!prevVnode) {
            vm.$el = vm.__patch__(vm.$el, vnode, vm)
        } else {
            vm.$el = vm.__patch__(prevVnode, vnode, vm)
        }
        activeInstance = prevActiveInstance
        console.log(`【vm${vm._uid}】将生成的元素挂到实例的【$el】上，`, 'vm.$el =', vm.$el)
        console.log(`【vm${vm._uid}】图形组件完成更新，vm._update()`)
    }
}

export function initLifecycle(vm) {
    const options = vm.$options

    // TODO
    let parent = options.parent
    if (parent) {
        parent.$children.push(vm)
    }

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    vm.$children = []
    // TODO
}

export function mountComponent(vm, el) {
    vm.$el = el

    let updateComponent = () => {
        vm._update(vm._render())
    }

    // vm上其实没有该方法 TODO
    vm.updateComponent = updateComponent

    updateComponent()

    return vm
}


export function updateChildComponent(
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
) {
    vm.$options._parentVnode = parentVnode
    vm.$vnode = parentVnode

    if (vm._vnode) {
        vm._vnode.parent = parentVnode
    }

    if (propsData && vm.$options.props) {
        const props = vm._props
        for (let key in props) {
            props[key] = propsData[key]
        }
        vm.$options.propsData = propsData
    }

    // TODO

}

export function callHook(vm, hook) {
    let handlers = vm.$options[hook]
    if (handlers) {
        // me
        handlers = Array.isArray(handlers) ? handlers : [handlers]

        for (let i = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm)
            } catch (e) {
                console.error(e)
            }
        }
    }
}