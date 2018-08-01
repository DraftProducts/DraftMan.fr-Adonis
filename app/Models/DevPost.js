'use strict'

const Model = use('Model')

class DevPost extends Model {
    static get table () {
        return 'client_projects_devblogs'
    }
    project () {
        return this.belongsTo('App/Models/Project', 'id', 'client_project_id')
    }
}

module.exports = DevPost
