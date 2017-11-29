
export default function () {
    const isIEMobile = '-ms-user-select' in document.documentElement.style && navigator.userAgent.match(/IEMobile/)

    if ( !isIEMobile ) return;

    const style = document.createElement('style')
    const fix = document.createTextNode('@-ms-viewport{width:auto!important}')
    style.appendChild(fix)
    document.head.appendChild(style)
}
