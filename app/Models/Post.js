'use strict'

const Model = use('Model')

class Blog extends Model {
    static get table () {
        return 'posts'
    }

    /**
     * Defines the relationship between a blog post
     * and his author.
     *
     * @see https://adonisjs.com/docs/4.0/relationships#_belongs_to
     */
    author () {
        return this.belongsTo('App/Models/User', 'id', 'author_id')
    }
}

module.exports = Blog