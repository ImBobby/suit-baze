
((window, document, undefined) => {

    const noop = () => {}

    const App = {
        enableActiveStateMobile() {
            document.addEventListener('touchstart', noop, true)
        },

        WPViewportFix() {
            if ( '-ms-user-select' in document.documentElement.style && navigator.userAgent.match(/IEMobile/) ) {
                let style = document.createElement('style')
                let fix = document.createTextNode('@-ms-viewport{width:auto!important}')

                style.appendChild(fix)
                document.head.appendChild(style)
            }
        },

        objectFitPolyfill() {
            objectFitImages()
        }
    }

    for (let fn in App) {
        if ( fn[0] !== '_' )
            App[fn]()
    }

    window.Site = { ...App }

    function exist(selector) {
        return new Promise((resolve, reject) => {
            let $elem = $(selector)

            if ( $elem.length )
                resolve($elem)

            reject(`no element found for ${selector}`)
        })
    }

    function loadJSON(url) {
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                if ( res.ok )
                    resolve(res.json())

                reject('Network response not ok')
            }).catch(reject)
        })
    }

})(window, document)
