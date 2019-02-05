'use strict'

class DraftBotController {

  async show({ view }) {
    response.redirect('https://www.draftbot.fr/',false, 301)
  }

  async index({ response }) {
    response.redirect('https://www.draftbot.fr/commandes', false, 301)
  }

  async invite({ response }) {
    response.redirect('https://www.draftbot.fr/invite', false, 301)
  }
}

module.exports = DraftBotController
