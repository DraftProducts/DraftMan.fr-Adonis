'use strict'

const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.string('name')
      table.string('email')
      table.string('website')
      table.string('twitter')
      table.string('github')
      table.string('linkedin')
      table.text('content')
      table.integer('post_id')
      table.integer('seen')
      table.integer('parent_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentsSchema
