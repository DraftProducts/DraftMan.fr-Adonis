'use strict'

/*
|--------------------------------------------------------------------------
| PostSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Database = use('Database')

class PostSeeder {
  async run () {
    // Deletes all data in those tables
    await Database.truncate('users')
    await Database.truncate('posts')

    // Generates & Stores a user
    const user = await Factory.model('App/Models/User').create()

    const comment = await Factory.model('App/Models/Comment').create()
    const replies = await Factory.model('App/Models/Comment').create({ parent_id: comment.id })

    // Generates 10 posts
    const posts = await Factory.model('App/Models/Blog').makeMany(10)

    // Assigns those posts to the user
    await user.posts().saveMany(posts)
  }
}

module.exports = PostSeeder
