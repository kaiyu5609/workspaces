import * as d3 from 'd3'

export default class Line {
    constructor(options) {
        
    }

    init(options) {
        console.log('【Line】初始化...')
        console.log('   options', options)
        const { dataset, xScale, yScale } = options
        this.dataset = dataset
        this.xScale = xScale
        this.yScale = yScale

    }

    getDomain(axis) {
        const { data } = this.dataset || []
        const min = d3.min(data, d => d[axis])
        const max = d3.max(data, d => d[axis])
        return { min, max }
    }

    update() {
        console.log('Line update')
    }
}

Line.id = 'line'
