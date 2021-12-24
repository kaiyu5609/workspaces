import { ASSET_TYPES } from 'shared/constants'
import { mergeOptions } from '../util'

export function initExtend(Kyue) {
    Kyue.cid = 0
    let cid = 1

    Kyue.extend = function(extendOptions) {
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId]
        }

        const name = extendOptions.name || Super.options.name

        const Sub = function KyueComponent(options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        Sub.super = Super
        Sub.extend = Super.extend
        Sub.mixin = Super.mixin
        Sub.use = Super.use

        // TODO
        Sub.Scales = Super.Scales
        Sub.LinearScale = Super.LinearScale
        Sub.CategoryScale = Super.CategoryScale

        ASSET_TYPES.forEach(function (type) {
            Sub[type] = Super[type]
        })

        if (name) {
            Sub.options.components[name] = Sub
        }

        Sub.superOptions = Super.options
        Sub.extendOptions = extendOptions
        // TODO
        
        // cache constructor
        cachedCtors[SuperId] = Sub
        return Sub
    }
}