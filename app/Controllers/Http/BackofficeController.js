'use strict'

class SessionController {
  index({view}) {
    return view.render('admin.dashboard')
  }
}

module.exports = SessionController
