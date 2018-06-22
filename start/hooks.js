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
    return `${date.getDate()}/${date.getMonth()}/${date.getYear()}`
  })
})