export function noop() {}

export function log(n) {
    console.log(n)
    return n
}

export function getJSON(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => {
            if ( res.ok )
                resolve(res.json())
            reject('Network response not ok')
        }).catch(reject)
    })
}

export function exist(selector) {
    return new Promise((resolve, reject) => {
        let $elem = $(selector)
        if ( $elem.length )
            resolve($elem)
        reject(`no element found for ${selector}`)
    })
}

export function pipe(...fns) {
    return function (input) {
        return fns.reduce((output, fn) => fn(output), input)
    }
}
