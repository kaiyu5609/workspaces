import * as d3 from 'd3'

export default class CategoryScale {
    constructor(options) {
        this.id = options.id
        this.type = options.type
        this.axis = options.axis
    }

    init(scaleOptions) {
        console.log('【LinearScale】初始化...')
        console.log('   scaleOptions：', scaleOptions)

        this.scale = d3.scaleBand().padding(0.1)
    }

    update(data) {
        const { domain, range } = data
        this.scale.domain([domain.min, domain.max])
        .range([range.min, range.max])
    }

    getValue(x) {
        // console.log(x, this.scale(x))
        return this.scale(x)
    }
}

CategoryScale.id = 'category'