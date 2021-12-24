'use strict'
import logger from './logger'
import './index.css'
import KyueCore from './core'

var log = logger('example')

KyueCore.use(KyueCore.Scales, {
    'key': 'params'
})
var scales = new KyueCore.Scales({})
// 内置比例尺不满足业务需求，可以注册自定义的比例尺
class CustomLinear {}
CustomLinear.id = 'customlinear'
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
                x: 300, y: 50
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
                    left: 80,
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
        getScale(scaleType) {
            return this.$scales.getScale(scaleType)
        },
        loadData() {
            setTimeout(() => {
                this.datasets = datasets || []
                this.setState()
            }, 1000)
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
        this.datasets.forEach((dataset) => {
            let xScale = this.scales[dataset.xScaleId]
            let yScale = this.scales[dataset.yScaleId]

            let points = []
            dataset.data.forEach(d => {
                let x = xScale.getX(d.x)
                let y = yScale.getY(d.y)

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
                width, height
            }
        }, [
            h('Layer', {}, children)
        ])
    }
})


log('Kyue.version', KyueCore.version)
log('vm:', vm)
log('message:', vm.message)
