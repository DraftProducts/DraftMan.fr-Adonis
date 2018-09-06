'use strict'

const Portfolio = use('App/Models/Portfolio')
const PortfolioDetails = use('App/Models/PortfolioDetails')
const { validate } = use('Validator')
const Helpers = use('Helpers')
const moment = require('moment')

class PortfolioController {
    async show({params, view}){
        // const project = (await Portfolio.query().with('details').where('id',params.id).whereNotNull('published_at').first()).toJSON();
        return view.render('portfolio.details')
    }

    async update({request, session, response,params}){
        const data = request.only(['name', 'url', 'description', 'type','problematique','presentation','presentation','published_at']);

        const illustration = request.file('illustration', {
            types: ['image'],
            size: '2mb'
        })

        const logo = request.file('logo', {
            types: ['image'],
            size: '2mb'
        })

        const graph = request.file('graph', {
            types: ['image'],
            size: '6mb'
        })

        const messages = {
          'name.unique': 'Ce nom est déjà utilisé.',
          'name.required': 'Veuillez donner un nom à cette création',
          'description.required': 'Veuillez donner une description à cette création',
          'type.required': 'Veuillez préciser le type de projet.'
        }

        const rules = {
          name: `required|unique:portfolio,name,id,${params.id}`,
          description: 'required',
          type: 'required',
          url: 'required'
        }

        const validation = await validate(data, rules, messages)

        if (validation.fails()) {
          session
            .withErrors(validation.messages())
            .flashAll()

          return response.redirect('back')
        }

        const portfolio = await Portfolio.find(params.id)
        const portfolioDetails = await PortfolioDetails.findBy('portfolio_id',params.id)

        const basics = {
            name: data.name,
            description: data.description,
            type: data.type,
            url: data.url
        }
        const details = {
            problematique: data.problematique,
            presentation: data.presentation,
            technique: data.technique,
            folder: data.name
        }
        if(illustration.size != 0){
          data.illustration = `${data.name}.illustration.${new Date().getTime()}.${illustration.subtype}`;
          await illustration.move(Helpers.publicPath('/uploads/portfolio'), {name: data.illustration})

          if(!illustration.moved()){
            session.flash({illustration: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }
        if(logo.size != 0){
          data.logo = `${data.name}.logo.${new Date().getTime()}.${logo.subtype}`;
          await logo.move(Helpers.publicPath('/uploads/portfolio'), {name: data.logo})

          if(!logo.moved()){
            session.flash({logo: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }else if(portfolioDetails.logo === null){
          data.illustration = '000-default-logo.png';
        }
        if(graph.size != 0){
          data.graph = `${data.name}.graph.${new Date().getTime()}.${graph.subtype}`;
          await graph.move(Helpers.publicPath('/uploads/portfolio'), {name: data.graph})

          if(!graph.moved()){
            session.flash({graph: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }

        if(data.published_at) basics.published_at = moment().format('YYYY-MM-DD')

        portfolio.merge(basics)
        await portfolio.save()

        portfolioDetails.merge(details)
        await portfolioDetails.save()

        session.flash({
          saved: 'Création sauvegardé'
        })

        return response.redirect('/admin/portfolio')
    }
    async upgrade({params, response}){
        const portfolio = await Portfolio.findOrFail(params.id)
        if(portfolio.portfolio_details_id !== null) return response.redirect('back')
        const details = new PortfolioDetails()
        details.portfolio_id = params.id
        await details.save()
        await Portfolio.query().where('id',details.portfolio_id).update({'portfolio_details_id':details.id})
        return response.redirect('back')
    }
    async decline({params, response}){
        const portfolio = await Portfolio.findOrFail(params.id)
        const details = await PortfolioDetails.findOrFail(portfolio.portfolio_details_id)
        portfolio.portfolio_details_id = null
        await portfolio.save()
        await details.delete()
        return response.redirect('back')
    }
}

module.exports = PortfolioController
