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

    async show({params, view}){
        // const project = (await Portfolio.query().with('details').where('id',params.id).whereNotNull('published_at').first()).toJSON();
        return view.render('portfolio.details')
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

        if(data.published_at){
            return response.redirect('/portfolio')
        }else{
            return response.redirect('/admin/portfolio')
        }
    }
    async updateDetails({request, session, response,params}){
        const data = request.only(['name', 'url', 'description', 'type','color1','color2','color3','color4','color5','typographie1','typographie2','problematique','presentation','presentation','published_at']);

        const illustration = request.file('illustration', {
            types: ['image'],
            size: '2mb'
        })

        const logo = request.file('logo', {
            types: ['image'],
            size: '2mb'
        })

        const messages = {
          'name.unique': 'Ce nom est déjà utilisé.',
          'name.required': 'Veuillez donner un nom à cette création',
          'description.required': 'Veuillez donner une description à cette création',
          'type.required': 'Veuillez préciser le type de projet.',
          'typographie1.required': 'Veuillez indiquer la typographie n°1.',
          'typographie2.required': 'Veuillez indiquer la typographie n°2.',
        }

        const rules = {
          name: `required|unique:portfolio,name,id,${params.id}`,
          description: 'required',
          type: 'required',
          typographie1: 'required',
          typographie2: 'required',
          url: 'required',
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
            colors: JSON.stringify({color1: data.color1,color2: data.color2,color3: data.color3,color4: data.color4,color5: data.color5}),
            typographie1: data.typographie1,
            typographie2: data.typographie2,
            problematique: data.problematique,
            presentation: data.presentation,
            technique: data.technique,
            folder: data.name
        }
        if(illustration.size != 0){
          data.illustration = `${data.name}.illustration.${new Date().getTime()}.${illustration.subtype}`;
          await illustration.move(Helpers.publicPath('/uploads/portfolio'), {name: data.illustration})

          if(!illustration.moved()){
            session.flash({error: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }
        if(logo.size != 0){
          data.logo = `${data.name}.logo.${new Date().getTime()}.${logo.subtype}`;
          await logo.move(Helpers.publicPath('/uploads/portfolio'), {name: data.logo})

          if(!logo.moved()){
            session.flash({error: 'Impossible d\'importer l\'image'})
            return response.redirect('back')
          }
        }else if(portfolioDetails.logo === null){
          data.illustration = '000-default-logo.png';
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
