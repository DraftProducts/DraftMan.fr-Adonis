'use strict'

const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')

class BlogController {
    // index = Liste tes posts
    // create = Afficher le formulaire de création
    // store = Stocker ton post
    // show = Afficher un post
    // edit = Afficher le formulaire de modificaton&²&&&
    // update = Met à jour ton post
    // destroy = Détruire ton post

    async index({ view }){
        const posts = (await Post.query().with('author').whereNotNull('published_at').where('deleted',0).fetch()).toJSON();
        return view.render('blog.index', {posts})
    }

    async show ({ params, view }){
        const [post, posts, comments] = await Promise.all([
          Post.query().with('author').where('id', params.id).where('deleted',0).first(),
          Post.query().whereNotNull('published_at').whereNot('id',params.id).where('deleted',0).fetch(),
          Comment.query().with('replies').where('post_id', params.id).where('parent_id', 0).fetch(),
        ])
        return view.render('blog.post', { post: post.toJSON(), tags: post.toJSON().tags.split(', '), posts: posts.toJSON(), comments: comments.toJSON() })
    }
}

module.exports = BlogController
