import { isObject, hasOwn, isPlainObject, def } from '../util/index'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import Dep from './dep'


export let shouldObserve: boolean = true

/**
 * 附加到每个观察对象的Observer类。
 * 附加后，观察者将目标对象的属性转换为
 * 用于收集依赖关系并调度更新的getter/setter
 */
export class Observer {
    value: any;
    vmCount: number;

    constructor(value: any) {
        this.value = value
        this.vmCount = 0

        // 缓存当前实例到__ob__，并且不作枚举
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            // TODO
            protoAugment(value, arrayMethods)

            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    /**
     * 遍历所有属性并将它们转换为getter/setter。
     * 仅当值类型为Object时才应调用此方法
     * @param obj 
     */
    walk(obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }

    /**
     * 观察数组
     * @param items 
     */
    observeArray(items: Array<any>) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }

}

// helpers

/**
 * 通过截取原型链__proto__，来增强目标对象或数组
 * @param value 
 * @param asRootData 
 */
function protoAugment(target: any, src: Object) {
    target.__proto__ = src
}


/**
 * 尝试为某个值创建一个观察者实例，
 * 如果成功观察到该观察者，则返回新观察者，
 * 如果该值已经包含一个观察者，则返回现有观察者。
 * @param value 
 * @param asRootData 
 */
export function observe(value: any, asRootData?: boolean) {
    if (!isObject(value) || value instanceof VNode) {
        return
    }

    let ob: Observer | void

    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if (
        shouldObserve && 
        // !isServerRendering() && // TODO
        (Array.isArray(value) || isPlainObject(value)) && 
        Object.isExtensible(value) && 
        !value._isKyue
    ) {
        ob = new Observer(value)
    }

    if (asRootData && ob) {
        ob.vmCount++
    }

    return ob
}

/**
 * 在对象上定义反应性属性。
 * @param obj 
 * @param key 
 * @param val 
 * @param constructor 
 * @param shallow 
 */
export function defineReactive(
    obj: any,
    key: string,
    val?: any,
    customSetter?: Function,
    shallow?: boolean// 是否深度观测
) {
    const dep = new Dep()

    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }

    const getter = property && property.get
    const setter = property && property.set

    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }

    // 递归观测，当然前提val不是基础类型，observe中已作判断
    let childOb: any = !shallow && observe(val)

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            console.log('getter:', value)

            /***********************依赖收集*************************/ 
            if (Dep.target) {
                dep.depend()
            }
            /***********************依赖收集*************************/ 

            return value
        },
        set: function reactiveSetter(newVal) {
            console.log('setter:', newVal)
            const value = getter ? getter.call(obj) : val

            // 新旧的值没有发生改变
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }

            if (process.env.NODE_ENV !== 'production' && customSetter) {
                customSetter()
            }

            // 用于没有setter的访问器属性
            if (getter && !setter) return

            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }

            // 递归观测，当然前提val不是基础类型，observe中已作判断
            childOb = !shallow && observe(newVal)

            /***********************派发更新*************************/ 
            dep.notify()
            /***********************派发更新*************************/ 
        }
    })
}