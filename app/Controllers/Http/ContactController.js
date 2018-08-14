'use strict'

const Mail = use('Mail')
const { validate } = use('Validator')

class ContactController {
    async send({ request, session, response }) {

        const data = request.only(['email', 'objet', 'author','twitter','discord','commentconnu','message'])

        const messages = {
            'author.required': 'Veuillez indiquer votre identité.',
            'email.required': 'Veuillez entrer une adresse email valide.',
            'objet.required': 'Veuillez entrer l\'objet de votre mail.',
            'message.required': 'Veuillez indiquer un message a envoyer.',
            'commentconnu.required': 'Veuillez indiquer comment vous avez connu DraftMan.'
        }

        const rules = {
          author: 'required',
          email: 'required|email',
          objet: 'required',
          message: 'required',
          commentconnu: 'required',
        }
    
        const validation = await validate(data, rules, messages)

        if (validation.fails()) {
            session
            .withErrors(validation.messages())
            .flashAll()

            return response.redirect('back')
        }
    
        const email_to = 'contact@draftman.fr';
    
        await Mail.send('mails/contact', data, (message) => {
          message
            .to(email_to)
            .from('<email>', '<author>')
            .subject('<objet>')
            .replyTo('<email>', '<author>')
        })
    }
}

module.exports = ContactController
