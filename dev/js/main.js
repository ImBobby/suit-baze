/*******************************************************************************

    Title :  
    Date  :  June 2014
    Author:  Suitmedia (http://www.suitmedia.com)

********************************************************************************/

var Site = {

    assets: {
        _jquery_cdn     : '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
        _jquery_local   : myPrefix + 'assets/js/vendor/jquery.min.js',
        _fastclick      : myPrefix + 'assets/js/vendor/fastClick.min.js'
    },

    init: function () {
        Site.fastClick();
        Site.enableActiveStateMobile();
        Site.WPViewportFix();
    },

    fastClick: function () {
        Modernizr.load({
            load    : Site.assets._fastclick,
            complete: function () {
                FastClick.attach(document.body);
            }
        });
    },

    enableActiveStateMobile: function () {
        if ( document.addEventListener ) {
            document.addEventListener('touchstart', function () {}, true);
        }
    },

    WPViewportFix: function () {
        if ( navigator.userAgent.match(/IEMobile\/10\.0/) ) {
            var style   = document.createElement("style"),
                fix     = document.createTextNode("@-ms-viewport{width:auto!important}");

            style.appendChild(fix);
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

};

(function () {
    function siteInit() {
        Site.init();
    }

    function fallback() {
        if ( !window.jQuery ) {
            Modernizr.load({
                load    : Site.assets._jquery,
                complete: siteInit
            });
        } else {
            Site.init();
        }
    }

    Modernizr.load({
        load    : Site.assets._jquery_cdn,
        complete: fallback
    });
})();
