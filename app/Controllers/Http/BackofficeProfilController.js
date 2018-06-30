'use strict'

const User = use('App/Models/User')

const CLIENT_ID = `462290683630452778`;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://127.0.0.1:3333/me/profil');

class BackofficeProfilController {
  async index({view, session}) {
    const profil = (await User.query().where('username','=',session.get('username')).fetch()).toJSON();
    return view.render('dashboard.profil',{user: profil})
  }
  discordLogin({response}) {
    return response.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+email+guilds&response_type=code&redirect_uri=${redirect}`);
  }
}

module.exports = BackofficeProfilController
