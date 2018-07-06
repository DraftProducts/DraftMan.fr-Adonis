'use strict'

class ModoAccess {
  handle ({ auth, response }, next) {
    /**
     * Verify if we are a moderator
     */
    
    try {
      const user = auth.user.toJSON()
      if(user.role < 1){
        return response.redirect('back')
      }
    } catch (e) {}
    
    next()
  }
}
module.exports = ModoAccess
