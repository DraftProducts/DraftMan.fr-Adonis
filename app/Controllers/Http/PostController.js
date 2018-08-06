'use strict'

const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')
const { validate } = use('Validator')

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

    async create({ view }){
        const posts = (await Post.query().where('posted', 1).fetch()).toJSON();
        return view.render('dashboard.write', {posts})
    }

    async list({ view }){

        const posts = (await Post.all()).toJSON();

        return view.render('blog.list', {posts})
    }

    async show ({ params, view }){
        const [post, posts, comments] = await Promise.all([
          Post.query().with('author').where('id', params.id).first(),
          Post.all(),
          Comment.query().with('replies').where('post_id', params.id).where('parent_id', '=', 0).fetch(),
        ])
        return view.render('blog.post', { post: post.toJSON(), tags: post.toJSON().tags.split(', '), posts: posts.toJSON(), comments: comments.toJSON() })
    }

    async comment ({ request,session, params,response, auth}){

        const data = request.only(['name', 'email', 'website','twitter','github','linkedin','content','parent_id'])
        data.post_id = params.id
        data.seen = 0
        
        if(!data.parent_id) data.parent_id = 0

        if(auth.user){
            console.log('connecté')
            data.name = auth.user.username
            data.email = auth.user.email
            data.website = auth.user.website
            data.twitter = auth.user.twitter
            data.github = auth.user.github
            data.linkedin = auth.user.linkedin
        }

        const messages = {
            'name.required': 'Veuillez indiquer votre pseudo.',
            'email.required.email': 'Veuillez entrer une adresse email valide.',
            'content.required': 'Veuillez entrer votre message.'
        }

        const rules = {
          name: 'required',
          email: 'required|email',
          content: 'required'
        }

        const validation = await validate(data, rules, messages)

        if (validation.fails()) {
            session
            .withErrors(validation.messages())
            .flashExcept()

            return response.redirect('back')
        }

        const comment = await Comment.create(data)

        console.log(comment)

        return response.redirect('back')
    }
}

module.exports = PostController
