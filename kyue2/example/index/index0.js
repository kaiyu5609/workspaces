var Line1 = new Kyue.extend({
    props: {
        
    },
    data() {
        return {
            style: {
                line: {
                    color: 'red'
                }
            },
            dataset: [1, 2, 3, 4, 5]
        }
    },
    render() {
        let points = this.dataset.map((val) => {
            return {
                x: this.$Indexscale.getX(),
                y: this.$Indexscale.getY(val)
            }
        })
        return h(LineElement, {
            style: this.style
        }, points)
    }
})

var Line2 = new Kyue.extend({
    data() {
        return {
            dataset: [5, 6, 7, 8, 9]
        }
    },
    render() {

    }
})

Kyue.use(Kyue.Layout)
Kyue.use(Kyue.IndexScale)
Kyue.use(Kyue.LinearScale)
Kyue.use(Kyue.Series)

var IndexScale = Kyue.IndexScale.extend({
    data() {
        return {
            labels: ['周一', '周二', '周三', '周四', '周五']
        }
    }
})

var LinearScale = Kyue.LinearScale.extend({
    data() {
        return {
        }
    }
})

var vm = new Kyue({
    el: '#app',
    data() {
        return {
            labels: ['周一', '周二', '周三', '周四', '周五']
        }
    },
    render(h) {
        return h(Kyue.Layout, [
            h(IndexScale),
            h(LinearScale),
            h(Line1),
            h(Line2)
        ])
    }
})
