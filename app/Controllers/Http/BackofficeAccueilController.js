'use strict'

class BackofficeAccueilController {
  index({view}) {
    return view.render('dashboard.accueil')
  }
}

module.exports = BackofficeAccueilController
