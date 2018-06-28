'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Mail = use('Mail')

class SessionController {
  create({view}) {
    return view.render('admin.login')
  }

  async store({ auth, request, response, session }) {
    const {username, password,role} = request.only(['username','password','role'])

    const messages = {
      'username.required': 'Veuillez indiquer votre pseudo.',
      'password.required': 'Veuillez indiquer votre mot de passe.',
    }

    const rules = {
      username: 'required',
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
      await auth.attempt(username, password)
      session.put("username", username);
      session.put("role", role);
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
module.exports = SessionController
