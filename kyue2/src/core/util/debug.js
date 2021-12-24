import { noop } from '../../shared/util'

export let warn = noop


if (process.env.NODE_ENV !== 'production') {
    const hasConsole = typeof console !== 'undefined'

    warn = (msg, vm) => {
        const trace = ''// TODO

        // TODO
        if (hasConsole) {
            console.error(`[Kyue warn]: ${msg}${trace}`)
        }
    }
}