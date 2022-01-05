/***********************Vue的示例***************************/ 

import Vue from 'vue'

console.log(111)

var Com1 = Vue.extend({
    props: {
        list: {
            type: Array
        }
    },
    render(h) {
        let list = this.list
        let res = list.map((item, index) => {
            return h('div', { class: 'item-' + index}, item.text)
        })
        return h('div', { class: 'list' }, res)
    }
})

new Vue({
    el: '#app',
    data() {
        return {
            list: [{
                text: '315215'
            }]
        }
    },
    render(h) {
        debugger
        let res = h(Com1, { props: { list: this.list } })
        console.log(res)
        return res
    },
    mounted() {
        setTimeout(() => {
            this.list = [{
                text: '15151515'
            },{
                text: '6666'
            }]
        }, 1000)
    }
})