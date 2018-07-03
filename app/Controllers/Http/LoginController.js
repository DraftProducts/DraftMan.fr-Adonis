'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Mail = use('Mail')

class LoginController {
  create({view}) {
    return view.render('dashboard.login')
  }

  async store({ auth, request, response, session }) {
    const {email, password} = request.only(['email','password'])

    const messages = {
      'email.required': 'Veuillez entrer une adresse email valide.',
      'email.email': 'Veuillez entrer une adresse email valide.',
      'password.required': 'Veuillez indiquer votre mot de passe.',
    }

    const rules = {
      email: 'required|email',
      password: 'required',
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    try {
      await auth.remember(true).attempt(email, password)
      session.put("email", email);
    } catch (e) {
      session.flashExcept(['password'])
      session.flash({
        error: 'Identifiant ou mot de passe incorect'
      })

      return response.redirect('back')
    }

    return response.redirect('/me/')
  }
}
module.exports = LoginController
