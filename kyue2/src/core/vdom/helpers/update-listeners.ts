import { isUndef } from '../../util/index'


export function createFnInvoker(fns: Function | Array<Function>): Function {
    function invoker() {
        const fns = invoker.fns
        if (Array.isArray(fns)) {
            const cloned = fns.slice()
            for (let i = 0; i < cloned.length; i++) {
                cloned[i].apply(null, arguments)
            }
        } else {
            return fns.apply(null, arguments)
        }
    }
    invoker.fns = fns
    return invoker
}


const normalizeEvent = function(name: string) {
    return {
        name
    }
}


export function updateListeners (
    on: any,
    oldOn: any,
    add: Function,
    remove: Function,
    vm: any
) {
    let name, def, cur, old, event

    for (name in on) {
        def = cur = on[name]
        old = oldOn[name]

        event = normalizeEvent(name)

        if (isUndef(cur)) {
            // TODO
        } else if (isUndef(old)) {
            if (isUndef(cur.fns)) {
                cur = on[name] = createFnInvoker(cur)
            }
            add(event.name, cur)
        } else if (cur !== old) {
            old.fns = cur
            on[name] = old
        }
    }
    for (name in oldOn) {
        if (isUndef(on[name])) {
            event = normalizeEvent(name)
            remove(event.name, oldOn.name)
        }
    }
}