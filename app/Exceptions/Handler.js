'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {

  async handle (error, { request,response, session,view }) {
    if (error.code === 'E_INVALID_SESSION') {
      session.flash({ error: 'Veuillez vous reconnecter !' })

      return response.redirect('/login')
    }
    if (error.code === 'E_MISSING_DATABASE_ROW') {
      return response.send(view.render('errors.404'))
    }
    if (error.name === 'HttpException'){
      return response.status(error.status).send(view.render(`errors.${error.status}`))
    }

    return super.handle(...arguments)
  }

  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
