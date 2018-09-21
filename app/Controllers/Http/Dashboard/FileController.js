'use strict'

const Helpers = use('Helpers')

class FileController {
  async uploadImage ({ request, auth, response, session}) {
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

  create({view}) { return view.render('dashboard.upload')}

  async store({response, request, session}) {
    const file = request.file('file', {
      size: '10mb',
      allowedExtentions: ['png','jpg','ai','jpeg','gif','svg','psd','txt']
    })
    const img = `${new Date().getTime()}.${file.subtype}`;
    await file.move(Helpers.publicPath('/uploads/files'), {name: img})
    if(!file.moved()){
      session.flash({error: 'Impossible d\'importer l\'image de profil'})
      return response.redirect('back')
    }

    response.ok({message: 'Le fichier a bien été upload'})
  }

  async uploadProjectImage ({ request, response,params, session }) {
    const file = request.file('file', {
      types: ['image'],
      size: '10mb'
    });
    await file.move(Helpers.publicPath(`/uploads/projects/${params.project}/images`), {name: `${new Date().getTime()}.${file.subtype}`})
    if(!file.moved()){
      session.flash({error: 'Impossible d\'importer l\'image'})
      return response.redirect('back')
    }
    session.flash({notif: 'Votre image à bien été ajouté !'});
    return response.redirect('back')
  }
}

module.exports = FileController
