import Kyue from 'Kyue'

var GridBox = Kyue.extend({
    name: 'GridBox',
    props: {
        dataset: {
            type: Object
        }
    },
    render(h) {
        console.log('GridBox', this.dataset)
        let { rects } = this.dataset
        let res = rects.map(item => {
            return h('Rect', {
                props: item
            })
        })

        return h('Group', {}, [res])
    }
})

export default GridBox