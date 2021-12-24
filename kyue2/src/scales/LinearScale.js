import * as d3 from 'd3'

export default class LinearScale {
    constructor(options) {
        this.id = options.id
        this.type = options.type
    }

    init(scaleOptions, options, datasets) {
        console.log('LinearScale.init...')

        let dataset = datasets[0] || {}
        let { data = [] } = dataset

        this.xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x)])
        .nice()
        .range([options.left, options.width - options.right])

        this.yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)])
        .nice()
        .range([options.height - options.bottom, options.top])
    }

    getX(x) {
        return this.xScale(x)
    }

    getY(y) {
        return this.yScale(y)
    }
}

LinearScale.id = 'linear'
