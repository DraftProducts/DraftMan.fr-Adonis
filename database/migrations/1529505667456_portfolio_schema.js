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
      table.date('date')
      table.string('illustration')
    })
  }

  down () {
    this.drop('portfolio')
  }
}

module.exports = PortfolioSchema
