'use strict'

const Model = use('Model')

class Comment extends Model {
    replies () {
        return this.hasMany('App/Models/Comment', 'id', 'parent_id')
    }
}

module.exports = Comment