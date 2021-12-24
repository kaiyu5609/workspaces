export default function logger (module) {
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