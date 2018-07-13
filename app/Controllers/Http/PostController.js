'use strict'

const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')

class PostController {
    // index = Liste tes posts
    // create = Afficher le formulaire de création
    // store = Stocker ton post
    // show = Afficher un post
    // edit = Afficher le formulaire de modificaton
    // update = Met à jour ton post
    // destroy = Détruire ton post

    async index({ view }){

        const posts = (await Post.query().where('posted', 1).fetch()).toJSON();

        return view.render('blog.index', {posts})
    }

    async create({ view, auth }){
        const posts = (await Post.query().where('posted', 1).fetch()).toJSON();
        const user = await auth.user.toJSON();
        return view.render('dashboard.write', {posts,user})
    }

    async list({ view }){

        const posts = (await Post.all()).toJSON();

        return view.render('blog.list', {posts})
    }

    async show ({ params, view }){
        const [post, posts, comments] = await Promise.all([
          Post.find(params.id),
          Post.all(),
          Comment.query().with('replies').where('post_id', params.id).fetch(),
        ])
        return view.render('blog.post', { post: post, posts: posts.toJSON(), comments: comments.toJSON() })
    }
}

module.exports = PostController
