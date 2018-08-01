'use strict'

const paypal = require('paypal-rest-sdk');
const config = require('../../../config.json');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': config.PAYPAL_ID,
  'client_secret': config.PAYPAL_SECRET
});

class ClientController {

  async client({view,auth}) {
    const profil = auth.user.toJSON();
    return view.render('dashboard.client',{user: profil})
  }
  async dashboard({view,auth}) {
    const profil = auth.user.toJSON();
    const project = auth.user.toJSON();
    return view.render('dashboard.client_dashboard',{user: profil,project})
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
    
    paypal.payment.create(create_payment_json, function (error, payment) {
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
