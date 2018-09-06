'use strict'

class FileController {
  async uploadImage ({ request, auth, response }) {
    const user = auth.user;
    const image = request.file('image', {
      types: ['image'],
      size: '10mb'
    })
    if(image.size != 0){
      const img = `${user.id}.${new Date().getTime()}.${image.subtype}`;
      await image.move(Helpers.publicPath('/uploads/users'), {name: img})
      if(!image.moved()){
        session.flash({error: 'Impossible d\'importer l\'image de profil'})
        return response.redirect('back')
      }
      user.profil = `/uploads/users/${img}`
      await user.save()
    }
    session.flash({notif: 'Votre image de profil à bien été sauvegardé !'});
    response.redirect('back')
  }

  create({view}) {
    view.render('dashboard.upload')
  }

  async store({response, request}) {
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

module.exports = FileController
