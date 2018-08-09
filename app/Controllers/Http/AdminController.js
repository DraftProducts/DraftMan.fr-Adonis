'use strict'

class AdminController {
  async clients({view}) {
    return view.render('dashboard.clients')
  }
}

module.exports = AdminController