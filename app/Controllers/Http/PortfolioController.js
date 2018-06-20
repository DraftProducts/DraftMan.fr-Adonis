'use strict'

const Portfolio = use('App/Models/Portfolio')

class PortfolioController {
    async index({ view }){

        const portfolio = await Portfolio.all();

        return view.render('portfolio.index', {
            portfolio: portfolio.toJSON()
        })
    }

    async details({params, view}){

        const project = await Portfolio.find(params.id)

        return view.render('portfolio.details', {
            item: project
        })
    }
}

module.exports = PortfolioController
