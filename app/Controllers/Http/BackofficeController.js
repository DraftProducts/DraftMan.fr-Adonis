'use strict'

const User = use('App/Models/User')
const Comment = use('App/Models/Comment')

class BackofficeController {
  async index({view,auth}) {
    const profil = auth.user.toJSON();
    return view.render('dashboard.accueil',{user: profil})
  }

  async comments({view,auth}) {
    const user = await auth.user.toJSON();
    const comments = (await Comment.query().with('post').where('seen','=',0).fetch()).toJSON()
    return view.render('dashboard.comments',{user,comments})
  }

  async destroy_comment({params,response}) {
    const comment = await Comment.find(params.id)
    comment.seen = 1
    await comment.save()
    response.redirect('back')
  }
  
  async valide_comment({params,response}) {
    const comment = await Comment.find(params.id)
    await comment.delete()
    response.redirect('back')
  }
}

module.exports = BackofficeController
