'use strict'

const Model = use('Model')

class Portfolio extends Model {
    static get table () {
        return 'portfolio'
    }
}

module.exports = Portfolio