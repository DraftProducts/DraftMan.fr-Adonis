'use strict'

const Post = use('App/Models/Post')

class PostController {

    async index({ view }){

        const posts = (await Post.all()).toJSON();

        return view.render('search',  {posts})
    }

    async search({params, view}){

        const posts = (await Post.find(params.name)).toJSON();
        return view.render('search', {posts})
    }
}

module.exports = PostController
