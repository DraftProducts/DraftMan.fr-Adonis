'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Emails = use('App/Models/Email')
const Mail = use('Mail')
const Persona = use('Persona')

class AuthController {
  constructor () {
    Persona.registerationRules = () => {
      return {
        username: 'required|unique:users',
        email: 'required|email|unique:users',
        password: 'required|confirmed'
      }
    }
    Persona.loginRules = function () {
      return {
        uid: 'required|email',
        password: 'required'
      }
    }
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

  async register ({ request, auth, response }) {
    const payload = request.only(['username', 'email', 'password', 'password_confirmation'])
    await Emails.findOrCreate({ email: payload.email },{ email: payload.email })
    const user = await Persona.register(payload)
    await auth.login(user)
    session.flash({notif: 'Compte crée avec succès'})
    response.redirect('/me/')
  }

  async login ({ request, auth, response }) {
    const payload = request.only(['uid', 'password'])
    const user = await Persona.verify(payload)
    await auth.remember(true).login(user)
    session.flash({notif: 'Vous êtes maintenant connecté'})
    response.redirect('/me/')
  }

  async verify ({response, params }) {
    const token = use('Encryption').base64Decode(params.token)
    await Persona.verifyEmail(token)
    response.redirect('/me/')
  }

  async forgotPassword ({ request }) {
    await Persona.forgotPassword(request.input('uid'))
  }

  async updatePasswordByPage ({ view,params}) {
    const token = params.token
    return view.render('auth.new-password', {token})
  }
  async updatePasswordByToken ({ request,response, params,auth }) {
    const token = use('Encryption').base64Decode(params.token)
    const payload = request.only(['password', 'password_confirmation'])

    const user = await Persona.updatePasswordByToken(token, payload)
    await auth.remember(true).login(user)
    response.redirect('/me/')
  }

  // async register({ session, request, response }) {

  //   const messages = {
  //     'username.required': 'Veuillez indiquer votre pseudo.',
  //     'email.required': 'Veuillez entrer une adresse email valide.',
  //     'email.email': 'Veuillez entrer une adresse email valide.',
  //     'username.unique': 'Ce pseudo est déjà utilisé.',
  //     'email.unique': 'Cette adresse email est déjà utilisé.',
  //     'password.required': 'Veuillez indiquer votre mot de passe.',
  //     'password_conf.required_if': 'Veuillez répéter votre mot de passe.',
  //     'password_conf.same': 'Veuillez mettre le même mot de passe.'
  //   }

  //   const rules = {
  //     username: 'required|unique:users',
  //     email: 'required|email|unique:users',
  //     password: 'required',
  //     password_conf: 'required_if:password|same:password',
  //   }

  //   const data = request.only(['username', 'email', 'password', 'password_conf'])
  //   data.role = 0;

  //   const validation = await validate(data, rules, messages)

  //   if (validation.fails()) {
  //     session
  //       .withErrors(validation.messages())
  //       .flashExcept(['password_conf'])

  //     return response.redirect('back')
  //   }

  //   delete data.password_conf


  //   await User.create(data)
  //   await Emails.findOrCreate({ email: data.email },{ email: data.email })

  //   session.flash({
  //     account_created: 'Compte crée avec succès'
  //   })

  //   try {
  //       await Mail.send('mails.inscription', data, (message) => {
  //           message
  //           .to(data.email)
  //           .from('no-reply@draftman.fr', 'draftman.fr')
  //           .subject('Inscription sur DraftMan.fr')
  //           .replyTo('contact@draftman.fr', 'DraftMan')
  //       })
  //   } catch (error) {
  //       console.log('inscription mail: '+error.errors)
  //   }

  //   return response.redirect('/login')
  // }

  // async login({ auth, request, response, session }) {
  //   const {email, password} = request.only(['email','password'])

  //   const messages = {
  //     'email.required': 'Veuillez entrer une adresse email valide.',
  //     'email.email': 'Veuillez entrer une adresse email valide.',
  //     'password.required': 'Veuillez indiquer votre mot de passe.',
  //   }

  //   const rules = {
  //     email: 'required|email',
  //     password: 'required',
  //   }

  //   const validation = await validate(request.all(), rules, messages)

  //   if (validation.fails()) {
  //     session
  //       .withErrors(validation.messages())
  //       .flashExcept(['password'])

  //     return response.redirect('back')
  //   }

  //   try {
  //     await auth.remember(true).attempt(email, password);
  //   } catch (e) {
  //     session.flashExcept(['password'])
  //     session.flash({error: 'Identifiant ou mot de passe incorect'})
  //     return response.redirect('back')
  //   }

  //   return response.redirect('/me/')
  // }

  async logout ({ response, auth, session }) {
    await auth.logout();
    session.flash({account_logout: 'Vous vous êtes déconnecté avec succès'})
    return response.redirect("/login");
  }
}
module.exports = AuthController
