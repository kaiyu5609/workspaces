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
    data() {
        return {
            message: 'Hello Kyue!',
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
    render(h) {
        return h('div', {
                attrs: {
                    id: 'app'
                }
            }, 
            this.list.map((item) => h('p', {}, item.name))
        )
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