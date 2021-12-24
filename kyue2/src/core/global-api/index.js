import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { ASSET_TYPES } from '../../shared/constants'
import * as util from '../util'

export function initGlobalAPI(Kyue) {

    Kyue.util = util

    Kyue.options = Object.create(null)

    ASSET_TYPES.forEach(type => {
        Kyue.options[type + 's'] = Object.create(null)
    
        Kyue[type] = function(id, definition) {
            if (!definition) {
                return this.options[type + 's'][id]
            } else {
                if (type === 'component') {
                    definition.name = definition.name || id
                }
    
                this.options[type + 's'][id] = definition
                return definition
            }
        }
    })

    Kyue.options._base = Kyue

    initUse(Kyue)
    initMixin(Kyue)
    initExtend(Kyue)

}