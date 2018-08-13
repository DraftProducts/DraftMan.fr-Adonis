'use strict'

const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')
const { validate } = use('Validator')
const Helpers = use('Helpers')
const moment = require('moment')

class BlogController {
    // index = Liste tes posts
    // create = Afficher le formulaire de création
    // store = Stocker ton post
    // show = Afficher un post
    // edit = Afficher le formulaire de modificaton
    // update = Met à jour ton post
    // destroy = Détruire ton post

    async accueil({ view }){
        const posts = (await Post.query().limit(3).fetch()).toJSON();
        return view.render('index', {posts})
    }

    async index({ view }){
        const posts = (await Post.query().with('author').whereNotNull('published_at').fetch()).toJSON();
        return view.render('blog.index', {posts})
    }

    async create({ view }){
        return view.render('dashboard.write')
    }

    async edit({ view, params }){
        const post = (await Post.find(params.id)).toJSON()
        return view.render('dashboard.post-edit', {post})
    }

    async store({ request, session, response, auth }){
        const data = request.only(['title', 'url', 'description', 'tags','content','image','published_at']);

        const image = request.file('image', {
          types: ['image'],
          size: '2mb'
        })
    
        const messages = {
          'title.required': 'Veuillez ajouter un titre à votre article.',
          'title.unique': 'Ce titre est déjà utilisé.',
          'url.required': 'Veuillez ajouter une url à votre article pour le SEO.',
          'url.unique': 'Cette url est déjà utilisé.',
          'description.required': 'Veuillez ajouter une descrption de votre article pour le SEO.',
          'tags.required': 'Veuillez ajouter les mots clés pour article pour le SEO.',
          'content.required': 'Veuillez ajouter un contenu à votre article.'
        }
    
        const rules = {
          title: 'required|unique:posts',
          url: 'required|unique:posts',
          description: 'required',
          tags: 'required',
          content: 'required'
        }
    
        const validation = await validate(data, rules, messages)
    
        if (validation.fails()) {
          session
            .withErrors(validation.messages())
            .flashAll()
    
          return response.redirect('back')
        }
console.log(moment.format())
        if(data.published_at) data.published_at === moment.format()
        
        data.author_id = auth.user.id

        data.image = `${data.url}.${new Date().getTime()}.${image.subtype}`;
        await image.move(Helpers.publicPath('/uploads/posts'), {name: data.image})

        await Post.create(data)
        
        session.flash({
          article_posted: 'Article sauvegardé'
        })

        if(data.published_at != null){
            return response.redirect('/blog')
        }else{
            return response.redirect('/me/articles')
        }
    }

    async update({ request, session, response }){
        const data = request.only(['title', 'url', 'description', 'tags','content','image','published_at']);

        const image = request.file('image', {
          types: ['image'],
          size: '2mb'
        })
    
        const messages = {
          'title.required': 'Veuillez ajouter un titre à votre article.',
          'title.unique': 'Ce titre est déjà utilisé.',
          'url.required': 'Veuillez ajouter une url à votre article pour le SEO.',
          'url.unique': 'Cette url est déjà utilisé.',
          'description.required': 'Veuillez ajouter une descrption de votre article pour le SEO.',
          'tags.required': 'Veuillez ajouter les mots clés pour article pour le SEO.',
          'content.required': 'Veuillez ajouter un contenu à votre article.',
          'image.required': 'Veuillez ajouter une image à votre article.'
        }
    
        const rules = {
          title: 'required|unique:posts',
          url: 'required|unique:posts',
          description: 'required',
          tags: 'required',
          content: 'required',
          image: 'required',
        }
    
        const validation = await validate(data, rules, messages)
    
        if (validation.fails()) {
          session
            .withErrors(validation.messages())
            .flashAll()
    
          return response.redirect('back')
        }

        if(data.published_at) data.published_at === Date().now()
        
        data.author_id = auth.user.id

        if(image){
            data.image = `${data.url}.${image.subtype}`;
            await image.move(Helpers.tmpPath('/uploads/posts/'), {name: data.image})
        }else if(data.url){

        }

        await Post.create(data)
        
        session.flash({
          article_posted: 'Article sauvegardé'
        })

        return response.redirect('back')
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

    async delete ({ params,auth,response }){
        const post = (await Post.find(params.id))
        if(post.author.email === auth.user.email){
            post.update({ delete: 1 })
        }
        response.redirect('/me/articles')
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
            .flashAll()

            return response.redirect('back')
        }

        const comment = await Comment.create(data)

        console.log(comment)

        return response.redirect('back')
    }
}

module.exports = BlogController
