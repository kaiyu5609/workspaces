
export function genHandlers(
    events: any,
    isNative: boolean
): string {

    let res = isNative ? 'nativeOn:{' : 'on:{'

    for (const name in events) {
        res += `"${name}":${getHandler(name, events[name])},`
    }

    return res.slice(0, -1) + '}'
}


const fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/
const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/

function getHandler(
    name: string,
    handler: any
): string {
    if (!handler) {
        return 'function(){}'
    }

    if (Array.isArray(handler)) {
        return `[${handler.map(handler => getHandler(name, handler)).join(',')}]`
    }

    const isMethodPath = simplePathRE.test(handler.value)
    const isFunctionExpression = fnExpRE.test(handler.value)

    if (!handler.modifiers) {
        if (isMethodPath || isFunctionExpression) {
            return handler.value
        }

        return `function($event){${handler.value}}`
    } else {
        // TODO


        

    }
}