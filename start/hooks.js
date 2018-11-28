const { hooks } = require('@adonisjs/ignitor')
const Remarkable = require('remarkable');
const gravatar = require('gravatar');
const moment = require('moment');
moment.locale('fr');
markdown = new Remarkable();

hooks.after.providersRegistered(() => {
  const View = use('View')

  View.global('trim', (text, value = 800) => {
    return text.substring(0, value).replace(/[*_~^${}()|[\]\\]/g,'')
  })

  View.global('markdown', (text) => {
    return markdown.render(text)
  })

  View.global('dateF', (date) => {
    return moment(date).format('dddd DD MMMM').replace(/(^.|[ ]+.)/g, c => c.toUpperCase());
  })

  View.global('date', (date) => {
    const newDate = new Date(date)
    return `${('0' + newDate.getDate()).slice(-2)}/${("0"+(newDate.getMonth()+1)).slice(-2)}/${newDate.getFullYear()}`
  })

  View.global('getProfilImage', (user) => {
    if(user.profil === '' || user.profil === null){
      return gravatar.url(user.email, {protocol: 'https', s: 170});
    }
    return user.profil;
  })
  View.global('getDiscordImage', (user) => {
    if(user.discord_image === '' || user.discord_image === null){
      return gravatar.url(user.email, {protocol: 'https', s: 170});
    }
    return user.discord_image;
  })

  View.global('getImageUser', (email,image) => {
    if(image === '' || image === null){
      return gravatar.url(email, {protocol: 'https', s: 170});
    }
    return image;
  })

  View.global('getNameByFile', (file) => {
    return file.match(/(.*)*\..*/);
  })

  View.global('separate', (string) => {
    if(string === null) return ''
    console.log(Array.from(string))
    return string.join(', ')
  })

  View.global('price', (price, times) => {
    return (price/times).toFixed(2)
  })

  View.global('isProject', (link) => {
    return link.startWith('/') || link.startWith('http')
  })

  View.global('parse', JSON.parse)
})
