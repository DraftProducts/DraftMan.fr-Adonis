'use strict'

const Schema = use('Schema')

class EmailsSchema extends Schema {
  up () {
    this.create('emails', (table) => {
      table.increments()
      table.string('email')
      table.timestamps()
    })
  }

  down () {
    this.drop('emails')
  }
}

module.exports = EmailsSchema
