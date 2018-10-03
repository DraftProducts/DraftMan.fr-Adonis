'use strict'

class DraftBotController {

  async index({ view }) {
    return view.render('draftbot.index')
  }

  async invite({ response }) {
    response.redirect('https://discordapp.com/oauth2/authorize?client_id=318312854816161792&scope=bot&permissions=1610083521')
  }
}

module.exports = DraftBotController
