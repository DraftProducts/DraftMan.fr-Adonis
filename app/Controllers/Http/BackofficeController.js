'use strict'

const User = use('App/Models/User')
const Comment = use('App/Models/Comment')

class BackofficeController {
  async index({view}) {
    return view.render('dashboard.accueil')
  }

  async comments({view}) {
    const comments = (await Comment.query().with('post').where('seen','=',0).fetch()).toJSON()
    return view.render('dashboard.comments',{comments})
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
