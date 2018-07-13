'use strict'

const Schema = use('Schema')

class PostsSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('title')
      table.string('url')
      table.text('description')
      table.string('tags')
      table.text('content')
      table.sring('image')
      table.date('published_at') // -> Si rempli = publié et ta la date en plus
      table.timestamps() // created_at - updated_at
      table.integer('author_id').notNullable() // -> ID de l'auteur
      table.integer('posted')
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostsSchema
