'use strict'

const User = use('App/Models/User')

class BackofficeAccueilController {
  async index({view, session,auth}) {
    const profil = auth.user.toJSON();
    return view.render('dashboard.accueil',{user: profil})
  }
}

module.exports = BackofficeAccueilController
