'use strict'

const Mail = use('Mail')
const { validate } = use('Validator')
const moment = require('moment')
moment.locale('fr');

class ContactController {
    async send({ request, session, response,auth }) {

        const data = request.only(['email', 'objet', 'author','twitter','discord','commentconnu','message'])
        
        if(auth.user){
            data.author = auth.user.username,
            data.email = auth.user.email,
            data.twitter = auth.user.twitter,
            data.discord = `${auth.user.discord_username}#${auth.user.discord_discriminator}`
        }

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

        data.date = moment().format('LLLL')
    
        const email_to = 'nicovanaarsen@gmail.com';
        
            await Mail.send('mails.contact', data, (message) => {
                message
                .to(email_to)
                .from(data.email, data.author)
                .subject(data.objet)
                .replyTo('contact@draftman.fr', 'DraftMan')
            })
        
        session.flash({sent: 'Mail envoyé avec succès'})
        
        response.redirect('back')
    }
}

module.exports = ContactController
