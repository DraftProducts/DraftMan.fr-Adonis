'use strict'

const Model = use('Model')

class Payment extends Model {
    static get table () {
        return 'client_projects_devblog'
    }
    project () {
        return this.belongsTo('App/Models/Project', 'id', 'client_project_id')
    }
}

module.exports = Payment
