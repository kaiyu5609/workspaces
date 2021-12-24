import { parse } from './parser/index'
import { generate } from './codegen/index'
import { createCompileToFunctionFn } from './to-function'

import modules from './modules/index'




/********************************src/compiler/create-compiler***********************************/
function createCompilerCrerator(baseCompile: Function): Function {
    return function createCompiler(baseOptions: any) {
        function compile(template: string, options?: any) {
            const finalOptions = Object.create(baseOptions)

            const compiled = baseCompile(template.trim(), finalOptions)

            return compiled
        }

        return {
            compile,
            compileToFunctions: createCompileToFunctionFn(compile)
        }
    }
}




/********************************src/compiler/index***********************************/
export const createCompiler = createCompilerCrerator(function baseCompile(template: string, options: any) {
    const ast = parse(template.trim(), options)

    console.log('ast', ast)

    const code = generate(ast, options)

    return {
        ast,
        render: code.render
    }
})




/********************************platforms/web/compiler/index***********************************/
// TODO
const baseOptions: any = {
    modules
}

const { compile, compileToFunctions } = createCompiler(baseOptions)


export { compile, compileToFunctions }