'use strict'

const { get, post } = require('snekfetch');
const lodash = require('lodash');

class DraftBotController {

  async show({ view }) {
    return view.render('draftbot.index')
  }

  async index({ view,response }) {
    const res = await get(`http://draftbot.draftman.fr/api/commands`)
    const commands = lodash.flatten(Object.values(res.body.commands))
    return view.render('draftbot.commands',{commands})
  }

  async invite({ response }) {
    response.redirect('https://discordapp.com/oauth2/authorize?client_id=318312854816161792&scope=bot&permissions=1610083521')
  }
}

module.exports = DraftBotController
