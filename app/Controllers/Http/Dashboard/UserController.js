
'use strict'

const User = use('App/Models/User')

class UserController {

  async create ({view,auth}){
    const users = (await User.query().whereNot({username: auth.user.username}).fetch()).toJSON()
    return view.render('dashboard.users',{users})
  }
}

module.exports = UserController
