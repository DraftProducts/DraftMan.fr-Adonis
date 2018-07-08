'use strict'

class ModoAccess {
  async handle ({ auth, response }, next) {
    /**
     * Verify if we are a moderator
     */
    
    try {
      const user = auth.user.toJSON()
      if(user.role < 1){
        return response.redirect('back')
      }
    } catch (e) {
      console.log(e)
    }
    
    await next()
  }
}
module.exports = ModoAccess
