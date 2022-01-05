'use strict'
import './index.css'
import Kyue from 'Kyue'

var vm = new Kyue({
    el: '#app',
    data() {
        return {
            circleOpts: {
                x: 150,
                y: 150,
                radius: 60,
                strokeWidth: 2,
                stroke: 'orange',
                fill: 'lightblue'
            }
        }
    },
    render(h) {
        return h('Stage', {
            props: {
                container: this.$options.el,
                width: 600, 
                height: 300
            }
        }, [
            h('Layer', {}, [
                h('Circle', {
                    props: this.circleOpts
                })
            ]),
        ])
    },
    mounted() {
        
    }
})

console.log('vm', vm)