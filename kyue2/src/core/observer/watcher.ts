import Dep, { pushTarget, popTarget } from './dep'
import { noop } from '../util/index'
import { isObject } from 'util'
import { queueWatcher } from './scheduler'

let uid = 0

/**
 * 一个监视程序解析表达式，收集依赖项，并在表达式的值更改时触发回调。
 * 这用于$watch() api和指令。
 */
export default class Watcher {
    vm: any;// TODO
    expression: string;
    cb: Function;
    id: number;
    deep: boolean;
    user: boolean;
    lazy: boolean;
    sync: boolean;
    dirty: boolean;
    active: boolean;
    deps: Array<Dep>;
    newDeps: Array<Dep>;
    depIds: any;// TODO
    newDepIds: any;// TODO
    before?: any | Function;// TODO
    getter: Function;
    value: any;
    
    constructor(
        vm: any,
        expOrFn: string | Function,
        cb: Function,
        options?: any,// TODO
        isRenderWatcher?: boolean
    ) {
        this.vm = vm

        if (isRenderWatcher) {
            vm._watcher = this
        }

        vm._watchers.push(this)

        if (options) {
            this.deep = !!options.deep
            this.user = !!options.user
            this.lazy = !!options.lazy
            this.sync = !!options.sync
            this.before = options.before
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }

        this.cb = cb
        this.id = ++uid
        this.active = true
        this.dirty = this.lazy
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()
        this.expression = process.env.NODE_ENV !== 'production' 
            ? expOrFn.toString()
            : ''

        // 为getter解析表达式
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else {
            // TODO
            this.getter = noop
        }

        // 此处源码有调整
        this.value = this.lazy ? undefined : this.get()
    }

    /**
     * 评估getter，然后重新收集依赖关系。
     */
    get() {
        pushTarget(this)

        let value
        const vm = this.vm

        try {
            // this.getter -> updateComponent
            value = this.getter.call(vm, vm)
        } catch (e) {
            if (this.user) {
                // TODO
            } else {
                throw e
            }
        } finally {
            // deep watch
            if (this.deep) {
                // TODO
            }

            popTarget()
            this.cleanupDeps()
        }

        return value
    }

    /**
     * 向此指令添加依赖项。
     * @param dep 
     */
    addDep(dep: Dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    /**
     * 清理依赖项集合。
     */
    cleanupDeps() {
        let i = this.deps.length

        while (i--) {
            const dep = this.deps[i]

            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }

        let tmp = this.depIds

        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    /**
     * Subscriber 接口
     * 依赖项更改时将调用
     */
    update() {
        if (this.lazy) {
            this.dirty = true
        } else if (this.sync) {
            // 同步watcher，TODO
            // this.run()
        } else {
            queueWatcher(this)
        }
    }

    /**
     * 调度作业接口。 
     * 由调度程序调用。
     */
    run() {
        if (this.active) {
            const value = this.get()

            if (
                value !== this.value || 
                /**
                 * 即使值相同，深度观察者和对象/数组上的观察者也应触发，
                 * 因为该值可能已突变。
                 */
                isObject(value) || 
                this.deep
            ) {
                // set new value
                const oldValue = this.value
                this.value = value

                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue)
                    } catch (e) {
                        // TODO
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue)
                }
            }
        }
    }
}
