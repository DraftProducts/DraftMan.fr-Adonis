'use strict'

const Model = use('Model')

class Comment extends Model {
    replies () {
        return this.hasMany('App/Models/Comment', 'id', 'parent_id')
    }
    post () {
        return this.belongsTo('App/Models/Post', 'id', 'post_id')
    }
}

module.exports = Comment