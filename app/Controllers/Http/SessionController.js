'use strict'

const Persona = use('Persona')

class LoginController {
  constructor () {
    Persona.loginRules = function () {
      return {
        uid: 'required|email',
        password: 'required'
      }
    }
  }

  create ({view}){ return view.render('auth.login')}

  async store ({ request, auth, response, session }) {
    const payload = request.only(['uid', 'password'])
    const user = await Persona.verify(payload)
    await auth.remember(true).login(user)
    session.flash({notif: 'Vous êtes maintenant connecté'})
    return response.redirect('/me/')
  }

  async destroy ({ response, auth, session }) {
    await auth.logout();
    session.flash({account_logout: 'Vous vous êtes déconnecté avec succès'})
    return response.redirect("/login");
  }
}
module.exports = LoginController
