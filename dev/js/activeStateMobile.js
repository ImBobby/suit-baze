import { noop } from './utils.js'

export default {
    enableActiveStateMobile() {
        document.addEventListener('touchstart', noop, true)
    }
}
