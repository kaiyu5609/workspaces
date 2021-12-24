import { pluckModuleFunction } from '../helpers'
import { genHandlers } from './events'

class CodegenState {
    options: any;
    dataGenFns: Array<any>;

    constructor(options: any) {
        this.options = options

        this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    }
}



export function generate(
    ast: any,
    options: any
) {
    const state = new CodegenState(options)
    const code = ast ? genElement(ast, state) : '_c("dvi")'

    return {
        render: `with(this){return ${code}}`
    }
}

export function genElement(
    el: any,
    state: any
): string {

    if (el.for && !el.forProcessed) {
        return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
        return genIf(el, state)
    } else {
        let code

        let data = genData(el, state)
        const children = genChildren(el, state, true)
        
        code = `_c('${el.tag}'${
            data ? `,${data}` : ''// data
        }${
            children ? `,${children}` : ''// children
        })`

        return code
    }
}




export function genIf(
    el: any,
    state: any
) {
    el.ifProcessed = true
    return genIfConditions(el.ifConditions.slice(), state)
}

function genIfConditions(
    conditions: any,
    state: any
): string {
    if (!conditions.length) {
        return '_e()'
    }

    const condition = conditions.shift()

    if (condition.exp) {
        return `(${condition.exp})?${
            genTernaryExp(condition.block)
        }:${
            genIfConditions(conditions, state)
        }`
    } else {
        return `${genTernaryExp(condition.block)}`
    }

    function genTernaryExp(el: any) {
        // TODO
        return genElement(el, state)
    } 
}


export function genData(el: any, state: any): string {
    let data = '{'

    
    // 模块数据生成方法
    for (let i = 0; i < state.dataGenFns.length; i++) {
        data += state.dataGenFns[i](el)
    }

    // event hanlders
    if (el.events) {
        data += `${genHandlers(el.events, false)},`
    }

    data = data.replace(/,$/, '') + '}'

    return data
}

export function genChildren(
    el: any,
    state: any,
    checkSkip?: boolean
): string | void {
    const children: Array<any> = el.children

    if (children.length) {
        const el: any = children[0]

        // TODO
        if (children.length === 1 && el.for) {
            const normalizationType = checkSkip 
                ? `,0` : ``
            return `${genElement(el, state)}${normalizationType}`
        }

        // TODOs
        const normalizationType = getNormalizationType(children, false)
        const gen = genNode

        return `[${children.map(c => gen(c, state)).join(',')}]${
            normalizationType ? `,${normalizationType}` : ''
        }`
    }
}

function getNormalizationType(
    children: Array<any>,
    maybeComponent: any
): number {
    // TODO
    return 0
}

function genNode(node: any, state: any): string {
    // TODO
    if (node.type === 1) {
        return genElement(node, state)
    } else {
        return genText(node)
    }
}

export function genText(text: any): string {
    return `_v(${text.type === 2 
        ? text.expression
        : JSON.stringify(text.text)
    })`
}




export function genFor(
    el: any,
    state: any
): string {
    const exp = el.for
    const alias = el.alias
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''

    el.forProcessed = true

    return `_l((${exp}),function(${alias}${iterator1}${iterator2}){`+
        `return ${genElement(el, state)}`+
    `})`

}