import { isDef } from "../util"
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
        if (typeof node.add !== 'function') {
            return
        }
        node.add(child)
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

function updateEl(vnode, parentElm) {
    const { tag, data, children } = vnode

    if (isDef(tag)) {
        if (tag === 'Layer') {
            parentElm.destroyChildren()
        }
        vnode.elm = nodeOps.createElement(tag, vnode)

        createChildren(vnode, children)

        insert(parentElm, vnode.elm)
    }
}

function updateChildren(vnode, children) {
    if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            updateEl(children[i], vnode.elm)
        }
    }
}

function sameVnode(a, b) {
    return a.tag === b.tag
}

function patchVnode(oldVnode, vnode) {
    const props = vnode.data && vnode.data.props || {}
    const oldProps = oldVnode.data && oldVnode.data.props || {}
    
    const children = vnode.children
    
    if (vnode.tag === 'Stage') {
        let elm = vnode.elm = oldVnode.elm

        for (let key in props) {
            if (props[key] !== oldProps[key]) {
                if (typeof elm[key] === 'function') {
                    elm[key](props[key])
                }
            }
        }
        updateChildren(vnode, children)
    } else {
        createElm(vnode, oldVnode)
    }
}

export function patch(oldVnode, vnode) {
    // console.log(oldVnode, vnode)
    debugger
    const isRealElement = oldVnode.nodeType === 1
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode)
    } else {
        createElm(vnode, oldVnode)
    }
    return vnode.elm
}

