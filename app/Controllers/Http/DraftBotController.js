'use strict'

class DraftBotController {

  async index({ response,view }) {
    return view.render('draftbot.index')
  }

  async invite({ response }) {
    response.redirect('https://discordapp.com/oauth2/authorize?client_id=318312854816161792&scope=bot&permissions=506981502')
  }
}

module.exports = DraftBotController
