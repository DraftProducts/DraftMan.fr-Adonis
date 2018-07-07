'use strict'

const Model = use('Model')

class Email extends Model {
    static get table () {
        return 'emails'
    }
}

module.exports = Email
