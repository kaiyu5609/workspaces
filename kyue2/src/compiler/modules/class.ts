import {
    getAndRemoveAttr,
    getBindingAttr
} from '../helpers'

function transformNode(el: any, options: any) {
    const staticClass = getAndRemoveAttr(el, 'class')

    if (staticClass) {
        el.staticClass = JSON.stringify(staticClass)
    }

    const classBinding = getBindingAttr(el, 'class', false)
    if (classBinding) {
        el.classBinding = classBinding
    }
}

function genData(el: any): string {
    // class
    let data = ''
    if (el.staticClass) {
        data += `staticClass:${el.staticClass},`
    }
    if (el.classBinding) {
        data += `class:${el.classBinding},`
    }
    return data
}

export default {
    staticKeys: ['staticClass'],
    transformNode,
    genData
}