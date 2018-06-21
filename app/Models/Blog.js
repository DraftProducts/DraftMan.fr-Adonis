'use strict'

const Model = use('Model')

class Blog extends Model {
    static get table () {
        return 'posts'
    }
}

module.exports = Blog