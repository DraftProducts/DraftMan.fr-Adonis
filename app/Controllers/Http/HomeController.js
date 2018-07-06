'use strict'

const Post = use('App/Models/Post')

class HomeController {

    async index({ view }){

        const posts = (await Post.query().limit(3).fetch()).toJSON();

        return view.render('index', {posts})
    }
}

module.exports = HomeController
