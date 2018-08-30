'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Helpers = use('Helpers')
const Env = use('Env')
const Persona = use('Persona')

const { get, post } = require('snekfetch');
const btoa = require('btoa');

const CLIENT_ID = Env.get('DISCORD_ID')
const CLIENT_SECRET = Env.get('DISCORD_SECRET')
const cred = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
const redirect = encodeURIComponent(Env.get('DISCORD_CALLBACK'));

class ProfilController {
  constructor () {
    Persona.updateEmailRules = () => {
      return {
        username: `required|unique:users,username,id,${auth.user.id}`,
        email: `required|email|unique:users,email,id,${auth.user.id}`,
      }
    }
    Persona.updatePasswordRules = () => {
      return {
        old_password: 'required',
        password: 'required'
      }
    }
  }

  async updateProfil ({ request, auth, response }) {
    const profil = request.only(['username', 'email'])
    const passwords =  request.only(['old_password', 'password'])
    passwords.password_confirmation = auth.password
    const user = auth.user
    await Persona.updateProfile(user, profil)
    if(passwords.old_password !== '' || passwords.password !== '') await Persona.updatePassword(user, passwords)
    session.flash({notif: 'Votre profil à bien été sauvegardé !'});
    response.redirect('back')
  }

  async uploadProfil ({ request, auth, response }) {
    const user = auth.user;
    const image = request.file('image', {
      types: ['image'],
      size: '10mb'
    })
    if(image.size != 0){
      const img = `${user.id}.${new Date().getTime()}.${image.subtype}`;
      await image.move(Helpers.publicPath('/uploads/users'), {name: img})
      if(!image.moved()){
        session.flash({error: 'Impossible d\'importer l\'image de profil'})
        return response.redirect('back')
      }
      user.profil = `/uploads/users/${img}`
      await user.save()
    }
    session.flash({notif: 'Votre image de profil à bien été sauvegardé !'});
    response.redirect('back')
  }

  async updateSocial ({ request, auth, response }) {
    const payload = request.only(['website', 'twitter', 'github', 'linkedin'])
    const user = auth.user
    await Persona.updateProfile(user, payload)
    session.flash({notif: 'Vos réseaux sociaux ont bien été sauvegardés !'});
    response.redirect('back')
  }

  discordLogin({response}) {
    return response.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+email&response_type=code&redirect_uri=${redirect}`);
  }

  async discordCallback({request,response,auth}) {
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
}

module.exports = ProfilController
