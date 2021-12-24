export function getAndRemoveAttr(
    el: any,
    name: string,
    removeFromMap?: boolean
) {
    let val

    if ((val = el.attrsMap[name]) != null) {
        const list = el.attrsList

        for (let i = 0, l = list.length; i < l; i++) {
            if (list[i].name === name) {
                list.splice(i, 1)
                break
            }
        }
    }
    if (removeFromMap) {
        delete el.attrsMap[name]
    }
    return val
}

export function getBindingAttr(
    el: any,
    name: string,
    getStatic?: boolean
): string | void {
    const dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'k-bind:' + name)

    if (dynamicValue != null) {
        return dynamicValue
    } else if (getStatic !== false) {
        const staticValue = getAndRemoveAttr(el, name)
        if (staticValue != null) {
            return JSON.stringify(staticValue)
        }
    }
}


// TODO
export function addHandler(
    el: any,
    name: string,
    value: string,
    range: Array<any>
) {

    let events = el.events || (el.events = {})

    const newHandler: any = {
        value: value.trim()
    }

    const handlers = events[name]

    // TODO
    if (Array.isArray(handlers)) {
        handlers.push(newHandler)
    } else if (handlers) {
        events[name] = [handlers, newHandler]
    } else {
        events[name] = newHandler
    }

    el.plain = false
}


// TODO
export function pluckModuleFunction(
    modules?: Array<any>,
    key?: string 
): Array<any> {
    return modules 
        ? modules.map(m => m[key]).filter(_ => _)
        : []
}
