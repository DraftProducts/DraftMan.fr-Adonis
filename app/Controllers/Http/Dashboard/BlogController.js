'use strict'

const Post = use('App/Models/Post')
const Email = use('App/Models/Email')
const Comment = use('App/Models/Comment')
const { validate } = use('Validator')
const Helpers = use('Helpers')
const moment = require('moment')

class BlogController {
    // index = Liste tes posts
    // create = Afficher le formulaire de création
    // store = Stocker ton post
    // show = Afficher un post
    // edit = Afficher le formulaire de modificaton&²&&&
    // update = Met à jour ton post
    // destroy = Détruire ton post

    async index({view}) {
      const articles = (await Post.query().with('author').where('deleted',0).fetch()).toJSON()
      return view.render('blog.admin.articles',{articles})
    }

    async create({ view }){
        return view.render('blog.admin.write')
    }

    async edit({ view, params }){
        const post = (await Post.find(params.id)).toJSON()
        return view.render('blog.admin.edit', {post})
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
        if(data.published_at) data.published_at = moment().format('YYYY-MM-DD')

        data.author_id = auth.user.id

        if(image.size != 0){
          data.image = `${data.url}.${new Date().getTime()}.${image.subtype}`;
          await image.move(Helpers.publicPath('/uploads/posts'), {name: data.image})

          if(!image.moved()){
            session.flash({error: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }else{
          data.image = '000-default.png';
        }

        await Post.create(data)

        session.flash({
          article_posted: 'Article sauvegardé'
        })

        if(data.published_at){
            return response.redirect('/blog')
        }else{
            return response.redirect('/me/articles')
        }
    }

    async update({ request, session, response,params }){
        const data = request.only(['title', 'url', 'description', 'tags','content','published_at']);

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
          title: `required|unique:posts,title,id,${params.id}`,
          url: `required|unique:posts,url,id,${params.id}`,
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

        if(data.published_at != undefined) data.published_at = moment().format('YYYY-MM-DD')

        if(image.size != 0){
          data.image = `${data.url}.${new Date().getTime()}.${image.subtype}`;
          await image.move(Helpers.publicPath('/uploads/posts'), {name: data.image})

          if(!image.moved()){
            session.flash({error: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }

        const post = await Post.find(params.id)
        post.merge(data)
        await post.save()

        session.flash({
          article_posted: 'Article sauvegardé'
        })
        return response.redirect('back')
    }

    async show ({ params, view }){
        const [post, posts] = await Promise.all([
          Post.query().with('author').where('id', params.id).where('deleted',0).first(),
          Post.query().where('deleted',0).fetch()
        ])
        return view.render('blog.admin.post', { post: post.toJSON(), tags: post.toJSON().tags.split(', '), posts: posts.toJSON() })
    }

    async destroy ({ params,auth,response }){
        const post = (await Post.find(params.id))
        if(post.author.email === auth.user.email){
            post.deleted = 1
            await post.save()
        }
        response.redirect('/me/articles')
    }
}

module.exports = BlogController
