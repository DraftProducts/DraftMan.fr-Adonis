const Event = use('Event')
const Mail = use('Mail')
const Encryption = use('Encryption')

Event.on('user::created', async ({user}) => {
  try {
    const { token } = await user.tokens().where('user_id', user.id).first()
    const base = use('Encryption').base64Encode(token)
    await Mail.send('mails.inscription', { token: base }, (message) => {

      message
        .to(user.email)
        .from('no-reply@draftman.fr', 'draftman.fr')
        .subject('Inscription sur DraftMan.fr')
        .replyTo('contact@draftman.fr', 'DraftMan')
    })
  } catch (error) {
    console.log('inscription mail: ' + error)
  }
})

Event.on('email::changed', async ({user}) => {
  try {
    const { token } = await user.tokens().where('user_id', user.id).first()
    const base = use('Encryption').base64Encode(token)

    await Mail.send('mails.change-email', { token: base }, (message) => {

      message
        .to(user.email)
        .from('no-reply@draftman.fr', 'draftman.fr')
        .subject('Changement d\'adresse email sur DraftMan.fr')
        .replyTo('contact@draftman.fr', 'DraftMan')
    })
  } catch (error) {
    console.log('email changed mail: ' + error)
  }
})

Event.on('forgot::password', async ({user,token}) => {
  try {
    const base = use('Encryption').base64Encode(token)

    await Mail.send('mails.forget-password', { token: base }, (message) => {

      message
        .to(user.email)
        .from('no-reply@draftman.fr', 'draftman.fr')
        .subject('Changement de mot de passe sur DraftMan.fr')
        .replyTo('contact@draftman.fr', 'DraftMan')
    })
  } catch (error) {
    console.log('password changed mail: ' + error)
  }
})


