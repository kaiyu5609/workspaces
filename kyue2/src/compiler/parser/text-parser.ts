const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


export function parseText(
    text: string,
    delimiters?: any
) {
    // TODO
    const tagRE = delimiters ? delimiters : defaultTagRE

    if (!tagRE.test(text)) {
        return
    }

    const tokens = []
    const rowTokens = []

    let lastIndex = tagRE.lastIndex = 0
    let match, index, tokenValue

    while ((match = tagRE.exec(text))) {
        index = match.index


        // TODO
        const exp = match[1].trim()
        tokens.push(`_s(${exp})`)
        rowTokens.push({ '@binding': exp })
        lastIndex = index + match[0].length
    }

    // TODO

    return {
        expression: tokens.join('+'),
        tokens: rowTokens
    }
}