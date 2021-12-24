import { noop, extend } from '../shared/util'

function createFunction(code: string, errors: Array<any>): Function {
    try {
        return new Function(code)
    } catch (err) {
        errors.push({err, code})
        return noop
    }
}

export function createCompileToFunctionFn(compile: Function): Function {
    const cache: any = Object.create(null)

    return function compileToFunctions(
        template: string,
        options?: any,
        vm?: any
    ) {
        options = extend({}, options)

        const key = template

        if (cache[key]) {
            return cache[key]
        }

        const compiled = compile(template, options)
        const res: any = {}

        const fnGenErrors: Array<any> = []
        res.render = createFunction(compiled.render, fnGenErrors)

        return (cache[key] = res)
    }
}