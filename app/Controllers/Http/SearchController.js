'use strict'

const Post = use('App/Models/Post')

class PostController {

    async index({ view }){
        const posts = (await Post.all()).toJSON();
        return view.render('search',  {posts})
    }

    async search({request, view}) {
        const posts = (await Post.query().where("title", "like", `%${request.name}%`).fetch()).toJSON();
        return view.render('search', {posts})
    }
}

module.exports = PostController
