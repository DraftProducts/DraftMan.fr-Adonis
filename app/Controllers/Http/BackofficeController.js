'use strict'

const Comment = use('App/Models/Comment')
const Helpers = use('Helpers')
const Post = use('App/Models/Post')

class BackofficeController {
  async comments({view}) {
    const comments = (await Comment.query().with('post').where('seen',0).fetch()).toJSON()
    return view.render('blog.admin.comments',{comments})
  }

  async valide_comment({params,response}) {
    const comment = await Comment.find(params.id)
    comment.seen = 1
    await comment.save()
    response.redirect('back')
  }
  
  async destroy_comment({params,response}) {
    const comment = await Comment.find(params.id)
    await comment.delete()
    response.redirect('back')
  }

  async uploadFile({response, request}) {
    const file = request.file('file', {
      size: '10mb',
      allowedExtentions: ['png','jpg','ai','jpeg','gif','svg','psd','txt']
    })
    await file.move(Helpers.publicPath('/uploads/files'))
    if(!file.moved()){
      response.badRequest({error: file.errors()})
      return
    }

    response.ok({message: 'Le fichier a bien été upload'})
  }
}

module.exports = BackofficeController
