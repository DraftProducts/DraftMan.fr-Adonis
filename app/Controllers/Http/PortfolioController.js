'use strict'

const Portfolio = use('App/Models/Portfolio')
const PortfolioDetails = use('App/Models/PortfolioDetails')
const { validate } = use('Validator')
const Helpers = use('Helpers')
const moment = require('moment')

class PortfolioController {
    async index({ view }){
        const portfolio = (await Portfolio.query().whereNotNull('published_at').orderBy('created_at','desc').fetch()).toJSON();
        return view.render('portfolio.index', {portfolio: portfolio})
    }

    async create({view}){
        const portfolio = (await Portfolio.query().orderBy('created_at','desc').fetch()).toJSON();
        return view.render('portfolio.admin.create', {portfolio})
    }

    async store({request, session, response}){
        const data = request.only(['name', 'description', 'type','published_at']);

        const illustration = request.file('illustration', {
          types: ['image'],
          size: '2mb'
        })

        const messages = {
          'name.unique': 'Ce nom est déjà utilisé.',
          'name.required': 'Veuillez donner un nom à cette création',
          'description.required': 'Veuillez donner une description à cette création',
          'type.required': 'Veuillez préciser le type de projet.',
        }

        const rules = {
          name: 'required|unique:portfolio',
          description: 'required',
          type: 'required'
        }

        const validation = await validate(data, rules, messages)

        if (validation.fails()) {
          session
            .withErrors(validation.messages())
            .flashAll()

          return response.redirect('back')
        }
        if(data.published_at) data.published_at = moment().format('YYYY-MM-DD')

        if(illustration.size != 0){
          data.illustration = `${data.name}.illustration.${new Date().getTime()}.${illustration.subtype}`;
          await illustration.move(Helpers.publicPath('/uploads/portfolio'), {name: data.illustration})

          if(!illustration.moved()){
            session.flash({error: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }else{
          data.illustration = '000-default.png';
        }

        await Portfolio.create(data)

        session.flash({
          saved: 'Création sauvegardé'
        })

        if(data.published_at){
            return response.redirect('/portfolio')
        }else{
            return response.redirect('/admin/portfolio')
        }
    }

    async edit({view,params}){
        let creation = (await Portfolio.findOrFail(params.id)).toJSON();
        const portfolio = (await Portfolio.all()).toJSON();
        if(creation.portfolio_details_id !== null){
            creation = (await Portfolio.query().with('details').where('id','=', params.id).first()).toJSON();
            return view.render('portfolio.admin.edit-details', {portfolio,creation})
        }
        return view.render('portfolio.admin.edit', {portfolio,creation})
    }
    async update({request, session, response,params}){
        const data = request.only(['name', 'description', 'type','published_at']);

        const illustration = request.file('illustration', {
          types: ['image'],
          size: '2mb'
        })

        const messages = {
          'name.unique': 'Ce nom est déjà utilisé.',
          'name.required': 'Veuillez donner un nom à cette création',
          'description.required': 'Veuillez donner une description à cette création',
          'type.required': 'Veuillez préciser le type de projet.',
        }

        const rules = {
          name: `required|unique:portfolio,name,id,${params.id}`,
          description: 'required',
          type: 'required'
        }

        const validation = await validate(data, rules, messages)

        if (validation.fails()) {
          session
            .withErrors(validation.messages())
            .flashAll()

          return response.redirect('back')
        }

        if(data.published_at) data.published_at = moment().format('YYYY-MM-DD')

        if(illustration.size != 0){
          data.illustration = `${data.name}.illustration.${new Date().getTime()}.${illustration.subtype}`;
          await illustration.move(Helpers.publicPath('/uploads/portfolio'), {name: data.illustration})

          if(!illustration.moved()){
            session.flash({error: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }

        const portfolio = await Portfolio.find(params.id)
        portfolio.merge(data)
        await portfolio.save()

        session.flash({
          saved: 'Création sauvegardé'
        })

        return response.redirect('/admin/portfolio')
    }
}

module.exports = PortfolioController
