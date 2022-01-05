import Kyue from 'Kyue'

var Lines = Kyue.extend({
    name: 'Lines',
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

var Circles = Kyue.extend({
    name: 'Circles',
    props: {
        dataset: {
            type: Array
        }
    },
    render(h) {
        let dataset = this.dataset || []
        let res = dataset.map(item => {
            return h('Circle', {
                props: item
            })
        })
        return h('Group', {}, res)
    }
})

var Line = Kyue.extend({
    name: 'Line',
    props: {
        dataset: {
            type: Object
        }
    },
    render(h) {
        console.log(this.dataset)
        let dataset = this.dataset || { lines: [], circles: [] }
        let { lines, circles } = dataset

        return h('Group', {}, [
            h(Lines, {
                props: {
                    dataset: lines
                }
            }),
            h(Circles, {
                props: {
                    dataset: circles
                }
            })
        ])
    }
})

export default Line