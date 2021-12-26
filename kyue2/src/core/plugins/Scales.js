import { LinearScale, CategoryScale } from '../../scales'

export default class Scales {
    constructor(options) {
        this.Scales = Object.create(null)
    }

    init(app) {
        console.log('   【scales】: scales.init(app)')
        // console.log('       app:', app)

        console.log('   【scales】: 注册【LinearScale】比例尺')
        console.log('   【scales】: 注册【CategoryScale】比例尺')
        this.register(LinearScale)
        this.register(CategoryScale)
        console.log('')
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
            console.log('【vm】图形组件创建之前，vm.beforeCreate()')
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