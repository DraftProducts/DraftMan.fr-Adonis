'use strict'

const Comment = use('App/Models/Comment')
const Post = use('App/Models/Post')

class BackofficeController {
  async comments({view}) {
    const comments = (await Comment.query().with('post').where('seen',0).fetch()).toJSON()
    return view.render('dashboard.comments',{comments})
  }

  async articles({view}) {
    const articles = (await Post.query().with('author').fetch()).toJSON()
    return view.render('dashboard.articles',{articles})
  }

  async valide_comment({params,response}) {
    const comment = await Comment.find(params.id)
    comment.seen = 1
    await comment.save()
    response.redirect('back')
  }
  
  async destroy_comment({params,response}) {
    const comment = await Comment.find(params.id)
    await comment.delete()
    response.redirect('back')
  }
}

module.exports = BackofficeController
