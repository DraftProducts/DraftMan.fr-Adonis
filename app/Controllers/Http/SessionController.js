'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')

class SessionController {
  login({view}) {
    return view.render('admin.login')
  }

  register({view}) {
    return view.render('admin.register')
  }

  async store({ session, request, response }) {
    const data = request.only(['username', 'email', 'password', 'password_confirmation'])

    const messages = {
      'username.required': 'Veuillez indiquer votre pseudo.',
      'email.required': 'Veuillez entrer une adresse email valide.',
      'email.email': 'Veuillez entrer une adresse email valide.',
      'username.unique': 'Ce pseudo est déjà utilisé.',
      'email.unique': 'Cette adresse email est déjà utilisé.',
      'password.required': 'Veuillez indiquer votre mot de passe.',
      'password_confirmation.required_if': 'Veuillez répéter votre mot de passe.',
      'password_confirmation.same': 'Veuillez mettre le même mot de passe.'
    }

    const rules = {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
      password_confirmation: 'required_if:password|same:password',
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password_confirmation'])

      return response.redirect('back')
    }

    delete data.password_confirmation

    await User.create(data)
    
    await Mail.send('mails/inscription', data, (message) => {
      message
        .to('<email>')
        .from('no-reply@draftman.fr', 'draftman.fr')
        .subject('Inscription sur DraftMan.fr')
        .replyTo('contact@draftman.fr', 'DraftMan')
    })

    return response.redirect('/')
  }

  async check({ auth, request, response, session }) {
    const {username, password} = request.only(['username','password'])

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
    } catch (e) {

      session.flashExcept(['password'])

      session.flash({
        error: 'Identifiant ou mot de passe incorect'
      })

      return response.redirect('back')
    }

    return response.redirect('/')
  }
}

module.exports = SessionController
