
import { parseHTML } from './html-parser'
import { getAndRemoveAttr, addHandler, pluckModuleFunction } from '../helpers'
import { extend } from '../../shared/util'
import { parseText } from './text-parser'



export const onRE = /^@|^k-on:/
// TODO
export const dirRE = /^k-|^@|^:/

export const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
const stripParensRE = /^\(|\)$/g


let delimiters: any

let transforms: any






export function createASTElement(
    tag: string,
    attrs: Array<any>,
    parent?: any
): any {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        // TODO
        parent,
        children: []
    }
}


/**
 * 将 HTML string 转换成 AST。
 * @param template 
 * @param options 
 */
export function parse (
    template: string,
    options: any
) {

    transforms = pluckModuleFunction(options.modules, 'transformNode')

    const stack: Array<any> = []

    let root: any
    let currentParent: any


    function closeElement(element: any) {
        // console.log('element', element)
    
        if (!element.processed) {
            element = processElement(element, options)
        }

        if (currentParent && !element.forbidden) {
            currentParent.children.push(element)
            element.parent = currentParent
        }

    }



    parseHTML(template, Object.assign({}, options, {
        start(tag: string, attrs: [], unary: boolean, start: number, end: number) {
            let element: any = createASTElement(tag, attrs, currentParent)

            if (!element.processed) {
                // 结构指令

                processFor(element)
                processIf(element)
            }

            if (!root) {
                root = element
            }

            if (!unary) {
                currentParent = element
                stack.push(element)
            } else {
                
            }
        },
        end(tag: string, start: number, end: number) {
            const element = stack[stack.length - 1]

            stack.length -= 1
            currentParent = stack[stack.length - 1]

            closeElement(element)
        },
        chars(text: string, start: number, end: number) {
            if (!currentParent) {
                return
            }

            const children = currentParent.children

            if (text) {

                let res, child: any

                if (text !== '' && (res = parseText(text, delimiters))) {
                    child = {
                        type: 2,
                        expression: res.expression,
                        tokens: res.tokens,
                        text
                    }
                }

                if (child) {
                    children.push(child)
                }
            }
        }
    }))

    return root
}



function makeAttrsMap(attrs: Array<any>) {
    const map: any = {}

    for (let i = 0, l = attrs.length; i < l; i++) {
        // TODO
        map[attrs[i].name] = attrs[i].value
    }

    return map
}


function processFor(el: any) {
    let exp

    if ((exp = getAndRemoveAttr(el, 'k-for'))) {
        const res = parseFor(exp)

        if (res) {
            extend(el, res)
        } else {
            // warn TODO
        }
    }
}

function parseFor(exp: string) {
    const inMatch = exp.match(forAliasRE)

    if (!inMatch) return

    const res:any = {}

    res.for = inMatch[2].trim()

    const alias = inMatch[1].trim().replace(stripParensRE, '')
    const iteratorMatch = alias.match(forIteratorRE)

    if (iteratorMatch) {
        res.alias = alias.replace(forIteratorRE, '').trim()
        res.iterator1 = iteratorMatch[1].trim()
        if (iteratorMatch[2]) {
            res.iterator2 = iteratorMatch[2].trim()
        }
    } else {
        res.alias = alias
    }
    return res
}

function processIf(el: any) {
    const exp = getAndRemoveAttr(el, 'k-if')

    if (exp) {
        el.if = exp
        addIfCondition(el, {
            exp: exp,
            block: el
        })
    } else {
        if (getAndRemoveAttr(el, 'k-else') != null) {
            el.else = true
        }
        const elseif = getAndRemoveAttr(el, 'k-else-if')

        if (elseif) {
            el.elseif = elseif
        }
    }
}

export function addIfCondition(el: any, condition: any) {
    if (!el.ifConditions) {
        el.ifConditions = []
    }
    el.ifConditions.push(condition)
}


export function processElement(
    element: any,
    options?: any
) {

    // TODO

    for (let i = 0; i < transforms.length; i++) {
        element = transforms[i](element, options) || element
    }

    processAttrs(element)

    return element
}


function processAttrs(el: any) {
    const list = el.attrsList
    let i, l, name, rawName, value

    for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name
        value = list[i].value

        if (dirRE.test(name)) {
            el.hasBindings = true

            // 阻止冒泡 TODO


            if (onRE.test(name)) {
                // k-on 
                name = name.replace(onRE, '')

                addHandler(el, name, value, list[i])
            }


        }
    }
}