'use strict'

const Model = use('Model')

class Comment extends Model {
    replies () {
        return this.hasMany('App/Models/Comment', 'id', 'parent_id')
    }
    post () {
        return this.belongsTo('App/Models/Post', 'post_id', 'id')
    }
}

module.exports = Comment