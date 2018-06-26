'use strict'

class SessionController {
  index({view}) {
    return view.render('admin.dashboad')
  }
}

module.exports = SessionController
