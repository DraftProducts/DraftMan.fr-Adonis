'use strict'

const Mail = use('Mail')
const { validate } = use('Validator')

class ContactController {
    async index({ view }){
        return view.render('contact')
    }

    async verify ({ request, session, response }) {

        const messages = {
            'email.required': 'Veuillez entrer une adresse email valide.',
            'objet.required': 'Veuillez entrer l\'objet de votre mail.',
            'author.required': 'Veuillez indiquer votre identité.',
            'author.required': 'Veuillez indiquer un message a envoyer.'
        }

        const rules = {
          email: 'required|email',
          objet: 'required',
          message: 'required',
          author: 'required',
        }
    
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
            return validation.messages()
        }
    
        return 'Validation passed'
    }
    async sendMail ({ request }) {
        const email_to = 'contact@draftman.fr';
        const data = request.only(['email', 'objet', 'author','twitter','discord','commentconnu','message'])
        const user = await User.create(data)
    
        await Mail.send('mails/contact', user.toJSON(), (message) => {
          message
            .to(user.email)
            .from('author-<email>')
            .subject('<objet>')
        })
    
        return 'Mail send'
    }
}

module.exports = ContactController
