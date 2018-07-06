'use strict'

const Post = use('App/Models/Post')

class SearchController {

    async index({ view }){
        const posts = (await Post.all()).toJSON();
        return view.render('search',  {posts})
    }

    async search({request, view}) {
        const posts = (await Post.query().where("title", "like", `%${request.body.q}%`).fetch()).toJSON();
        return view.render('search', {posts, search: request.body.q})
    }
}

module.exports = SearchController
