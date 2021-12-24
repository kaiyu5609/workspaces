// me

export function getStyle(el, property) {
    return el.currentStyle 
        ? el.currentStyle[property] 
        : document.defaultView.getComputedStyle(el, null).getPropertyValue(property)
}