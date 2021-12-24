import { LinearScale, CategoryScale } from '../../scales'

export default class Scales {
    constructor(options) {
        this.Scales = Object.create(null)
    }

    init(app) {
        console.log('实例注册【Scales】插件，Scales.init(vm)')
        console.log('   vm:', app)

        this.register(LinearScale)
        this.register(CategoryScale)
    }

    register(item) {
        const Scales = this.Scales
        const id = item.id

        if (id in Scales) {
            return id
        }

        Scales[id] = item
        return id
    }

    getScale(id) {
        return this.Scales[id]
    }
}

let _Kyue

function install(Kyue, opts) {
    // console.log(arguments)
    // console.log('opts', opts)

    if (install.installed && _Kyue === Kyue) return
    install.installed = true
    _Kyue = Kyue

    const isDef = v => v !== undefined

    Kyue.mixin({
        beforeCreate() {
            if (isDef(this.$options.scales)) {
                this._scalesRoot = this// vm
                this._scales = this.$options.scales
                this._scales.init(this)
            }
        }
    })

    Object.defineProperty(Kyue.prototype, '$scales', {
        get() {
            return this._scalesRoot._scales
        }
    })
}

Scales.install = install