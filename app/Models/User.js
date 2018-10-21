'use strict'

const Hash = use('Hash')
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Defines the relationship an author has with many posts.
   *
   * @see https://adonisjs.com/docs/4.0/relationships#_has_many
   */
  posts () {
    return this.hasMany('App/Models/Post', 'id', 'author_id')
  }
  /**
   * Defines the relationship an author has with a project.
   *
   * @see https://adonisjs.com/docs/4.0/relationships#_belongs_to
   */
  project () {
    return this.belongsTo('App/Models/Project', 'project_id', 'id')
  }
}

module.exports = User
