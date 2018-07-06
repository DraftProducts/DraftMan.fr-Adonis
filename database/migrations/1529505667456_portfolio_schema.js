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
      table.date('published_at')
      table.timestamps()
    })
    this.create('projects', (table) => {
      table.increments()
      table.string('url')
      table.integer('ref')
      table.string('color1')
      table.string('color2')
      table.string('color3')
      table.string('color4')
      table.string('color5')
      table.string('typographie1')
      table.string('typographie2')
      table.text('problematique')
      table.text('presentation')
      table.text('technique')
      table.string('logo')
      table.string('folder')
      table.timestamps()
    })
  }

  down () {
    this.drop('portfolio')
  }
}

module.exports = PortfolioSchema
