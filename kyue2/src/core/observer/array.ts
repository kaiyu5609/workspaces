import { def, toArray } from '../util/index'

const arrayProto: any = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

/**
 * 拦截变异方法并发出事件
 */
methodsToPatch.forEach((method) => {
    // 缓存原始的方法
    const original = arrayProto[method]
    
    def(arrayMethods, method, function mutator() {
        let args = toArray(arguments)
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted

        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }

        if (inserted) ob.observeArray(inserted)

        // 通知变更
        ob.dep.notify()

        return result
    })
})