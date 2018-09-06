'use strict'

const Emails = use('App/Models/Email')
const Persona = use('Persona')

class PasswordController {
    // create = Afficher le formulaire de création
    // store = Stocker ton post
    // show = Afficher un post
    // edit = Afficher le formulaire de modificaton
    // update = Met à jour ton post
    // destroy = Détruire ton post
  constructor () {
    Persona.updatePasswordRules = function (enforceOldPassword = false) {
      if (!enforceOldPassword) {
        return {
          password: 'required|confirmed'
        }
      }
      return {
        old_password: 'required',
        password: 'required|confirmed'
      }
    }
  }
  create ({ view }) {
    return view.render('auth.password')
  }
  async store ({ request,response,session }) {
    await Persona.forgotPassword(request.input('uid'))
    session.flash({notif: 'Un mail vous a été envoyé pour pouvoir changer votre mot de passe'})
    response.redirect('/login')
  }
  async edit ({ view,params}) {
    const token = params.token
    return view.render('auth.new-password', {token})
  }
  async update ({ request,response, params,auth,session }) {
    const token = use('Encryption').base64Decode(params.token)
    const payload = request.only(['password', 'password_confirmation'])

    const user = await Persona.updatePasswordByToken(token, payload)
    await auth.remember(true).login(user)
    session.flash({notif: 'Votre mot de passe a bien été changé'})
    response.redirect('/me/')
  }
}
module.exports = PasswordController
