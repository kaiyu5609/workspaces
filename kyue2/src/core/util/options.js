import { hasOwn } from '../../shared/util'
import {
    LIFECYCLE_HOOKS
} from 'shared/constants'

const strats = {}

/**
 * Default strategy
 */
const defaultStrat = function(parentVal, childVal) {
    return childVal === undefined
        ? parentVal
        : childVal
}

/**
 * 生命周期钩子合并成组数形式
 * @param {*} parentVal 
 * @param {*} childVal 
 */
function mergeHook(
    parentVal,
    childVal
) {
    return childVal 
        ? parentVal 
            ? parentVal.concat(childVal) 
            : Array.isArray(childVal)
                ? childVal 
                : [childVal] 
        : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})

strats.methods = function(
    parentVal,
    childVal
) {
    // console.log(parentVal, childVal)
    let res = childVal === undefined
    ? parentVal
    : parentVal 
        ? mergeOptions(parentVal, childVal)
        : childVal
    // console.log('res', res)
    return res
}


/**
 * 
 * @param parent 
 * @param child 
 * @param vm 
 */
export function mergeOptions(
    parent,
    child,
    vm
) {
    const options = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
}