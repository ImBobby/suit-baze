/*! [PROJECT_NAME] | Suitmedia */

((window, document, undefined) => {

    const path = {
        css: `${myPrefix}assets/css/`,
        js : `${myPrefix}assets/js/vendor/`
    }

    const assets = {
        _jquery_cdn     : `https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js`,
        _jquery_local   : `${path.js}jquery.min.js`,
        _fastclick      : `${path.js}fastclick.min.js`,
        _objectFit      : `${path.js}object-fit-images.min.js`
    }

    const Site = {
        fastClick() {
            load(assets._fastclick).then(() => {
                FastClick.attach(document.body)
            })
        },

        enableActiveStateMobile() {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', () => {}, true)
            }
        },

        WPViewportFix() {
            if ( navigator.userAgent.match(/IEMobile\/10\.0/) ) {
                let style   = document.createElement('style'),
                    fix     = document.createTextNode('@-ms-viewport{width:auto!important}')

                style.appendChild(fix)
                document.getElementsByTagName('head')[0].appendChild(style)
            }
        },

        objectFitPolyfill() {
            load(assets._objectFit).then( () => {
                objectFitImages()
            })
        },

        loadAdditionalScripts() {
            let scripts = [].filter.call(document.scripts, script => {
                let src = $.trim(script.getAttribute('data-src'))

                return src && src !== null
            })

            scripts.forEach( script => {
                load(script.getAttribute('data-src'))
            })
        }
    }

    Promise.all([
        load(assets._jquery_cdn)
    ]).then(() => {
        for (let fn in Site) {
            Site[fn]()
        }
        window.Site = Site
    })

    function exist(selector) {
        return new Promise((resolve, reject) => {
            let $elem = $(selector)

            if ( $elem.length ) {
                resolve($elem)
            } else {
                reject(`no element found for ${selector}`)
            }
        })
    }

    function load(url) {
        return new Promise((resolve, reject) => {
            Modernizr.load({
                load: url,
                complete: resolve
            })
        })
    }

    function loadJSON(url) {
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                if ( res.ok )
                    return res.json()

                reject('Network response not ok')
            }).then(data => {
                resolve(data)
            }).catch(e => {
                reject(e)
            })
        })
    }

})(window, document)
