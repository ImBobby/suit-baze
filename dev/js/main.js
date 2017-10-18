import * as _ from './utils'
import activeStateMobile from './activeStateMobile'
import WPViewportFix from './windowsPhoneViewportFix'
import objectFitPolyfill from './objectFitPolyfill'

const App = {
    ...activeStateMobile,
    ...WPViewportFix,
    ...objectFitPolyfill
}

for (let fn in App) {
    App[fn]()
}

export default App
