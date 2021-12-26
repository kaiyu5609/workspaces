import Kyue from 'Kyue'
import Layouts from './layouts'

const {
    util,
    LinearScale,
    CategoryScale,
    Line
} = Kyue

const {
    getStyle,
    valueOrDefault,
    each,
    mergeOptions
} = util

const ScaleClasses = {
    'linear': LinearScale,
    'category': CategoryScale
}
const SeriesClasses = {
    'line': Line
}

const KyueCore = Kyue.extend({
    created() {
        console.log('【vm】图形组件创建完成，vm.created()')
        console.log('   图形组件获取【scales】插件，vm.$scales:', this.$scales)

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
        this.datasets = []
        this._metasets = []
        this.series = []
        this.layouts = new Layouts()
    },
    mounted() {
        console.log('【vm】图形组件挂载完成，vm.mounted()')
        this._bindEvents()
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
        setState() {
            console.log('')
            console.log('vm.setState==========================start')
            this.update()
            console.log('series', this.series, this._metasets)
            this.updateComponent()
            console.log('vm.setState==========================end')
            console.log('')
        },
        update() {
            this.initChartArea()
            this.resetMatesets()

            this.scales = this.initScales()
            this.series = this.initSeries()

            this.layouts.init({
                chartArea: this.options.chartArea
            })
            each(this.scales, (scale) => {
                this.layouts.addItem(scale)
            })
            this.updateLayout()
        },
        initChartArea() {
            let domEl = this.$options.el
            this.options.chartArea.width = parseInt(getStyle(domEl, 'width'))
            this.options.chartArea.height = parseInt(getStyle(domEl, 'height'))
        },
        getScaleClass(type) {
            // 默认的比例尺
            return ScaleClasses[type] || LinearScale
        },
        getScale(scaleId) {
            return this.scales[scaleId]
        },
        initScales() {
            const options = this.options
            const scaleOpts = options.scales
            const scales = {}

            if (scaleOpts) {
                each(scaleOpts, (scaleOptions, scaleKey) => {
                    scaleOptions.id = scaleOptions.id || scaleKey
                    const id = scaleOptions.id
                    const scaleType = valueOrDefault(scaleOptions.type, 'linear')
        
                    let scale = null
                    if (id in scales && scales[id].type === scaleType) {
                        scale = scales[id]
                    } else {
                        const scaleClass = this.getScaleClass(scaleType)
                        scale = new scaleClass({
                            id,
                            type: scaleType,
                            axis: id
                        })
                        scales[scale.id] = scale
                    }
                    scale.init(scaleOptions, options.chartArea)   
                })
            }
            console.log('【vm】图形所实例化后的比例尺：scales', scales)
            return scales
        },
        getSeriesClass(type) {
            return SeriesClasses[type] || Line
        },
        resetMatesets() {
            this._metasets = []
        },
        getMataset(dataset, index) {
            const metasets = this._metasets
            let metaset = metasets.filter(d => d && d._dataset === dataset).pop()
            if (!metaset) {
                metaset = {
                    _dataset: dataset,
                    index
                }
                metasets.push(metaset)
            }
            return metaset
        },
        initSeries() {
            const datasets = this.datasets
            const series = []

            datasets.forEach((dataset, index) => {
                let metaset = this.getMataset(dataset, index)
                let type = dataset.type
                let itemSeries = null

                metaset.type = type
                // linkScales
                metaset.xScale = this.getScale(dataset.xScaleId)
                metaset.yScale = this.getScale(dataset.yScaleId)

                if (metaset.series) {
                    itemSeries = metaset.series
                } else {
                    const SeriesClass = this.getSeriesClass(type) 
                    itemSeries = metaset.series = new SeriesClass()
                }
                series.push(itemSeries)

                itemSeries.init({
                    dataset,
                    xScale: metaset.xScale,
                    yScale: metaset.yScale
                })
            })

            return series
        },
        getDomain(axis) {
            const metasets = this._metasets
            let min = Number.POSITIVE_INFINITY, 
                max = Number.NEGATIVE_INFINITY
            metasets.forEach((metaset) => {
                let domain = metaset.series.getDomain(axis)
                min = Math.min(min, domain.min)
                max = Math.max(max, domain.max)
            })
            return {
                min,
                max
            }
        },
        getRange(axis, chartArea) {
            let rangeMap = {
                x: {
                    min: chartArea.left,
                    max: chartArea.width - chartArea.right
                },
                y: {
                    min: chartArea.height - chartArea.bottom,
                    max: chartArea.top
                }
            }
            return rangeMap[axis]
        },
        updateLayout() {
            this.layouts.update((res) => {
                let { chartArea } = res
                this.options.chartArea = chartArea

                each(this.scales, (scale) => {
                    console.log('scale', scale, chartArea)
                    let axis = scale.axis
                    let domain = this.getDomain(axis)
                    let range = this.getRange(axis, chartArea)
                    scale.update({
                        domain,
                        range
                    })
                    console.log('12222', scale.ticks())
                })
            })
        }
    },
})

export default KyueCore