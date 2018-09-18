'use strict'

const Comment = use('App/Models/Comment')
const { validate } = use('Validator')

class CommentController {
  async store ({ request,session, params,response, auth}){
    const data = request.only(['name', 'email', 'website','twitter','github','linkedin','content','parent_id'])
    data.post_id = params.id
    data.seen = 0

    if(!data.parent_id) data.parent_id = 0

    if(auth.user){
        data.name = auth.user.username
        data.email = auth.user.email
        data.website = auth.user.website
        data.twitter = auth.user.twitter
        data.github = auth.user.github
        data.linkedin = auth.user.linkedin
    }

    const messages = {
        'name.required': 'Veuillez indiquer votre pseudo.',
        'email.required.email': 'Veuillez entrer une adresse email valide.',
        'content.required': 'Veuillez entrer votre message.'
    }

    const rules = {
      name: 'required',
      email: 'required|email',
      content: 'required'
    }

    const validation = await validate(data, rules, messages)

    if (validation.fails()) {
        session
        .withErrors(validation.messages())
        .flashAll()

        return response.redirect('back')
    }

    await Comment.create(data)

    return response.redirect('back')
  }
}

module.exports = CommentController
