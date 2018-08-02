'use strict'

const Model = use('Model')

class Project extends Model {
    static get table () {
        return 'client_projects'
    }
    author () {
        return this.belongsTo('App/Models/User', 'id', 'user_id')
    }
    devblog () {
        return this.hasMany('App/Models/DevPost', 'client_project_id', 'id')
    }
}

module.exports = Project
