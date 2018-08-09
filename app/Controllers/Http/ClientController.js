'use strict'

const paypal = require('paypal-rest-sdk');
const { promisify } = require('util')
const fs = require('fs');
const readdir = promisify(fs.readdir)

const config = require('../../../config.json');
const Project = use('App/Models/Project');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': config.PAYPAL_ID,
  'client_secret': config.PAYPAL_SECRET
});

class ClientController {

  async client({view}) {
    return view.render('dashboard.client')
  }

  async dashboard({view,auth}) {
    const proj = (await Project.query().with('devblog').where('id', auth.user.project_id).first()).toJSON()
    const images = await readdir(`public/uploads/projects/${proj.folder}/images`)
    const fichiers = await readdir(`public/uploads/projects/${proj.folder}/fichiers`)
    return view.render('dashboard.client_dashboard',{project: proj,images,fichiers})
  }

  async pay({response}) {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://127.0.0.1:3333/me/client/pay/success",
          "cancel_url": "http://127.0.0.1:3333/me/client/pay/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "EUR",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "EUR",
              "total": "25.00"
          },
          "description": "Hat for the best team ever"
      }]
    };
    
    await paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            console.log(`${payment.links[i].href}`);
            return response.redirect(`${payment.links[i].href}`);
          }
        }
      }
    });
  }

  async paySuccess({view,auth,response}) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "EUR",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        return response.send('Success');
      }
    })
  }
}

module.exports = ClientController
