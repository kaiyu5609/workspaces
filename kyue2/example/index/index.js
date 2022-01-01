'use strict'
import logger from './logger'
import './index.css'
import Chart from './Chart'
import GridBox from './GridBox'
import Axis from './Axis'
import Line from './Line'

var log = logger('example')

console.log('图形组件注册【Scales】插件')
Chart.use(Chart.Scales, {
    'key': 'params'
})
console.log('实例化【Scales】插件')
var scales = new Chart.Scales({})
// 内置比例尺不满足业务需求，可以注册自定义的比例尺
class CustomLinear {}
CustomLinear.id = 'customlinear'
console.log('【scales】: 注册【CustomLinear】比例尺')
console.log('')
scales.register(CustomLinear)


const datasets = [
    {
        type: 'line',
        xScaleId: 'x',
        yScaleId: 'y',
        color: '#0eaf52',
        itemStyle: {
            color: '#0eaf52'
        },
        data: [
            {
                x: 0, y: 50
            }, {
                x: 100, y: 100
            }, {
                x: 200, y: 80
            }, {
                x: 300, y: 200
            }, {
                x: 400, y: 100
            }
        ]
    },
    {
        type: 'line',
        xScaleId: 'x',
        yScaleId: 'y',
        color: 'red',
        itemStyle: {
            color: 'red'
        },
        data: [
            {
                x: 0, y: 100
            }, {
                x: 100, y: 150
            }, {
                x: 200, y: 120
            }, {
                x: 300, y: 300
            }, {
                x: 400, y: 200
            }
        ]
    }
]

const datasets2 = [
    {
        type: 'line',
        xScaleId: 'x',
        yScaleId: 'y',
        color: '#0eaf52',
        itemStyle: {
            color: '#0eaf52'
        },
        data: [
            {
                x: 0, y: 50
            }, {
                x: 100, y: 100
            }, {
                x: 200, y: 80
            }, {
                x: 300, y: 200
            }, {
                x: 400, y: 100
            }
        ]
    },
    {
        type: 'line',
        xScaleId: 'x',
        yScaleId: 'y',
        color: 'red',
        itemStyle: {
            color: 'red'
        },
        data: [
            {
                x: 0, y: 100
            }, {
                x: 100, y: 150
            }, {
                x: 200, y: 120
            }, {
                x: 300, y: 50
            }, {
                x: 400, y: 60
            }
        ]
    }
]

var vm = new Chart({
    el: document.querySelector('#app'),
    scales,
    data() {
        return {
            message: 'Hello Kyue!',
            options: {
                chartArea: {
                    left: 60,
                    right: 60,
                    top: 30,
                    bottom: 30,
                    width: null,
                    height: null
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
            },
            datasets: []
        }
    },
    methods: {
        getScaleClass(type) {
            return this.$scales.getScale(type)
        },
        loadData() {
            setTimeout(() => {
                this.datasets = datasets2 || []
                this.setState()
            }, 1000)

            setTimeout(() => {
                this.datasets = datasets || []
                this.setState()
            }, 2000)
        },
        getGridDataset(chartArea) {
            let { 
                width,
                height,
                left,
                right,
                top,
                bottom
            } = chartArea

            const dataset = {
                rects: [{
                    x: left,
                    y: top,
                    width: width - left - right,
                    height: height - top - bottom,
                    stroke: '#ccc',
                    strokeWidth: 1
                }]
            }

            return dataset
        },
        getXAxisDataset(chartArea) {
            const { 
                width,
                height,
                left,
                right,
                top,
                bottom
            } = chartArea

            const dataset = {
                lines: [],
                labels: []
            }

            var xscale = this.getScale('x')
            if (xscale) {
                var ticks = xscale.ticks()
                ticks.forEach(d => {
                    var x = xscale.getValue(d)
                    var y1 = top
                    var y2 = height - bottom
                    var points = [x, y1, x, y2]

                    var line = {
                        points,
                        strokeWidth: 1,
                        stroke: '#ccc'
                    }
                    dataset.lines.push(line)

                    var label = {
                        x: x - 15,
                        y: y2 + 5,
                        width: 30,
                        text: String(d),
                        fontSize: 12,
                        fill: '#aaa',
                        align: 'center'
                    }
                    dataset.labels.push(label)
                })
            }
            return dataset
        },
        getYAxisDataset(chartArea) {
            const { 
                width,
                height,
                left,
                right,
                top,
                bottom
            } = chartArea

            const dataset = {
                lines: [],
                labels: []
            }

            var yscale = this.getScale('y')
            if (yscale) {
                var ticks = yscale.ticks()
                ticks.forEach(d => {
                    var y = yscale.getValue(d)
                    var x1 = left
                    var x2 = width - right
                    var points = [x1, y, x2, y]

                    var line = {
                        points,
                        strokeWidth: 1,
                        stroke: '#ccc'
                    }
                    dataset.lines.push(line)

                    var label = {
                        x: x1 - 35,
                        y: y - 6,
                        width: 30,
                        text: String(d),
                        fontSize: 12,
                        fill: '#aaa',
                        align: 'right'
                    }
                    dataset.labels.push(label)
                })
            }
            return dataset
        },
        getLineDataset() {
            const dataset = {
                lines: [],
                circles: []
            }

            this.datasets.forEach((datasetItem) => {
                let xScale = this.getScale(datasetItem.xScaleId)
                let yScale = this.getScale(datasetItem.yScaleId)
    
                let points = []
                datasetItem.data.forEach(d => {
                    let x = xScale.getValue(d.x)
                    let y = yScale.getValue(d.y)
    
                    // points
                    points.push(x, y)
    
                    // circle
                    let circle = {
                        x,
                        y,
                        radius: 5,
                        strokeWidth: 1,
                        fill: datasetItem.itemStyle.color,
                        // stroke: '#666'
                    }
                    dataset.circles.push(circle)
                })
    
                // console.log('points', points)
                let line = {
                    points,
                    strokeWidth: 1,
                    stroke: datasetItem.color
                }
                dataset.lines.push(line)
            })

            return dataset
        }
    },
    mounted() {
        this.loadData()
    },
    render(h) {
        let chartArea = this.options.chartArea
        let { width, height } = chartArea
        // console.log('实例渲染，vm.render()', chartArea)
        
        let gridDataset = this.getGridDataset(chartArea)
        // console.log('gridDataset', gridDataset)

        var xAxisDataset = this.getXAxisDataset(chartArea)
        // console.log('xAxisDataset', xAxisDataset)

        var yAxisDataset = this.getYAxisDataset(chartArea)
        // console.log('yAxisDataset', yAxisDataset)

        var lineDataset = this.getLineDataset()
        // console.log('lineDataset', lineDataset)


        return h('Stage', {
            props: {
                container: this.$options.el,
                width, 
                height
            }
        }, [
            h('Layer', {}, [
                h(GridBox, {
                    props: {
                        dataset: gridDataset
                    }
                }),
                h(Axis, {
                    props: {
                        dataset: xAxisDataset
                    }
                }),
                h(Axis, {
                    props: {
                        dataset: yAxisDataset
                    }
                }),
                h(Line, {
                    props: {
                        dataset: lineDataset
                    }
                })
            ])
        ])
    }
})


log('Kyue.version', Chart.version)
log('vm:', vm)
log('message:', vm.message)
