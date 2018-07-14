'use strict'

class ClientAccess {
  async handle ({ auth, response }, next) {
    /**
     * Verify if we are a moderator
     */
    try {
      const user = auth.user.toJSON()
      if(user.client === 1){
        return response.redirect('/me/client/dashboard')
      } 
    } catch (e) {}
    
    await next()
  }
}
module.exports = ClientAccess
