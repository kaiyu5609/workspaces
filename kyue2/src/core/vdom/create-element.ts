import VNode, { createTextVNode } from './vnode'
import { createComponent } from './create-component'

import {
    isPrimitive, isTrue
} from '../util/index'


const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

/**
 * 包装函数，以提供更灵活的界面
 * 不会被流程大吼大叫
 * @param context 
 * @param tag 
 * @param data 
 * @param children 
 */
export function createElement(
    context: any, 
    tag: any, 
    data: any, 
    children: any,
    normalizationType: any,
    alwaysNormalize: boolean
) {
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }

    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
    }

    return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement(
    context: any, 
    tag?: any, 
    data?: any, 
    children?: any,
    normalizationType?: number
) {

    if (normalizationType === ALWAYS_NORMALIZE) {
        // 将children转化成Array<VNode>，如：文本节点也会转化成[VNode]
        children = normalizeChildren(children)
    } else if (normalizationType === SIMPLE_NORMALIZE) {
        // 将二维Array<VNode>拍成一维Array<VNode>
        children = simpleNormalizeChildren(children)
    }

    let vnode

    if (typeof tag === 'string') {
        // 普通节点
        vnode = new VNode(tag, data, children)
    } else {
        // 组件
        vnode = createComponent(tag, data, context, children)
    }

    return vnode
}


/**
 * TODO
 * @param children 
 */
function simpleNormalizeChildren(children: any) {
    return children
}

/**
 * TODO
 */
function normalizeChildren(children: any) {
    return isPrimitive(children) 
        ? [createTextVNode(children)]
        : Array.isArray(children) 
            ? children
            : undefined
}