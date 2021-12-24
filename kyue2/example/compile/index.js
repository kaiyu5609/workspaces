import './index.css'
import Kyue from 'Kyue'

function logger (module) {
    // getStackTrace()
    var log = console.log
    var data = []

    function defer(fn) {
        return Promise.resolve().then(fn)
    }

    function flush() {
        let args
        log(`------------------------------------start ${module}--------------------------------------`)
        while (args = data.shift()) {
            log.apply(log, args)
        }
        log(`------------------------------------ end  ${module}--------------------------------------`)
    }
    
    return function() {
        if (data.length === 0) {
            defer(flush)
        }
        data.push(arguments)
    }
}

var vm = new Kyue({
    el: '#app',
    template: '<ul :class="bindClass" class="list" k-if="isShow">'+
            '<li k-for="(item, index) in list" @click="clickItem(item, index)">{{item.name}}</li>'+
        '</ul>', 
    data() {
        return {
            message: 'Hello Kyue!',
            bindClass: 'app-1',
            isShow: true,
            list: [
                {
                    id: 1,
                    name: 'A'
                }, {
                    id: 2,
                    name: 'B'
                }, {
                    id: 3,
                    name: 'C'
                }
            ]
        }
    },
    methods: {
        clickItem(item, index) {
            console.log(item.name, index)
        }
    }
})

var log = logger('example')

log('Kyue:', Kyue)
log('vm:', vm)

// setTimeout(() => {
setInterval(() => {
    vm.list = [
        {
            id: 1,
            name: 99
        }, {
            id: 2,
            name: Math.floor(Math.random() * 100)
        }, {
            id: 3,
            name: Math.floor(Math.random() * 100)
        }
    ]
}, 1000)