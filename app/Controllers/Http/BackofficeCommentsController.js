'use strict'

const Comment = use('App/Models/Comment')

class BackofficeCommentsController {
  async index({view,auth}) {
    const user = await auth.user.toJSON();
    const comments = await Comment.query().with('post').where('seen','=',0).fetch()
    return view.render('dashboard.comments',{user,comments: comments.toJSON()})
  }
}

module.exports = BackofficeCommentsController
