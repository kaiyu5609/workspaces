
import { unicodeRegExp } from '../../core/util/lang'

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)



const shouldIgnoreFirstNewline = (tag: string, html: string) => tag && html[0] === '\n'



export function parseHTML(html: string, options: any) {
    const stack: Array<any> = []
    let index = 0
    let last, lastTag

    let MAX = 100
    let count = 0

    while (html) {
        count++
        if (count > MAX) {
            break
        }

        last = html

        // TODO
        if (!lastTag || true) {
            let textEnd = html.indexOf('<')

            if (textEnd === 0) {

                // ③ step
                const endTagMatch = html.match(endTag)
                if (endTagMatch) {
                    const curIndex = index
                    advance(endTagMatch[0].length)
                    parseEndTag(endTagMatch[1], curIndex, index)
                    continue
                }

                // ① step
                const startTagMatch = parseStartTag()
                if (startTagMatch) {
                    handleStartTag(startTagMatch)

                    if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                        advance(1)
                    }
                    continue
                }

            }

            let text, rest, next

            // ② step
            if (textEnd >= 0) {
                // TODO detail
                text = html.substring(0, textEnd)
            }

            if (textEnd < 0) {
                text = html
            }

            if (text) {
                advance(text.length)
            }

            if (options.chars && text) {
                options.chars(text, index - text.length, index)
            }
        }
    }


    function advance(n: number) {
        index += n
        html = html.substring(n)
    }


    /**
     * 开始标签的解析
     */
    function parseStartTag() {
        /**
         * start: [ "<ul", "ul" ]
         */
        const start = html.match(startTagOpen)

        if (start) {
            const match: any = {
                tagName: start[1],
                attrs: [],
                start: index
            }

            advance(start[0].length)

            let end, attr: any

            /**
             * 解析节点的属性
             * 1. 不是节点闭合标签
             * 2. 匹配动态属性表达式 或者是 静态属性表达式
             */
            while (
                !(end = html.match(startTagClose)) && 
                ( attr = html.match(dynamicArgAttribute) || html.match(attribute) )
            ) {
                /**
                 * attr: [ " :class=\"bindClass\"", ":class", "=", "bindClass", null, null ]
                 */
                attr.start = index
                advance(attr[0].length)
                attr.end = index
                match.attrs.push(attr)
            }

            /**
             * end: [ ">", "" ]
             */
            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index

                return match
            }
        }
    }

    function handleStartTag(match: any) {
        const tagName = match.tagName
        const unarySlash = match.unarySlash

        // TODO
        const unary = !!unarySlash

        const l = match.attrs.length
        const attrs = new Array(l)

        for (let i = 0; i < l; i++) {
            const args = match.attrs[i]
            const value = args[3] || args[4] || args[5] || ''

            attrs[i] = {
                name: args[1],
                value: value// decodeAttr
            }
        }

        if (!unary) {
            stack.push({
                tag: tagName,
                lowerCasedTag: tagName.toLowerCase(),
                attrs: attrs,
                start: match.start,
                end: match.end
            })
            lastTag = tagName
        }

        /**
         * 执行 options.start
         * 构建AST树
         */
        if (options.start) {
            options.start(
                tagName,
                attrs,
                unary,
                match.start,
                match.end
            )
        }

    }


    function parseEndTag(tagName: string, start: number, end: number) {
        let pos, lowerCasedTagName

        if (tagName) {
            lowerCasedTagName = tagName.toLowerCase()
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break
                }
            }
        } else {
            pos = 0
        }

        if (pos >= 0) {
            for (let i = stack.length - 1; i >= pos; i--) {
                if (options.end) {
                    options.end(stack[i].tag, start, end)
                }
            }

            stack.length = pos
            lastTag = pos && stack[pos - 1].tag
        }

    }

}