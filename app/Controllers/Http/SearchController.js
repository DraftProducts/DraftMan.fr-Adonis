'use strict'

const Post = use('App/Models/Post')
const { validate } = use('Validator')

class PostController {

    async index({ view }){

        const posts = await Post.all();

        return view.render('search', {
            posts: posts.toJSON()
        })
    }

    async search({ request, session, response }){

        return response.redirect('back')
    }
}

module.exports = PostController
