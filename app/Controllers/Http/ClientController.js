'use strict'

const { validate } = use('Validator')
const Mail = use('Mail')

const Project = use('App/Models/Project');
const Client = use('App/Models/Client');
const User = use('App/Models/User');
const Env = use('Env');

const paypal = require('paypal-rest-sdk')
const moment = require('moment')
moment.locale('fr');
const { get, post } = require('snekfetch');
const { promisify } = require('util')
const fs = require('fs');

const readdir = promisify(fs.readdir)

const githubToken = Env.get('GITHUB_API_TOKEN')

class ClientController {
  constructor () {
    paypal.configure({
      mode: 'sandbox',
      client_id: Env.get('PAYPAL_ID'),
      client_secret: Env.get('PAYPAL_SECRET')
    })
  }

  async create ({view,auth}) {
    const notif = await Client.query().where('user_id', auth.user.id).where('status',0).first()
    if(notif) {
      return view.render('clients.client_request',{notif: notif.toJSON()})
    }
    return view.render('clients.client_request')
  }

  async show ({session, view,auth,response}) {
    const project = (await Project.query().with('payments').where('id', auth.user.project_id).first()).toJSON()
    const images = await readdir(`public/uploads/projects/${project.folder}/images`)
    const fichiers = await readdir(`public/uploads/projects/${project.folder}/fichiers`)
    const repo = 'DraftMan.fr'
    const owner = 'DraftProducts'
    const res = await get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`).set("Authorization", `token ${githubToken}`)
    const commitsList = new Map();
    const brut = res.body;
    brut.forEach(element => {
      const date = moment(element.commit.committer.date).format('dddd DD MMMM').replace(/(^.|[ ]+.)/g, c => c.toUpperCase());;
      commitsList.set(date, element.commit.message)
    });
    try {
      const paypalResponse = await this.createPayment(project)
      session.put('paymentId', paypalResponse.paymentId)
      return view.render('clients.client_dashboard',{project,images,fichiers,link:paypalResponse.approvalUrl,commitsList: commitsList.toJSON()})
    } catch (e) {
      console.log(e)
      return view.render('clients.client_dashboard',{project,images,fichiers,commitsList})
    }
  }

  async getProjetCommits({auth,response}){
    const project = (await Project.query().where('id', auth.user.project_id).first()).toJSON();
    const repo = 'Bio2Game.com'
    const owner = 'DraftProducts'
    let res,page = 1;
    const list = new Map()
    do {
        res = await get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`).set("Authorization", `token ${githubToken}`)
        res.body.forEach(element => {
            const date = moment(element.commit.committer.date).format('dddd DD MMMM').replace(/(^.|[ ]+.)/g, c => c.toUpperCase());;
            if(list.has(date)){
                list.set(date, list.get(date)+1)
            }else{
                list.set(date, 1)
            }
        });
        page++
    } while (res.headers.link.includes('rel="last"'));

    const commitsSize = [...list].reduce((acc, commit) => {
        return Object.assign(acc, { [commit[0]]: commit[1] })
    }, {})
    response.status(200).json({ commitsSize})
  }

  async store({request, session, response,auth}) {
    const data = request.only(['discord','name', 'type', 'description','validation'])
    const messages = {
        'name.required': 'Veuillez indiquer le nom du projet.',
        'name.unique': 'Ce nom de projet est déjà utilisé.',
        'type.required': 'Veuillez indiquer le type de projet.',
        'description.required': 'Veuillez entrer une courte description du projet et/ou le travail à faire',
        'validation.required': 'Pour devenir client vous devez accepter de renoncer à exercer votre droit de rétractation',
        'discord.required': 'Pour devenir client vous devez connecter votre compte discord'
    }
    const rules = {
      discord: 'required',
      name: 'required|unique:clients',
      type: 'required',
      description: 'required',
      validation: 'required'
    }

    const validation = await validate(data, rules, messages)

    if (validation.fails()) {
        session
        .withErrors(validation.messages())
        .flashAll()
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
    data.date = moment().format('LLLL')

    const email_to = 'nicovanaarsen@gmail.com';

    try {
        await Mail.send('mails.request', data, (message) => {
            message
            .to(email_to)
            .from('no-reply@draftman.fr', 'draftman.fr')
            .subject('Un projet vous est proposé sur DraftMan.fr')
            .replyTo(data.email, data.username)
        })
        session.flash({sent: 'Votre demande à été envoyé avec succès !'})
        return response.redirect('back')
    } catch (error) {
        console.log('request mail: '+error.errors)
        session.flash({error: 'Une erreur s\'est produite votre demande n\'à pas été effectué, veuillez nous excusez !'})
        return response.redirect('back')
    }
  }

  async success ({request, session}) {
    const paymentId = session.get('paymentId')
    const paymentDetails = { payer_id: request.input('PayerID') }
    try {
      await this.successDetails(paymentId, paymentDetails)
      const project = await Project.find(auth.user.project_id)
      project.completed_payments = completed_payments + 1
      await project.save()
      session.flash({success: 'Votre paiement a bien été effectué'})
      return response.redirect('/me/client/dashboard')
    } catch (e) {
      console.log('error', e.message)
      session.flash({error: 'Une erreur est survenue veuillez nous excusez'})
    }
  }

  async cancel ({session, response}) {
    session.forget('paymentId')
    session.flash({success: 'Vous avez bien annulé le paiement'})
    return response.redirect('/me/client/dashboard')
  }

  createPayment (project) {
    return new Promise((resolve, reject) => {
      paypal.payment.create(this.details(project), (err, payment) => {
        if (err) return reject(err)
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

  successDetails(paymentId, paymentDetails){
    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, paymentDetails, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve({success: true})
      })
    })
  }

  details(project) {
    return {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'https://www.draftman.fr/success',
        cancel_url: 'https://www.draftman.fr/cancel'
      },
      transactions: [{
        description: `Paiement n°${(project.payments != undefined ? project.payments.length  + 1 : 0 + 1)} du projet ${project.name}`,
        amount: {
          currency: 'EUR',
          total: (project.price/project.total_payments).toFixed(2)
        }
      }]
    }
  }
}

module.exports = ClientController
