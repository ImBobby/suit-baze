/*! [PROJECT_NAME] | Suitmedia */

((window, document, undefined) => {

    const path = {
        css: `${myPrefix}assets/css/`,
        js : `${myPrefix}assets/js/vendor/`
    };

    const assets = {
        _jquery_cdn     : `https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js`,
        _jquery_local   : `${path.js}jquery.min.js`,
        _fastclick      : `${path.js}fastclick.min.js`
    };

    const Site = {

        init() {
            Site.fastClick();
            Site.enableActiveStateMobile();
            Site.WPViewportFix();
            Site.loadAdditionalScripts();

            window.Site = Site;
        },

        fastClick() {
            Modernizr.load({
                load    : assets._fastclick,
                complete: () => {
                    FastClick.attach(document.body);
                }
            });
        },

        enableActiveStateMobile() {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', () => {}, true);
            }
        },

        WPViewportFix() {
            if ( navigator.userAgent.match(/IEMobile\/10\.0/) ) {
                let style   = document.createElement('style'),
                    fix     = document.createTextNode('@-ms-viewport{width:auto!important}');

                style.appendChild(fix);
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        },

        loadAdditionalScripts() {
            let scripts = [].filter.call(document.scripts, script => {
                let src = $.trim(script.getAttribute('data-src'))

                return src && src !== null
            });

            if ( !scripts.length ) return;

            scripts.forEach( script => {
                Modernizr.load(script.getAttribute('data-src'))
            })
        }
    };

    let checkJquery = () => {
        Modernizr.load([
            {
                test    : window.jQuery,
                nope    : assets._jquery_local,
                complete: Site.init
            }
        ]);
    };

    Modernizr.load({
        load    : assets._jquery_cdn,
        complete: checkJquery
    });

})(window, document);
