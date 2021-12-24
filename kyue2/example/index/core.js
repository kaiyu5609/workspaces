import Kyue from 'Kyue'

const {
    getStyle,
    valueOrDefault,
    each,
    mergeOptions
} = Kyue.util

const scales = {
    'linear': Kyue.LinearScale,
    'category': Kyue.CategoryScale
}

const KyueCore = Kyue.extend({
    created() {
        console.log('实例创建完成，vm.created()')
        console.log('实例获取【Scales】插件，vm.$scales:', this.$scales)

        this.options = mergeOptions({
            chartArea: {
                left: 60,
                right: 60,
                top: 30,
                bottom: 30
            },
            scales: {
                x: {
                    id: 'x',
                    type: 'linear'
                },
                y: {
                    id: 'y',
                    type: 'linear'
                }
            }
        }, this.options || {})

        this.scales = {}

        this._bindEvents()
        
        this.initState()
    },
    mounted() {
        console.log('实例挂载完成，vm.mounted()')
        this.setState()
    },
    methods: {
        _bindEvents() {
            window.addEventListener('resize', () => {
                this.resize()
            }, false)
        },
        resize() {
            this.setState()
        },
        updateChartArea() {
            let domEl = this.$options.el
            this.options.chartArea.width = parseInt(getStyle(domEl, 'width'))
            this.options.chartArea.height = parseInt(getStyle(domEl, 'height'))
        },
        initState() {
            console.log('vm.initState==========================start')
            this.updateChartArea()
            this.buildOrUpdateScales()
            console.log('vm.initState==========================end')
        },
        setState() {
            console.log('vm.setState==========================start')
            this.updateChartArea()
            this.buildOrUpdateScales()
            this.updateComponent()
            console.log('vm.setState==========================end')
        },
        getScale(scaleType) {
            // 默认的比例尺
            return scales[scaleType] || Kyue.LinearScale
        },
        buildOrUpdateScales() {
            const datasets = this.datasets
            const options = this.options
            const scaleOpts = options.scales
            const scales = this.scales

            if (scaleOpts) {
                each(scaleOpts, (scaleOptions, scaleKey) => {
                    scaleOptions.id = scaleOptions.id || scaleKey
                    const id = scaleOptions.id
                    const scaleType = valueOrDefault(scaleOptions.type, 'linear')
                    console.log('scaleOptions', scaleOptions)
        
                    let scale = null
                    if (id in scales && scales[id].type === scaleType) {
                        scale = scales[id]
                    } else {
                        const scaleClass = this.getScale(scaleType)
                        scale = new scaleClass({
                            id,
                            type: scaleType
                        })
                        scales[scale.id] = scale
                    }
                    scale.init(scaleOptions, options.chartArea, datasets)   
                })
                this.scales = scales
                console.log('scales', scales)
            }
        }
    },
})

export default KyueCore