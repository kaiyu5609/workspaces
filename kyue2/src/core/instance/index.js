import { warn, query } from '../util/index'
import { initMixin } from './init'
import { renderMixin } from './render'
import { lifecycleMixin, mountComponent } from './lifecycle'
import { patch } from '../vcanvas/patch'
import Scales from '../plugins/Scales'
import { LinearScale, CategoryScale } from '../../scales'
import { Line } from '../../components'

function Kyue(options) {
    if (process.env.NODE_ENV !== 'production' && !(this instanceof Kyue)) {
        warn('Kyue is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
}

Kyue.prototype.$mount = function(el) {
    const vm = this
    console.log(`【vm${vm._uid}】图形组件执行挂载，vm.$mount()`)
    // compile TODO
    const options = this.$options
    
    if (!options.render) {
        return
    }

    el = el && query(el)
    return mountComponent(this, el)
}

Kyue.prototype.__patch__ = patch

Kyue.Scales = Scales
Kyue.LinearScale = LinearScale
Kyue.CategoryScale = CategoryScale

Kyue.Line = Line

/**
 * 1、给实例添加_init方法
 * 2、组件调用 $mount 方法进行挂载
 */ 
initMixin(Kyue)

/**
 * 1、给实例添加_update方法 
 *  
 */ 
lifecycleMixin(Kyue)

/**
 * 1、给实例添加_render方法
 *  该方法生成虚拟DOM：vnode
 */ 
renderMixin(Kyue)


export default Kyue