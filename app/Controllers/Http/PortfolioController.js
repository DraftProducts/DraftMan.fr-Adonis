'use strict'

const Portfolio = use('App/Models/Portfolio')

class PortfolioController {
    async index({ view }){

        const portfolio = await (Portfolio.all()).toJSON();

        return view.render('portfolio.index', {portfolio: portfolio})
    }

    async details({params, view}){

        const project = await (Portfolio.find(params.id)).toJSON();

        return view.render('portfolio.details', {project})
    }
}

module.exports = PortfolioController
