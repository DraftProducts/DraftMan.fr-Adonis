'use strict'

const Schema = use('Schema')

class ClientProjectsSchema extends Schema {
  up () {
    this.create('client_projects', (table) => {
      table.increments()
      table.string('name')
      table.integer('total_payments')
      table.integer('completed_payments')
      table.integer('progress')
      table.string('folder')
      table.integer('price')
      table.integer('devblog_id')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('client_projects')
  }
}

module.exports = ClientProjectsSchema
