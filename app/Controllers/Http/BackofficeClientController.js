'use strict'

// const { validate } = use('Validator')
const User = use('App/Models/User')
// const Mail = use('Mail')

class BackofficeProfilController {
  async index({view, session,auth}) {
    const profil = auth.user.toJSON();
    return view.render('dashboard.client',{user: profil})
  }
}

module.exports = BackofficeProfilController
