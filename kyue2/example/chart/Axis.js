import Kyue from 'Kyue'

var AxisLines = Kyue.extend({
    name: 'AxisLines',
    props: {
        dataset: {
            type: Array
        }
    },
    render(h) {
        let dataset = this.dataset || []
        let res = dataset.map(item => {
            return h('Line', {
                props: item
            })
        })
        return h('Group', {}, res)
    }
})

var AxisLabels = Kyue.extend({
    name: 'AxisLabels',
    props: {
        dataset: {
            type: Array
        }
    },
    render(h) {
        let dataset = this.dataset || []
        let res = dataset.map(item => {
            return h('Text', {
                props: item
            })
        })
        return h('Group', {}, res)
    }
})

var Axis = Kyue.extend({
    name: 'Axis',
    props: {
        dataset: {
            type: Object
        }
    },
    render(h) {
        console.log(this.dataset)
        let dataset = this.dataset || { lines: [], labels: [] }
        let { lines, labels } = dataset

        let axislines = h(AxisLines, {
            props: {
                dataset: lines
            }
        })
        let axislabels = h(AxisLabels, {
            props: {
                dataset: labels
            }
        })

        return h('Group', {}, [
            axislines,
            axislabels
        ])
    }
})

export default Axis