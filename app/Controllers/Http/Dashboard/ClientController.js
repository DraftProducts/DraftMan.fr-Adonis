'use strict'

const Project = use('App/Models/Project');
const Client = use('App/Models/Client');
const User = use('App/Models/User');
const { validate } = use('Validator')
const Env = use('Env');

const { get, post } = require('snekfetch');
const moment = require('moment')
moment.locale('fr');

const githubToken = Env.get('GITHUB_API_TOKEN')

const { promisify } = require('util')
const fs = require('fs');

const readdir = promisify(fs.readdir)

class ClientController {

  async index({view}) {
    const wclients = (await Client.query().with('author').where('status','=', 0).fetch()).toJSON()
    const clients = (await Client.query().with('author').where('status','=', 1).fetch()).toJSON()
    return view.render('clients.admin.clients',{clients,wclients})
  }

  async create({view,params}) {
    const user = (await User.findOrFail(params.id)).toJSON()
    return view.render('clients.admin.client_request',{user})
  }

  async store({ request, session, response, params }){
    const data = request.only(['name','type','git_author', 'git_repository', 'price', 'total_payments']);

    const messages = {
      'name.required': 'Veuillez indiquer le nom du projet.',
      'name.unique': 'Ce nom de projet est déjà utilisé.',
      'type.required': 'Veuillez indiquer le type de projet.',
      'price.number': 'Le prix doit être un nombre !',
      'total_payments.number': 'Le nombre de paiements doit être un nombre !',
      'total_payments.min': 'Le nombre de paiements doit être au moins égale à un !',
    }

    const rules = {
      name: 'required|unique:clients',
      type: 'required',
      price: 'required|number',
      total_payments: 'required|number|min:1'
    }

    const validation = await validate(data, rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll()

      return response.redirect('back')
    }
    data.user_id = params.id

    await Client.create({
      'name': data.name,
      'type': data.type,
      'status': 1,
      'user_id': params.id
    })

    delete data.type
    data.folder = data.name

    const project = await Project.create(data)

    const user = await User.find(params.id)
    user.client = 1;
    user.project_id = project.id;
    await user.save()

    fs.mkdirSync(`public/uploads/projects/${data.name}`);
    fs.mkdirSync(`public/uploads/projects/${data.name}/images`);
    fs.mkdirSync(`public/uploads/projects/${data.name}/fichiers`);

    session.flash({
      notif: 'Client créé avec succès'
    })
    return response.redirect(`/admin/clients/${project.id}`)
  }

  async update({ request, session, response,params }){
    const data = request.only(['git_author', 'git_repository', 'price', 'total_payments']);

    const messages = {
      'price.number': 'Le prix doit être un nombre !',
      'total_payments.number': 'Le nombre de paiements doit être un nombre !',
      'total_payments.min': 'Le nombre de paiements doit être au moins égale à un !',
    }

    const rules = {
      price: 'required|number',
      total_payments: 'required|number|min:1'
    }

    const validation = await validate(data, rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll()

      return response.redirect('back')
    }

    const client = await Project.find(params.project)
    client.merge(data)
    await client.save()

    session.flash({
      client_saved: 'Configuration sauvegardé'
    })
    return response.redirect('back')
}

  async show({view,params,response}) {
    const client = (await Client.query().with('author').where('id',params.id).first()).toJSON()
    if(client.status === 0){
      return view.render('clients.client_request_details',{client})
    }else if(client.status === 1){
      const project = (await Project.query().where('id', client.author.project_id).first()).toJSON()
      const images = await readdir(`public/uploads/projects/${project.folder}/images`)
      const fichiers = await readdir(`public/uploads/projects/${project.folder}/fichiers`)
      const res = await get(`https://api.github.com/repos/${project.git_author}/${project.git_repository}/commits?per_page=100`).set("Authorization", `token ${githubToken}`)
      const commits = res.body;
      return view.render('clients.admin.client_dashboard',{client,images,fichiers,project,commits})
    }
    return response.redirect('back')
  }

  async accept({params,response}) {
    const client = (await Client.query().with('author').where('id',params.id).first()).toJSON()
    await this.changeStatment(params.id,1)
    const project = await this.createProject(client)
    const user = await User.find(client.author.id)
    user.client = 1;
    user.project_id = project.id;
    await user.save()
    return response.redirect(`/admin/clients/${client.id}`)
  }

  async refuse({params}) {
    await this.changeStatment(params.id,2)
    return response.redirect('/admin/clients')
  }

  async createProject (client) {
    const project = await new Project()
    project.name = client.name,
    project.total_payments = 2,
    project.folder = client.name,
    project.user_id = client.author.id
    await project.save()
    fs.mkdirSync(`public/uploads/projects/${client.name}`);
    fs.mkdirSync(`public/uploads/projects/${client.name}/images`);
    fs.mkdirSync(`public/uploads/projects/${client.name}/fichiers`);
    return project
  }

  async changeStatment (id,state){
    const status = await Client.find(id)
    status.merge({'status': state})
    await status.save()
  }
}

module.exports = ClientController
