'use strict'

const User = use('App/Models/User')

class BackofficeCommentsController {
  async index({view,auth}) {
    const profil = auth.user.toJSON();
    return view.render('dashboard.comments',{user: profil})
  }
}

module.exports = BackofficeCommentsController
