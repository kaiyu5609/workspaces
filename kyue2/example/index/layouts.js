export default class Layouts {

    constructor(options) {
        this.options = options
        this.items = []
    }

    init(options) {
        this.options = options
    }

    addItem(item) {
        this.items.push(item)
    }

    removeItem(item) {
        let index = this.items.indexOf(item)
        this.items.aplice(index, 1)
    }

    fitItems() {
        
    }

    update(callback) {
        this.fitItems()

        let chartArea = this.options.chartArea
        // TODO，更新后的chartArea
        let newChartArea = chartArea

        let res = {
            chartArea: newChartArea
        }
        callback(res)
    }

}