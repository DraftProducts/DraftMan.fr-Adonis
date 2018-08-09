'use strict'

const Portfolio = use('App/Models/Portfolio')
const PortfolioDetails = use('App/Models/PortfolioDetails')
const { validate } = use('Validator')
const Helpers = use('Helpers')

class PortfolioController {
    // index = Liste tes posts
    // create = Afficher le formulaire de création
    // store = Stocker ton post
    // show = Afficher un post
    // edit = Afficher le formulaire de modificaton
    // update = Met à jour ton post
    // destroy = Détruire ton post
    async index({ view }){

        const portfolio = (await Portfolio.all()).toJSON();

        return view.render('portfolio.index', {portfolio: portfolio})
    }

    async show({params, view}){

        const project = (await Portfolio.find(params.id)).toJSON();

        return view.render('portfolio.details', {project})
    }

    async create({view}){
        const portfolio = (await Portfolio.all()).toJSON();
        const details = new PortfolioDetails()
        const res = await details.save()
        console.log(res)
        return view.render('dashboard.portfolio', {portfolio})
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
            .flashExcept()
    
          return response.redirect('back')
        }

        if(!data.published_at) data.published_at === new Date()

        data.illustration = `${data.name}.${new Date().getTime()}.${illustration.subtype}`;
        await illustration.move(Helpers.publicPath('/uploads/portfolio'), {name: data.illustration})

        await Portfolio.create(data)
        
        session.flash({
          article_posted: 'Création sauvegardé'
        })

        if(data.published_at){
            return response.redirect('/portfolio')
        }else{
            return response.redirect('/admin/portfolio')
        }
    }

    async edit({view,params}){
        const creation = (await Portfolio.find(params.id)).toJSON();
        const portfolio = (await Portfolio.all()).toJSON();
        // if(creation.portfolio_details_id != null){
        //     creation = (await Portfolio.query().with('details').where('id', params.id).fetch()).toJSON();
        //     return view.render('dashboard.portfolio-edit-details', {portfolio,creation})
        // }
        return view.render('dashboard.portfolio-edit', {portfolio,creation})
    }
    async update({request, session, response}){
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
            .flashExcept()
    
          return response.redirect('back')
        }

        if(!data.published_at) data.published_at === new Date()

        data.illustration = `${data.name}.${new Date().getTime()}.${illustration.subtype}`;
        await illustration.move(Helpers.publicPath('/uploads/portfolio'), {name: data.illustration})

        await Portfolio.create(data)
        
        session.flash({
          article_posted: 'Création sauvegardé'
        })

        if(data.published_at){
            return response.redirect('/portfolio')
        }else{
            return response.redirect('/admin/portfolio')
        }
    }
    async upgrade({params, response}){
        const details = new PortfolioDetails()
        details.portfolio_id = params.id
        await details.save()
        const res = await (PortfolioDetails.query().where('portfolio_id',params.id).first()).toJSON()
        await (Portfolio.find(params.id).update('portfolio_details_id',res.id)).toJSON()
        return response.redirect('back')
    }
}

module.exports = PortfolioController
