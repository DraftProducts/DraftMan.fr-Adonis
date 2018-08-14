'use strict'
const Env = use('Env')
const Mail = use('Mail')
const paypal = require('paypal-rest-sdk')
const { promisify } = require('util')
const fs = require('fs');
const readdir = promisify(fs.readdir)
const Project = use('App/Models/Project');
const Client = use('App/Models/Client');
const { validate } = use('Validator')
const config = require('../../../config.json');

class ClientController {
  constructor () {
    paypal.configure({
      mode: 'sandbox',
      client_id: config.PAYPAL_ID,
      client_secret: config.PAYPAL_SECRET
    })
  }

  async client_request ({view,auth,session}) {
    let request = await Client.findBy('user_id', auth.user.id)
    if(request) {
      return view.render('clients.client_request',{request: request.toJSON()})
    }else{
      return view.render('clients.client_request')
    }
  }
  
  async dashboard ({session, view,auth}) {
    try {
      const project = (await Project.query().with('devblog').where('id', auth.user.project_id).first()).toJSON()
      const images = await readdir(`public/uploads/projects/${project.folder}/images`)
      const fichiers = await readdir(`public/uploads/projects/${project.folder}/fichiers`)
      const paypalResponse = await this.createPayment(project)
      session.put('paymentId', paypalResponse.paymentId)
      return view.render('dashboard.client_dashboard',{project,images,fichiers,link:paypalResponse.approvalUrl})
    } catch (e) {
      console.log(e)
    }
  }

  async request({request, session, response,auth}) {
    const data = request.only(['name', 'type', 'description','validation','discord'])
    const messages = {
        'name.required': 'Veuillez indiquer le nom du projet.',
        'type.required': 'Veuillez indiquer le type de projet.',
        'description.required': 'Veuillez entrer une courte description du projet et/ou le travail à faire',
        'validation.required': 'Pour devenir client vous devez accepter cette condition.',
        'discord.required': 'Pour devenir client vous devez accepter cette condition.'
    }
    const rules = {
      name: 'required',
      type: 'required',
      description: 'required',
      validation: 'required',
      discord: 'required',
    }
    
    const validation = await validate(data, rules, messages)

    if (validation.fails()) {
        session
        .withErrors(validation.messages())
        return response.redirect('back')
    }

    await Client.create({
      name: data.name,
      type: data.type,
      description: data.description,
      status: 0,
      user_id: auth.user.id
    })

    data.username = auth.user.username
    data.email = auth.user.email
    data.discord = `${auth.user.discord_username}#${auth.user.discord_discriminator}`

    const email_to = 'contact@draftman.fr';

    await Mail.send('mails/request', data, (message) => {
      message
        .to(email_to)
        .from('<email>', '<author>')
        .subject('<objet>')
        .replyTo('<email>', '<author>')
    })
  }

  async paypalSuccess ({request, session, view}) {
    const paymentId = session.get('paymentId')
    const paymentDetails = { payer_id: request.input('PayerID') }
    try {
      await this.paypalSuccessDetails(paymentId, paymentDetails)
      const project = await Project.find(auth.user.project_id)
      project.completed_payments = completed_payments + 1
      await project.save()
      return view.render('success')
    } catch (e) {
      console.log('error', e.message)
      session.flash({error: 'Une erreur est survenue veuillez nous excusez'})
    }
  }

  async paypalCancel ({session, response}) {
    session.forget('paymentId')
    session.flash({success: 'Vous avez bien annulé le paiement'})
    return response.redirect('/me/client/dashboard')
  }

  paypalSuccessDetails(paymentId, paymentDetails){
    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, paymentDetails, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve({success: true})
      })
    })
  }

  paypalDetails(project) {
    return {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'http://127.0.0.1:3333/success',
        cancel_url: 'http://127.0.0.1:3333/cancel'
      },
      transactions: [{
        description: `Paiement n°${project.payments.count()+1} du projet ${project.name}`,
        amount: {
          currency: 'EUR',
          total: (project.price/project.total_payments).toFixed(2)
        }
      }]
    }
  }

  createPayment (project) {
    return new Promise((resolve, reject) => {
      paypal.payment.create(this.paypalDetails(project), (err, payment) => {
        if (err) {
          return reject(err)
        }
        const links = payment.links
        for (let i = 0; i < links.length; i++) {
          if (links[i].rel === 'approval_url') {
            return resolve({
              approvalUrl: links[i].href,
              paymentId: payment.id
            })
          }
        }
      })
    })
  }

  async clients({view}) {
    const clients = (await Client.query().with('author').where('status', 0).fetch()).toJSON()
    return view.render('clients.admin.clients',{clients})
  }
  async show({view,params}) {
    const client = (await Client.find(params.id)).toJSON()
    return view.render('clients.admin.client',{client})
  }
}

module.exports = ClientController
