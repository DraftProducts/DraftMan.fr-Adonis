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
        
        try {
            await Mail.send('mails.contact', data, (message) => {
                message
                .to(email_to)
                .from('no-reply@draftman.fr', data.author)
                .subject(data.objet)
                .replyTo('contact@draftman.fr', 'DraftMan')
            })
            session.flash({sent: 'Mail envoyé avec succès'})
        
            response.redirect('back')
        } catch (error) {
            console.log('contact form: '+error.errors)

            session.flash({error: 'Une erreur est survenu, veuillez nous excusez !'})
        
            response.redirect('back')
        }
    }

    async discord({ response }) {response.redirect('https://discordapp.com/invite/p4uzTsf')}
    async twitter({ response }) {response.redirect('https://twitter.com/DraftMan_Dev')}
    async github({ response }) {response.redirect('https://github.com/DraftProducts')}
    async gitlab({ response }) {response.redirect('https://gitlab.com/DraftMan')}
    async facebook({ response }) {response.redirect('https://www.facebook.com/nicovanaarsen')}
    async paypal({ response }) {response.redirect('https://www.paypal.me/draftproducts')}
    async google_plus({ response }) {response.redirect('https://plus.google.com/+DraftMan')}
    async patreon({ response }) {response.redirect('https://www.patreon.com/draftman_dev')}
}

module.exports = ContactController
