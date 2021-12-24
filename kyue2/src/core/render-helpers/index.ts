import { toString } from '../../shared/util'
import { renderList } from './render-list'
import { createTextVNode, createEmptyVNode } from '../vdom/vnode'

export function installRenderHelpers(target: any) {
    target._s = toString
    target._l = renderList
    target._v = createTextVNode
    target._e = createEmptyVNode
}