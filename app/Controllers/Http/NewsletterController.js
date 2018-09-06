'use strict'

class NewsletterController {
  async store({ request, session, response }){
    const data = request.only(['email'])
    const messages = {
        'email.required': 'Veuillez entrer une adresse email.',
        'email.email': 'Veuillez entrer une adresse email valide.',
        'email.unique': 'Vous êtes déjà abonné à la newsletter.',
    }
    const validation = await validate(data, {email: 'required|email|unique:emails'}, messages)
    if (validation.fails()) {
        session
          .withErrors(validation.messages())
          .flashAll()
          return response.redirect("back")
    }

    await Email.create(data)

    session.flash({newsletter: 'Vous êtes bien inscrit à la newsletter'})

    return response.redirect("back")
  }
}

module.exports = NewsletterController
