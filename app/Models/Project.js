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
        return this.hasMany('App/Models/DevPost', 'id', 'client_project_id')
    }
    payments () {
        return this.hasMany('App/Models/Payment', 'id', 'client_project_id')
    }
}

module.exports = Project
