'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('website', 60).defaultTo('')
      table.string('github', 60).defaultTo('')
      table.string('twitter', 60).defaultTo('')
      table.string('linkedin', 60).defaultTo('')
      table.string('discord_username', 60).defaultTo('')
      table.string('discord_discriminator', 60).defaultTo('')
      table.string('discord_email', 60).defaultTo('')
      table.string('discord_image').defaultTo('')
      table.string('profil')
      table.integer('role').defaultTo(0)
      table.integer('client')
      table.integer('project_id')
      table.string('account_status').defaultsTo('pending')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
