'use strict'

const Schema = use('Schema')

class BlogSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('title')
      table.string('url')
      table.text('description')
      table.string('tags')
      table.text('content')
      table.string('writer')
      table.string('posted')
      table.date('date')
      table.date('last_update')
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = BlogSchema
