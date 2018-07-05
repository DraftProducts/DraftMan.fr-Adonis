const { hooks } = require('@adonisjs/ignitor')
const Remarkable = require('remarkable');
markdown = new Remarkable();

hooks.after.providersRegistered(() => {
  const View = use('View')

  View.global('trim', (text, value = 800) => {
    return text.substring(0, value)
  })

  View.global('markdown', (text) => {
    return markdown.render(text)
  })

  View.global('date', (date) => {
    const newDate = new Date(date)
    return `${('0' + newDate.getDate()).slice(-2)}/${("0"+(newDate.getMonth()+1)).slice(-2)}/${newDate.getFullYear()}`
  })
})