import installApp from './installApp'
import activeStateMobile from './activeStateMobile'
import WPViewportFix from './windowsPhoneViewportFix'
import objectFitPolyfill from './objectFitPolyfill'
import formValidation from './formValidation'

const App = {
	installApp,
    activeStateMobile,
    WPViewportFix,
    objectFitPolyfill,
    formValidation
}

for (let fn in App) {
    if(fn[0] !== '_')
        App[fn]()
}

window.Site = App

export default App
