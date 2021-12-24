import VNode from './vnode'
import { isPrimitive, isDef, isTrue, isUndef } from '../util/index'
import events from '../../runtime/modules/events'

export const emptyNode = new VNode('', {}, [])


function emptyNodeAt(elm: Element) {
    return new VNode(elm.tagName.toLocaleLowerCase(), {}, [], undefined, elm)
}

// TODO
function sameVnode(a: any, b: any) {
    return (
        a.key === b.key && (
            a.tag === b.tag && 
            isDef(a.data) === isDef(b.data) 
        )
    )
}

function createElm(vnode: any, insertedVnodeQueue: [], parentElm?: Element, refElm?: Element) {
    console.log('createElm:', vnode)

    /****组件的创建****/
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
    }

    /****普通节点的创建****/
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag

    if (isDef(tag)) {
        vnode.elm = document.createElement(tag)
    
        createChildren(vnode, children, insertedVnodeQueue)
    
        if (data) {
            setData(vnode, data)
            invokeCreateHooks(vnode, insertedVnodeQueue)
        }

        insert(parentElm, vnode.elm, refElm)
    } else if (isTrue(vnode.isComment)) {
        // 注释节点

    } else {
        // 文本节点
        vnode.elm = document.createTextNode(vnode.text)
        insert(parentElm, vnode.elm, refElm)
    }

}

function createChildren(vnode: VNode, children: [], insertedVnodeQueue: []) {
    if (Array.isArray(children)) {
        for (let i = 0; i < children.length; ++i) {
            createElm(children[i], insertedVnodeQueue, vnode.elm, null)
        }
    } else if (isPrimitive(vnode.text)) {
        let text = String(vnode.text || vnode.children)
        vnode.elm.appendChild(document.createTextNode(text))
    }
}

function setData(vnode: any, data: any) {
    for (var key in data) {
        if (key == 'attrs') {
            for (var attr in data[key]) {
                vnode.elm.setAttribute(attr, data[key][attr])
            }
        }
    }
}

function insert(parent: Element, elm: Element, ref: Element) {
    if (parent) {
        if (ref) {
            if (ref.parentNode === parent) {
                parent.insertBefore(elm, ref)
            }
        } else {
            parent.appendChild(elm)
        }
    }
}

function addVnodes(
    parentElm: Element, 
    refElm: Element, 
    vnodes: Array<VNode>, 
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: []
) {
    for (; startIdx <= endIdx; ++startIdx) {
        createElm(
            vnodes[startIdx], 
            insertedVnodeQueue,
            refElm
        )
    }
}

function removeVnodes(vnodes: any, startIdx: number, endIdx: number) {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx]
        if (isDef(ch)) {
            if (isDef(ch.tag)) {
                // TODO
                removeNode(ch.elm)
            } else {// Text node
                removeNode(ch.elm)
            }
        }
    }
}

function removeNode(el: Element) {
    const parent = el.parentNode

    if (isDef(parent)) {
        parent.removeChild(el)
    }
}



function isPatchable(vnode: any) {
    while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode
    }
    return isDef(vnode.tag)
}

function updateChildren(parentElm: Element, oldCh: any, newCh: any, insertedVnodeQueue: [], removeOnly?: boolean) {
    let oldStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]

    let newStartIdx = 0
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]

    let refElm

    /**
     * TODO
     * 删掉
     */
    let index = 0
    const COUNT = 100

    const canMove = !removeOnly

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        index++

        if (index > COUNT) {
            break
        }

        if (isUndef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]
        } else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx]
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            // 两个新旧开始 相同的节点
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            // TODO


        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            // TODO


        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            // TODO


        } else {
            /**
             * 重复利用子节点
             * TODO
             */
        }
    }

    /**
     * 新增的节点
     */
    if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
}

function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: [],
    removeOnly?: boolean
) {
    if (oldVnode === vnode) {
        return
    }

    const elm = vnode.elm = oldVnode.elm


    let i
    const data = vnode.data

    /**
     * 执行钩子函数
     */
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children

    /*******************************/
    /**
     * 执行update的钩子函数
     * TODO
     */

    // 事件从新绑定
    if (isDef(data) && isPatchable(vnode)) {
        setTimeout(() => {
            events.update(oldVnode, vnode)
        }, 10)
    }
    /*******************************/


    if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        } else if (isDef(ch)) {
            // TODO


        } else if (isDef(oldCh)) {
            // TODO


        } else if (isDef(oldVnode.text)) {
            elm.textContent = ''
        }
    } else if (oldVnode.text !== vnode.text) {
        elm.textContent = vnode.text
    }

    /**
     * 执行钩子函数
     */
    if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
}

function invokeCreateHooks(vnode: any, insertedVnodeQueue: []) {
    events.create(emptyNode, vnode)
}


export function patch(oldVnode: any, vnode: any, hydrating?: boolean, removeOnyl?: boolean) {
    let isInitialPatch = false
    const insertedVnodeQueue: [] = []

    
    if (isUndef(oldVnode)) {
        // 组件的 mount，生成一个新的root元素
        isInitialPatch = true
        createElm(vnode, insertedVnodeQueue)
    } else {
        const isRealElement = isDef(oldVnode.nodeType)

        if (!isRealElement && sameVnode(oldVnode, vnode)) {
            console.log('Update:', 'patchVnode')
            patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnyl)
            console.log('----------Updated----------')
        } else {
            if (isRealElement) {
                oldVnode = emptyNodeAt(oldVnode)
            }

            const oldElm = oldVnode.elm
            const parentElm = oldElm.parentNode
    
            createElm(
                vnode,
                insertedVnodeQueue,
                oldElm._leaveCb ? null : parentElm,
                oldElm.nextSibling
            )

            if (parentElm) {
                removeVnodes([oldVnode], 0, 0)
            }
        }
    }

    return vnode.elm
}


function createComponent(vnode: any, insertedVnodeQueue: [], parentElm: any, refElm: any) {
    let i = vnode.data
    if (isDef(i)) {

        if (isDef(i = i.hook) && isDef(i = i.init)) {
            i(vnode, false)/* hydrating */
        }

        if (isDef(vnode.componentInstance)) {
            initComponent(vnode, insertedVnodeQueue)
            insert(parentElm, vnode.elm, refElm)
            return true
        }
    }
}

function initComponent(vnode: any, insertedVnodeQueue: []) {
    vnode.elm = vnode.componentInstance.$el

}