export const IS_ACTIVE = 'is-active'
export const $body = $('body')


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

export function dateFormat(date) {
    let dates = new Date(date)
    let day = dates.getDate()
    let month = dates.toLocaleString('id', { month: 'long' })
    let year = dates.getFullYear()
    let format = `${day} ${month} ${year}`

    return format
}

export function compare(a, b) {
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    } else {
        return 0;
    }
}

export function isString(a) {
    return typeof a === 'string'
}

export function append(a, bs) {
    return isString(bs) ? bs + a : bs.concat([a])
}

export function prepend(a, bs) {
    return isString(bs) ? a + bs : [a].concat(bs)
}

export function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
            return typeof obj;
        };
    } else {
        _typeof = function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
    }

    return _typeof(obj);
}

export function toList(as, t) {
    return t === 'string' ? as.join('') : as
}

export function sortAsc(as) {
    var bs = Array.from(as.slice(0));

    return toList(bs.sort(compare), _typeof(as))
}

export function sortDsc(as) {
    return sortAsc(as).reverse()
}

export function getMin(as) {
    return sortAsc(as)[0]
}

export function getMax(as) {
    return sortDsc(as)[0]
}

export function onCLick(el, btnSelector) {
    return new Promise((resolve, reject) => {
        el.addEventListener('click', e => {
            if(e.target.matches(btnSelector)) {
                let btn = e.target
                console.log(btn)
                resolve(btn)
            } else {
                reject('no')
            }
        })
    })
}

export function gJson(url, obj) {
    return new Promise((resolve, reject) => {
        obj = new XMLHttpRequest()
        obj.open('GET', url, true)
        obj.onload = function() {
            if(obj.status >= 200 && obj.status < 400) {
                const json = JSON.parse(obj.response)
                resolve(json)
            } else {
                reject
            }
        }
        obj.send()
    })
}

export function add(a,b) {
    return a+b
}

export function sum(arr) {
    return arr.reduce(add)
}

export function empty (as) {
    return as.length === 0
}

export function mempty(as) {
    return isString(as) ? '' : []
}

export function nubBy(f, as) {
    const a = as[0]

    return empty(as) ? mempty(as) : prepend(a, nubBy(f, filter(b => !f(a)(b))(as.slice(1))))
}

export function nub(as) {
    let bs = isString(as) ? Array.from(as) : as

    return toList(nubBy(equal, bs), _typeof(as))
}

// https://www.sitepoint.com/get-url-parameters-with-javascript/
// getAllUrlParams('https://baze.suitmedia.com/?name=Name')
export function getAllUrlParams(url) {

    // get query string from url (optional) or window
    let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    let obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        let arr = queryString.split('&');

        for (let i = 0; i < arr.length; i++) {
            // separate the keys and the values
            let a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            let paramName = a[0];
            let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            paramName = decodeURIComponent(paramName)
            paramValue = decodeURIComponent(paramValue)

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                let key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    let index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}
