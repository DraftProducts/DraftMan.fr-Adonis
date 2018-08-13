'use strict'

const Model = use('Model')

class Client extends Model {
    static get table () {
        return 'clients'
    }
    author () {
        return this.belongsTo('App/Models/User', 'user_id', 'id')
    }
}

module.exports = Client
