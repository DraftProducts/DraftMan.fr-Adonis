'use strict'

const Post = use('App/Models/Post')
const Comments = use('App/Models/Comment')

class PostController {
    // index = Liste tes posts
    // create = Afficher le formulaire de création
    // store = Stocker ton post
    // show = Afficher un post
    // edit = Afficher le formulaire de modificaton
    // update = Met à jour ton post
    // destroy = Détruire ton post

    async index({ view }){

        const blog = await Post.all();

        return view.render('blog.index', {
            blog: blog.toJSON()
        })
    }

    async list({ view }){

        const blog = await Post.all();

        return view.render('blog.list', {
            blog: blog.toJSON()
        })
    }

    async article({params, view}){

        const post = await Post.find(params.id)
        const blog = await Post.all();
        const comments = await Comments.all();

        return view.render('blog.details', {
            item: post,
            blog: blog,
            comments: comments
        })
    }
}

module.exports = PostController
