'use strict'

const Email = use('App/Models/Email')
const Persona = use('Persona')

class RegisterController {
  constructor () {
    Persona.registerationRules = () => {
      return {
        username: 'required|unique:users',
        email: 'required|email|unique:users',
        password: 'required|confirmed'
      }
    }
    Persona.updateEmailRules = () => {
      return {
        username: `required|unique:users,username,id,${auth.user.id}`,
        email: `required|email|unique:users,email,id,${auth.user.id}`,
      }
    }
    Persona.updatePasswordRules = () => {
      return {
        old_password: 'required',
        password: 'required'
      }
    }
  }

  create ({view}){ return view.render('auth.register') }

  async store ({ request, auth, response,session }) {
    const payload = request.only(['username', 'email', 'password', 'password_confirmation'])
    await Email.findOrCreate({ email: payload.email },{ email: payload.email })
    const user = await Persona.register(payload)
    await auth.login(user)
    session.flash({notif: 'Compte crée avec succès'})
    response.redirect('/me/')
  }

  async update ({ request, auth, response }) {
    const profil = request.only(['username', 'email'])
    const passwords =  request.only(['old_password', 'password'])
    passwords.password_confirmation = auth.password
    const user = auth.user
    await Persona.updateProfile(user, profil)
    if(passwords.old_password !== '' || passwords.password !== '') await Persona.updatePassword(user, passwords)
    session.flash({notif: 'Votre profil à bien été sauvegardé !'});
    response.redirect('back')
  }

  async destroy ({ response, auth, session }) {
    await auth.user.delete()
    session.flash({account_logout: 'Votre compte à été supprimé avec succès'})
    return response.redirect("/login");
  }
}

module.exports = RegisterController
