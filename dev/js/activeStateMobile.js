import { noop } from './utils.js'

export default function () {
    document.addEventListener('touchstart', noop, true)
}
