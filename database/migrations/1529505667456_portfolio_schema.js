'use strict'

const Schema = use('Schema')

class PortfolioSchema extends Schema {
  up () {
    this.create('portfolio', (table) => {
      table.increments()
      table.string('name')
      table.string('url').defaultTo('')
      table.string('description').defaultTo('')
      table.string('type').defaultTo('')
      table.string('illustration')
      table.integer('portfolio_details_id')
      table.date('published_at')
      table.timestamps()
    })
    this.create('portfolio_details', (table) => {
      table.increments()
      table.text('presentation').notNullable().defaultTo('')
      table.text('problematique').notNullable().defaultTo('')
      table.text('technique').notNullable().defaultTo('')
      table.string('logo')
      table.string('graph')
      table.string('folder')
      table.integer('portfolio_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('portfolio')
    this.drop('portfolio_details')
  }
}

module.exports = PortfolioSchema
