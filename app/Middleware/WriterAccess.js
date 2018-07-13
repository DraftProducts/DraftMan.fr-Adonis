'use strict'

class WriterAccess {
  async handle ({ auth, response }, next) {
    /**
     * Verify if we are a moderator
     */
    try {
      const user = auth.user.toJSON()
      if(user.role < 2){
        return response.redirect('back')
      }
    } catch (e) {}
    
    await next()
  }
}
module.exports = WriterAccess
