'use strict'
import logger from './logger'
import './index.css'
import KyueCore from './core'

var log = logger('example')

console.log('图形组件注册【Scales】插件')
KyueCore.use(KyueCore.Scales, {
    'key': 'params'
})
console.log('实例化【Scales】插件')
var scales = new KyueCore.Scales({})
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

var vm = new KyueCore({
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
        }
    },
    mounted() {
        console.log('child.mounted')
        this.loadData()
    },
    render(h) {
        console.log('实例渲染，vm.render()')
        const chartArea = this.options.chartArea
        const { 
            width,
            height,
            left,
            right,
            top,
            bottom
        } = chartArea
        

        let children = []
        let rects = [
            h('Rect', {
                props: {
                    x: left,
                    y: top,
                    width: width - left - right,
                    height: height - top - bottom,
                    stroke: '#999',
                    strokeWidth: 1
                }
            })
        ]
        let lines = []
        let circles = []

        var xAxisLines = []
        var xAxisLabels = []
        var xscale = this.getScale('x')
        if (xscale) {
            var ticks = xscale.ticks()
            ticks.forEach(d => {
                var x = xscale.getValue(d)
                var y1 = top
                var y2 = height - bottom
                var points = [x, y1, x, y2]

                var line = h('Line', {
                    props: {
                        points,
                        strokeWidth: 1,
                        stroke: '#999'
                    }
                })
                xAxisLines.push(line)

                var label = h('Text', {
                    x: x,
                    y: y1,
                    text: String(d),
                    fontSize: 14,
                    fill: '#999'
                })

                xAxisLabels.push(label)
            })
        }
        console.log('xAxisLabels', xAxisLabels)


        var yAxisLines = []
        var yscale = this.getScale('y')
        if (yscale) {
            var ticks = yscale.ticks()
            ticks.forEach(d => {
                var y = yscale.getValue(d)
                var x1 = left
                var x2 = width - right
                var points = [x1, y, x2, y]

                var line = h('Line', {
                    props: {
                        points,
                        strokeWidth: 1,
                        stroke: '#999'
                    }
                })
                yAxisLines.push(line)
            })
        }

        console.log('yAxisLines', yAxisLines)

        this.datasets.forEach((dataset) => {
            let xScale = this.getScale(dataset.xScaleId)
            let yScale = this.getScale(dataset.yScaleId)

            let points = []
            dataset.data.forEach(d => {
                let x = xScale.getValue(d.x)
                let y = yScale.getValue(d.y)

                // points
                points.push(x, y)

                // circle
                let props = {
                    x,
                    y,
                    radius: 6,
                    strokeWidth: 1,
                    fill: dataset.itemStyle.color,
                    // stroke: '#666'
                }
                let circle = h('Circle', {
                    props
                })
                circles.push(circle)
            })

            // console.log('points', points)
            let line = h('Line', {
                props: {
                    points,
                    strokeWidth: 1,
                    stroke: dataset.color
                }
            })
            lines.push(line)
        })

        children = children.concat(rects, lines, circles)

        return h('Stage', {
            props: {
                container: this.$options.el,
                width, 
                height
            }
        }, [
            h('Layer', {}, xAxisLines),
            h('Layer', {}, xAxisLabels),
            h('Layer', {}, yAxisLines),
            h('Layer', {}, children)
        ])
    }
})


log('Kyue.version', KyueCore.version)
log('vm:', vm)
log('message:', vm.message)
