'use strict'

const Model = use('Model')

class Payment extends Model {
    static get table () {
        return 'client_projects_payments'
    }
    project () {
        return this.belongsTo('App/Models/Project', 'id', 'client_project_id')
    }
}

module.exports = Payment
