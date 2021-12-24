import * as d3 from 'd3'

export default class CategoryScale {
    constructor(options) {
        this.id = options.id
        this.type = options.type
    }

    init(scaleOptions, options, datasets) {
        console.log('CategoryScale.init...')

        let dataset = datasets[0]
        let { data } = dataset

        this.xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([options.left, options.width - options.right])
        .padding(0.1)

        this.yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)])
        .nice()
        .range([options.height - options.bottom, options.top])
    }

    getX(x) {
        console.log(x, this.xScale(x))
        return this.xScale(x)
    }

    getY(y) {
        return this.yScale(y)
    }
}

CategoryScale.id = 'category'