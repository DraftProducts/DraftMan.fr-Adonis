'use strict'

const Schema = use('Schema')

class PortfolioSchema extends Schema {
  up () {
    this.create('portfolio', (table) => {
      table.increments()
      table.string('name')
      table.string('url')
      table.string('description')
      table.string('type')
      table.string('illustration')
      table.integer('portfolio_details_id')
      table.date('published_at')
      table.timestamps()
    })
    this.create('portfolio_details', (table) => {
      table.increments()
      table.json('colors')
      table.string('typographie1').notNullable()
      table.string('typographie2').notNullable()
      table.text('problematique').notNullable()
      table.text('presentation').notNullable()
      table.text('technique').notNullable()
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