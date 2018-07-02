'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Mail = use('Mail')
const Helpers = use('Helpers')

const { get, post } = require('snekfetch');
const btoa = require('btoa');

const CLIENT_ID = `462290683630452778`;
const CLIENT_SECRET = `MRxxifIkSVkt9pDVZaU_eV_aGKZFa8KC`;
const cred = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
const redirect = encodeURIComponent('http://127.0.0.1:3333/discord/callback');

class BackofficeProfilController {
  async index({view, session}) {
    const profil = (await User.query().where('username','=',session.get('username')).fetch()).first().toJSON();
    return view.render('dashboard.profil',{user: profil})
  }
  discordLogin({response}) {
    return response.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+email+guilds&response_type=code&redirect_uri=${redirect}`);
  }

  async discordCallback({request,response}) {
    const code = request.get().code;
    console.log(code)
    post(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}`)
    .set('Authorization', `Basic ${cred}`)
    .then(res => response.redirect(`/me/profile?token=${res.body.access_token}`))
    .catch(console.error);
  }

  async storeBasic({session, request, response}){
    const profil = (await User.query().where('username','=',session.get('username')).fetch()).first().toJSON();
    const data = request.only(['username', 'email', 'password', 'password_conf'])

    const image = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    const messages = {
      'email.email': 'Veuillez entrer une adresse email valide.',
      'username.unique': 'Ce pseudo est déjà utilisé.',
      'email.unique': 'Cette adresse email est déjà utilisé.',
      'password_conf.required_if': 'Veuillez répéter votre mot de passe.',
      'password_conf.same': 'Veuillez mettre le même mot de passe.'
    }

    const rules = {
      username: 'unique:users',
      email: 'email|unique:users',
      password_conf: 'required_if:password|same:password',
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password_conf'])

      return response.redirect('back')
    }

    await User.query().where('id', profil.id).update({ 
      username: data.username,
      email: data.email
    })

    session.put("username", data.username);

    if(!data.password.isEmpty()) await User.query().where('id', profil.id).update({password: data.password})

    if(image){
      data.image = `${profil.id}.${profilePic.subtype}`;
      await image.move(Helpers.tmpPath('uploads/users'), {name: data.image})
      await User.query().where('id', profil.id).update({profil: data.image})
    }
    
    session.flash({
      valid_basic: 'Informations modifiés'
    })
    /*await Mail.send('mails/profil_modif', data, (message) => {
      message
        .to('<email>')
        .from('no-reply@draftman.fr', 'draftman.fr')
        .subject('Modification du profil sur DraftMan.fr')
        .replyTo('contact@draftman.fr', 'DraftMan')
    })*/
    return response.redirect('back')
  }

  async storeInfos({session, request, response}){
    const profil = (await User.query().where('username','=',session.get('username')).fetch()).first().toJSON();

    const data = request.only(['website', 'twitter', 'github', 'linkedin'])

    await User.query().where('id', profil.id).update({ 
      website: data.website,
      twitter: data.twitter,
      github: data.github,
      linkedin: data.linkedin
    })

    session.flash({
      valid_infos: 'Informations modifiés'
    })
    
    /*await Mail.send('mails/profil_modif', data, (message) => {
      message
        .to('<email>')
        .from('no-reply@draftman.fr', 'draftman.fr')
        .subject('Modification du profil sur DraftMan.fr')
        .replyTo('contact@draftman.fr', 'DraftMan')
    })*/
    return response.redirect('back')
  }
}

module.exports = BackofficeProfilController
