export const IS_ACTIVE = 'is-active'

export function noop() {}

export function log(n) {
    console.log(n)
    return n
}

export function pipe(...fns) {
    return function (input) {
        return fns.reduce((output, fn) => fn(output), input)
    }
}

export function map(cb) {
    return function (arr) {
        return arr.map(cb)
    }
}

export function filter(cb) {
    return function (arr) {
        return arr.filter(cb)
    }
}

export function reduce(cb, initial) {
    return function (arr) {
        return arr.reduce(cb, initial)
    }
}

export function each(cb) {
    return function (arr) {
        arr.forEach(cb)
        return arr
    }
}

export function get(prop) {
    return function (obj) {
        return obj[prop]
    }
}

export function set(prop, value) {
    return function (obj) {
        obj[prop] = value
        return obj
    }
}

export function clone(obj) {
    return {...obj}
}

export function copyArray(arr) {
    return [...arr]
}

export function length(item) {
    return item.length
}

export function toNumber(n) {
    return Number(n)
}

export function equal(comparison) {
    return function (value) {
        return value === comparison
    }
}

export function notEqual(comparison) {
    return function (value) {
        return !equal(comparison)(value)
    }
}

export function gt(a) {
    return function (b) {
        return b > a
    }
}

export function gte(a) {
    return function (b) {
        return b >= a
    }
}

export function lt(a) {
    return function (b) {
        return b < a
    }
}

export function lte(a) {
    return function (b) {
        return b <= a
    }
}

export function query(context) {
    return function (selector) {
        return context.querySelector(selector)
    }
}

export function queryAll(context) {
    return function (selector) {
        return [...context.querySelectorAll(selector)]
    }
}

export function addEvent(type, cb, capture = false) {
    return function (element) {
        element.addEventListener(type, cb, capture)
        return element
    }
}

export function addClass(...classes) {
    return function (element) {
        element.classList.add(...classes)
        return element
    }
}

export function removeClass(...classes) {
    return function (element) {
        element.classList.remove(...classes)
        return element
    }
}

export function toggleClass(...classes) {
    return function (element) {
        element.classList.toggle(...classes)
        return element
    }
}

export function getJSON(url) {
    return new Promise((resolve, reject) => {
        $.getJSON(url).done(resolve).fail(reject)
    })
}

export function exist(selector) {
    return new Promise((resolve, reject) => {
        const elems = queryAll(document)(selector)

        if ( elems.length )
            resolve(elems)
        reject(`no element found for ${selector}`)
    })
}

export function toJqueryObject(elements) {
    return $(elements)
}

export function preventDefault(event) {
    event.preventDefault()
    return event
}

export function getAttr(attr) {
    return function (el) {
        return el.getAttribute(attr)
    }
}

export function createSlider(opts = {}) {
    return function ($el) {
        return new Promise((resolve, reject) => {
            if ( !$el.length ) {
                reject(`No element ${$el} found.`)
            }

            const defaults = {
                accessibility: false,
                draggable: false
            }

            $el.on('init', () => {
                resolve($el)
            })

            $el.slick({
                ...defaults,
                ...opts
            })
        })
    }
}

export function escKeyPress(e) {
    return e.keyCode == 27;
}

export function summ(a,b) {
    return a+b
}

export function summArray(arr) {
    return arr.reduce(summ)
}
