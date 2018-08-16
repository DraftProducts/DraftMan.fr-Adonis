'use strict'

const Schema = use('Schema')

class ClientsSchema extends Schema {
  up () {
    this.create('client_projects', (table) => {
      table.increments()
      table.string('name')
      table.integer('total_payments')
      table.integer('progress')
      table.string('folder')
      table.integer('price')
      table.integer('user_id')
      table.timestamps()
    })
    this.create('client_projects_devblog', (table) => {
      table.increments()
      table.integer('client_project_id')
      table.string('title')
      table.string('description')
      table.timestamps()
    })
    this.create('client_projects_payments', (table) => {
      table.increments()
      table.integer('client_project_id')
      table.string('name')
      table.string('price')
      table.timestamps()
    })
    this.create('clients', (table) => {
      table.increments()
      table.string('name')
      table.string('type')
      table.text('description')
      table.integer('status') // 0 = null | 1 = accept | 2 = refused
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('client_projects')
    this.drop('client_projects_devblog')
    this.drop('client_projects_payments')
    this.drop('clients')
  }
}

module.exports = ClientsSchema
