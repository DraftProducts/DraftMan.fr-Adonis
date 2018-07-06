'use strict'

class ModoAccess {
  handle ({ auth, response }, next) {
    /**
     * Verify if we are a moderator
     */
    if(auth.user.toJSON().role < 1){
      return response.redirect('back')
    }
    next()
  }
}
module.exports = ModoAccess
