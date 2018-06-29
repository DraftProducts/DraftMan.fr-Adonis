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

        const blog = (await Post.all()).toJSON();

        return view.render('blog.index', {blog})
    }

    async list({ view }){

        const blog = (await Post.all()).toJSON();

        return view.render('blog.list', {blog})
    }

    article({params, view}){
        return Promise.all([
            Post.find(params.id),
            Post.all(),
            Comments.all()
        ]).then(res => {
            return view.render('blog.post', {
                item: res[0],
                blog: res[1],
                comments: res[2]
            })
        });
    }

    /*
    async search({params, view}){
        return view.render('search', {
            blog: blog.toJSON()
        })
    }
    */
}

module.exports = PostController
