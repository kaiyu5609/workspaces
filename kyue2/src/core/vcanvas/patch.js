import { isDef, noop } from "../util"
import Konva from "konva"

const nodeOps = {
    createElement(tag, vnode) {
        let props = {}
        if (vnode.data && vnode.data.props) {
            props = vnode.data.props
        }
        const elm = new Konva[tag](props)
        return elm
    },
    appendChild(node, child) {
        /**
         * node为DOM节点时，没有add方法
         */
        if (typeof node.add === 'function') {
            node.add(child)
        }
    }
}

function sameVnode(a, b) {
    return a.tag === b.tag
}

function patchVnodeProps(elm, props, oldProps) {
    let updatedProps = {}
    let willUpdate = false

    for (let key in oldProps) {
        let toRemove = !props.hasOwnProperty(key)
        if (toRemove) {
            elm.setAttr(key, undefined)
        }
    }
    for (let key in props) {
        let toAdd = props[key] !== oldProps[key]
        if (toAdd) {
            willUpdate = true
            updatedProps[key] = props[key]
        }
    }
    if (willUpdate) {
        elm.setAttrs(updatedProps)
    }
}

function createElm(vnode, parentElm) {
    const { tag, data, children } = vnode

    if (isDef(tag)) {
        vnode.elm = nodeOps.createElement(tag, vnode)

        createChildren(vnode, children)

        insert(parentElm, vnode.elm)
    }
}

function createChildren(vnode, children) {
    if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            createElm(children[i], vnode.elm)
        }
    }
}

function insert(parent, elm) {
    if (isDef(parent)) {
        nodeOps.appendChild(parent, elm)
    }
}

function addVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], parentElm)
    }
}

function removeVnodes(vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx]
        if (isDef(ch)) {
            if (isDef(ch.tag)) {
                removeNode(ch.elm)
            }
        }
    }
}
function removeNode(el) {
    if (typeof el.destroy === 'function') {
        el.destroy()
    }
}

function updateChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]

    let newStartIdx = 0
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]

    // 更新
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }
    }

    // 新增
    if (oldStartIdx > oldEndIdx) {
        addVnodes(parentElm, newCh, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
}



function patchVnode(oldVnode, vnode) {
    if (oldVnode === vnode) {
        return
    }

    const elm = vnode.elm = oldVnode.elm
    const props = vnode.data && vnode.data.props || {}
    const oldProps = oldVnode.data && oldVnode.data.props || {}
    const oldCh = oldVnode.children
    const ch = vnode.children

    if (sameVnode(vnode, oldVnode)) {
        patchVnodeProps(elm, props, oldProps)
    }

    if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
            updateChildren(elm, oldCh, ch)
        }
    }
}

export function patch(oldVnode, vnode) {
    /**
     * 初始化，oldVnode为DOM节点，nodeType为1
     * 更新阶段，oldVnode为虚拟vnode
     */

    // console.log(oldVnode, vnode)

    const isRealElement = oldVnode.nodeType === 1
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode)
    } else {
        createElm(vnode, oldVnode)
    }
    return vnode.elm
}

