'use strict'

const Portfolio = use('App/Models/Portfolio')

class PortfolioController {
    async index({ view }){

        const portfolio = await Portfolio.all();

        return view.render('portfolio.index', {
            portfolio: portfolio.toJSON()
        })
    }
}

module.exports = PortfolioController
