import * as _ from './utils'

export default function () {
    const init = (opts) => ($form) => $form.bazeValidate(opts)

    _.exist('.js-validate')
        .then(_.toJqueryObject)
        .then(init({
            classInvalid: 'form-input--error',
            classValid: 'form-input--success'
        }))
        .catch(_.noop)
}
