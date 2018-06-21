'use strict'

const Blog = use('App/Models/Portfolio')

class BlogController {
    async index({ view }){

        const blog = await Blog.all();

        return view.render('blog.index', {
            blog: blog.toJSON()
        })
    }

    async article({params, view}){

        const post = await Blog.find(params.id)

        return view.render('blog.details', {
            item: post
        })
    }
}

module.exports = BlogController
