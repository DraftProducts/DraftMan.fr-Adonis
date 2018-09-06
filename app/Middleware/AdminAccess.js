'use strict'

class AdminAccess {
  async handle ({ auth, response }, next) {
    /**
     * Verify if we are a admin
     */
    try {
      const user = auth.user;
      if(user.role < 1000){
        return response.redirect('back')
      }
    } catch (e) {}

    await next()
  }
}
module.exports = AdminAccess
