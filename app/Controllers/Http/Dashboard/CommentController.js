'use strict'

const Comment = use('App/Models/Comment')

class CommentController {
  async index({view}) {
    const comments = (await Comment.query().with('post').where('seen',0).fetch()).toJSON()
    return view.render('blog.admin.comments',{comments})
  }

  async valide({params,response}) {
    const comment = await Comment.find(params.id)
    comment.seen = 1
    await comment.save()
    response.redirect('back')
  }

  async destroy({params,response}) {
    const comment = await Comment.find(params.id)
    await comment.delete()
    response.redirect('back')
  }
}

module.exports = CommentController
