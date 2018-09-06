'use strict'

const Post = use('App/Models/Post');

class PageController {
  async home({ view }){

    const posts = (await Post.query().whereNotNull('published_at').where('deleted',0).limit(3).fetch()).toJSON();

    return view.render('index', {posts})
  }
}

module.exports = PageController
