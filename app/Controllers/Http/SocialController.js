'use strict'

const Env = use('Env')
const Persona = use('Persona')

const { get, post } = require('snekfetch');
const btoa = require('btoa');

const CLIENT_ID = Env.get('DISCORD_ID')
const CLIENT_SECRET = Env.get('DISCORD_SECRET')
const cred = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
const redirect = encodeURIComponent(Env.get('DISCORD_CALLBACK'));

class SocialController {

  create({response}) {
    return response.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+email&response_type=code&redirect_uri=${redirect}`);
  }

  async store({request,response,auth,session}) {
    const code = await request.get().code;
    const res = await post(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`).set('Authorization', `Basic ${cred}`)
    const resp = await get('https://discordapp.com/api/v6/users/@me').set('Authorization', `Bearer ${res.body.access_token}`)

    auth.user.discord_username = resp.body.username,
    auth.user.discord_discriminator = resp.body.discriminator,
    auth.user.discord_email = resp.body.email,
    auth.user.discord_image = `https://cdn.discordapp.com/avatars/${resp.body.id}/${resp.body.avatar}?size=256`
    auth.user.profil = `https://cdn.discordapp.com/avatars/${resp.body.id}/${resp.body.avatar}?size=256`
    await auth.user.save()
    session.flash({notif: 'Votre compte discord a bien été sauvegardé'});
    response.redirect('/me/profil')
  }

  async update ({ request, auth, response,session }) {
    const payload = request.only(['website', 'twitter', 'github', 'linkedin'])
    const user = auth.user
    await Persona.updateProfile(user, payload)
    session.flash({notif: 'Vos réseaux sociaux ont bien été sauvegardés !'});
    response.redirect('back')
  }

  discord({ response }) {
    response.redirect('https://discord.gg/Z6vCrMg')
  }

  twitter({ response }) {
    response.redirect('https://twitter.com/DraftMan_Dev')
  }

  github({ response }) {
    response.redirect('https://github.com/DraftProducts')
  }

  gitlab({ response }) {
    response.redirect('https://gitlab.com/DraftMan')
  }

  facebook({ response }) {
    response.redirect('https://www.facebook.com/nicovanaarsen')
  }

  paypal({ response }) {
    response.redirect('https://www.paypal.me/draftproducts')
  }

  google_plus({ response }) {
    response.redirect('https://plus.google.com/+DraftMan')
  }

  patreon({ response }) {
    response.redirect('https://www.patreon.com/draftman_dev')
  }
}

module.exports = SocialController
