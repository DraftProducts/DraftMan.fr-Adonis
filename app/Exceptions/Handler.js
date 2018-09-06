'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {

  async handle (error, { request, response, session, view }) {
    if (error.code === 'E_INVALID_SESSION') {
      session.flash({ error: 'Veuillez vous reconnecter !' })

      return response.redirect('/login')
    }

    return super.handle(...arguments)
  }

  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
