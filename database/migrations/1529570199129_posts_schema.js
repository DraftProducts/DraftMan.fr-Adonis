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
      table.string('image')
      table.date('published_at') // -> Si rempli = publié et ta la date en plus
      table.integer('author_id').notNullable() // -> ID de l'auteur
      table.integer('deleted').defaultTo(0) // -> Supprimé
      table.timestamps() // created_at - updated_at
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostsSchema
