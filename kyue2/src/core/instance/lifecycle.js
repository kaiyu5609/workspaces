export function lifecycleMixin(Kyue) {
    Kyue.prototype._update = function(vnode) {
        const vm = this
        const prevVnode = vm._vnode
        vm._vnode = vnode

        if (!prevVnode) {
            vm.$el = vm.__patch__(vm.$el, vnode)
        } else {
            vm.$el = vm.__patch__(prevVnode, vnode)
        }
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