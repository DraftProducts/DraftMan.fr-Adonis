'use strict'

const Schema = use('Schema')

class ClientProjectsDevblogSchema extends Schema {
  up () {
    this.create('client_projects_devblog', (table) => {
      table.increments()
      table.integer('client_project_id')
      table.string('title')
      table.string('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('client_projects_devblog')
  }
}

module.exports = ClientProjectsDevblogSchema
