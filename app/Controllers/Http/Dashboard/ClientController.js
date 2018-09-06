'use strict'

const Project = use('App/Models/Project');
const Client = use('App/Models/Client');
const User = use('App/Models/User');
const Env = use('Env');

const moment = require('moment')
moment.locale('fr');

const { promisify } = require('util')
const fs = require('fs');

const readdir = promisify(fs.readdir)

class ClientController {

  async index({view}) {
    const wclients = (await Client.query().with('author').where('status','=', 0).fetch()).toJSON()
    const clients = (await Client.query().with('author').where('status','=', 1).fetch()).toJSON()
    return view.render('clients.admin.clients',{clients,wclients})
  }

  async show({view,params,response}) {
    const client = (await Client.query().with('author').where('id',params.id).first()).toJSON()
    if(client.status === 0){
      return view.render('clients.client_request_details',{client})
    }else if(client.status === 1){
      const project = (await Project.query().where('id', params.id).first()).toJSON()
      const images = await readdir(`public/uploads/projects/${project.folder}/images`)
      const fichiers = await readdir(`public/uploads/projects/${project.folder}/fichiers`)
      return view.render('clients.admin.client_dashboard',{client,images,fichiers,project})
    }
    return response.redirect('back')
  }

  async accept({view,params,response}) {
    const client = (await Client.query().with('author').where('id',params.id).first()).toJSON()
    await this.changeStatment(params.id,1)
    const project = await this.createProject(client)
    const user = await User.find(client.author.id)
    user.client = 1;
    user.project_id = project.id;
    await user.save()
    return response.redirect(`/admin/clients/${client.id}`)
  }

  async refuse({view,params}) {
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
