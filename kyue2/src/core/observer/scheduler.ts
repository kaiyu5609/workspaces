import Watcher from './watcher'
import { warn } from '../util/index'

export const MAX_UPDATE_COUNT = 100

const queue: Array<Watcher> = []
let has: any = {}// TODO
let circular: any = {}// TODO
let waiting = false
let flushing = false
let index = 0


/**
 * 重置调度程序的状态。
 */
function resetSchedulerState() {
    index = queue.length = 0
    has = {}
    if (process.env.NODE_ENV !== 'production') {
        circular = {}
    }
    waiting = flushing = false
}



/**
 * 刷新队列并运行watchers。
 */
function flushSchedulerQueue() {
    flushing = true

    let watcher, id

    /**
     * 先排序，然后再flush
     * 这样可以确保:
     * 1. 组件从父到子更新。 （因为父级总是在子级之前创建的）
     * 2. 组件用户自定义的watchers在渲染watcher之前运行
     *  （因为用户自定义的watchers是在渲染watcher之前创建的）
     * 3. 如果在父组件的watcher运行期间销毁了一个组件，则可以跳过该watcher
     */
    queue.sort((a, b) => a.id - b.id)

    /**
     * 不缓存长度，因为在我们运行现有watchers时可能会推送更多的watchers
     */

    for (index = 0; index < queue.length; index++) {
        watcher = queue[index]

        if (watcher.before) {
            watcher.before()
        }

        id = watcher.id
        has[id] = null
        watcher.run()

        // 在开发版本中，检查并停止循环更新。
        if (process.env.NODE_ENV !== 'production' && has[id] != null) {
            circular[id] = (circular[id] || 0) + 1

            if (circular[id] > MAX_UPDATE_COUNT) {
                warn(
                    'You may have an infinite update loop' + (
                        watcher.user
                            ? `in watcher with expression "${watcher.expression}"`
                            : `in a component render function.`
                    ),
                    watcher.vm
                )
                break
            }
        }
    }

    resetSchedulerState()
}



/**
 * 将观察者推送到观察者队列中。 
 * 具有重复ID的作业将被跳过，除非在刷新队列时，被推送到队列中
 * @param watcher 
 */
export function queueWatcher(watcher: Watcher) {
    const id = watcher.id

    if (has[id] == null) {
        has[id] = true

        if (!flushing) {
            queue.push(watcher)
        } else {
            /**
             * 在flush的过程中，又执行queueWatcher时
             * 需要将当前的watcher插入到按id排序的合适位置，
             * 如果watcher已经在queue队列中，那么它将立即被运行
             */
            let i = queue.length - 1

            while (i < index && queue[i].id > watcher.id) {
                i--
            }

            queue.splice(i + 1, 0, watcher)
        }

        /**
         * queue the flush
         * 保证只执行一次
         */
        if (!waiting) {
            waiting = true

            /**
             * TODO
             * nextTick(flushSchedulerQueue)
             */ 
            setTimeout(flushSchedulerQueue, 0)
        }

    }
}