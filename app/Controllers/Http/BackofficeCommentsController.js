'use strict'

class BackofficeCommentsController {
  async index({view,auth}) {
    const user = auth.user.toJSON();
    return view.render('dashboard.comments',{user})
  }
}

module.exports = BackofficeCommentsController
