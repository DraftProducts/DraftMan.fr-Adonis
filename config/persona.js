'use strict'

/*
|--------------------------------------------------------------------------
| Persona
|--------------------------------------------------------------------------
|
| The persona is a simple and opinionated service to register, login and
| manage user account
|
*/

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Uids
  |--------------------------------------------------------------------------
  |
  | An array of fields, that can be used to indetify a user uniquely. During
  | login and reset password, these fields be checked against the user
  | input
  |
  */
  uids: ['email'],

  /*
  |--------------------------------------------------------------------------
  | Email field
  |--------------------------------------------------------------------------
  |
  | The name of the email field inside the database and the user payload.
  |
  */
  email: 'email',

  /*
  |--------------------------------------------------------------------------
  | Password
  |--------------------------------------------------------------------------
  |
  | The password field to be used for verifying and storing user password
  |
  */
  password: 'password',

  /*
  |--------------------------------------------------------------------------
  | New account state
  |--------------------------------------------------------------------------
  |
  | State of user when a new account is created
  |
  */
  newAccountState: 'pending',

  /*
  |--------------------------------------------------------------------------
  | Verified account state
  |--------------------------------------------------------------------------
  |
  | State of user after they verify their email address
  |
  */
  verifiedAccountState: 'active',

  /*
  |--------------------------------------------------------------------------
  | Model
  |--------------------------------------------------------------------------
  |
  | The model to be used for verifying and creating users
  |
  */
  model: 'App/Models/User',

  /*
  |--------------------------------------------------------------------------
  | Date Format
  |--------------------------------------------------------------------------
  |
  | The date format for the tokens table. It is required to calculate the
  | expiry of a token.
  |
  */
  dateFormat: 'YYYY-MM-DD HH:mm:ss',

  /*
  |--------------------------------------------------------------------------
  | Validation messages
  |--------------------------------------------------------------------------
  |
  | An object of validation messages to be used when validation fails.
  |
  */

  validationMessages: (action) => {
    return {
      'username.required': 'Veuillez indiquer un pseudo.',
      'email.required': 'Veuillez entrer une adresse email.',
      'email.email': 'Veuillez entrer une adresse email valide.',
      'username.unique': 'Ce pseudo est déjà utilisé.',
      'email.unique': 'Cette adresse email est déjà utilisé.',
      'password.required': action === 'updatePassword' ? 'Veuillez indiquer votre nouveau mot de passe.' : 'Veuillez indiquer votre mot de passe.',
      'password.confirmed': 'Veuillez répéter votre mot de passe.',
      'old_password.required': 'Veuillez indiquer votre ancien mot de passe.'
    }
  }
}
