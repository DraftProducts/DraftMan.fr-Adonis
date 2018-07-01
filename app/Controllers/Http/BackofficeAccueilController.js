'use strict'

const User = use('App/Models/User')

class BackofficeAccueilController {
  async index({view, session}) {
    const profil = (await User.query().where('username','=',session.get('username')).fetch()).first().toJSON();
    return view.render('dashboard.accueil',{user: profil})
  }
}

module.exports = BackofficeAccueilController
