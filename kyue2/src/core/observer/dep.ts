import Watcher from './watcher'
import { remove } from '../util/index'

// 全局配置 TODO
const config: any = {
    async: true
}

let uid = 0

/**
 * 一个dep是一个可观察的对象，可以有多个订阅它的指令。
 * 建立数据与watcher之间的桥梁
 */
export default class Dep {
    static target?: Watcher;
    id: number;
    subs: Array<Watcher>;

    constructor() {
        this.id = uid++
        this.subs = []
    }

    addSub(sub: Watcher) {
        this.subs.push(sub)
    }

    removeSub(sub: Watcher) {
        remove(this.subs, sub)
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify() {
        // 首先稳定订户列表
        const subs = this.subs.slice()

        if (process.env.NODE_ENV !== 'production' && !config.async) {
            /**
             * 如果是同步，则不会在调度进程中对subs进行排序，
             * 而是需要立即对其进行排序，以确保它们以正确的顺序触发
             */
            subs.sort((a: any, b: any) => a.id - b.id)
        }

        let sub: any
        for (let i = 0, l = subs.length; i < l; i++) {
            sub = subs[i]
            sub.update()
        }
    }
}

/**
 * 当前正在评估的目标观察者。
 * 这是全局唯一的，因为一次只有一个观察者可以评估
 */
Dep.target = null
const targetStack: Array<Watcher> = []

export function pushTarget(target?: Watcher) {
    targetStack.push(target)
    Dep.target = target
}

export function popTarget() {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}