'use strict'

const CLIENT_ID = `462290683630452778`;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://127.0.0.1:3333/me/profil');

class BackofficeProfilController {
  index({view}) {
    return view.render('dashboard.profil')
  }
  discordLogin({response}) {
    return response.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+email+guilds&response_type=code&redirect_uri=${redirect}`);
  }
}

module.exports = BackofficeProfilController
