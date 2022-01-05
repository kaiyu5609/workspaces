import './index.css'
import Kyue from 'Kyue'

var GridBox = Kyue.extend({
    name: 'GridBox',
    props: {
        opts: {
            type: Object
        }
    },
    render(h) {
        return h('Rect', {
            props: this.opts
        })
    }
})

var vm = new Kyue({
    el: '#app',
    data() {
        return {
            gridBoxOpts: {
                x: 100,
                y: 100,
                width: 200,
                height: 100,
                stroke: 'orange',
                strokeWidth: 1
            }
        }
    },
    render(h) {
        return h('Stage', {
            props: {
                container: this.$options.el,
                width: Math.random() > 0.5 ? 500 : 600, 
                height: 300
            }
        }, [
            h('Layer', {}, [
                h('Group', {}, h(GridBox, {
                    props: {
                        opts: this.gridBoxOpts
                    }
                }))
            ]),
        ])
    },
    mounted() {
        let btn = document.querySelector('#btn')
        btn.onclick = () => {
            this.gridBoxOpts = {
                x: 100,
                y: 100,
                width: Math.random() * 200 + 120,
                height: 100,
                stroke: 'red',
                strokeWidth: 1
            }
            this.updateComponent()
        }
    }
})

console.log('vm', vm)