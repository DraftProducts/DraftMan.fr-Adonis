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
      table.json('colors')
      table.string('typographie1').defaultTo('')
      table.string('typographie2').defaultTo('')
      table.text('presentation').defaultTo('')
      table.text('problematique').defaultTo('')
      table.text('technique').defaultTo('')
      table.string('logo')
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