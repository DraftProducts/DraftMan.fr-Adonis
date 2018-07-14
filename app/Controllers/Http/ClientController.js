'use strict'

class ClientController {
  async client({view,auth}) {
    const profil = auth.user.toJSON();
    return view.render('dashboard.client',{user: profil})
  }
  async dashboard({view,auth}) {
    const profil = auth.user.toJSON();
    return view.render('dashboard.client_dashboard',{user: profil})
  }
}

module.exports = ClientController
