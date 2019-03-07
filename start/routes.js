'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

/**
 |--------------------------------------------------------------------------
 | Pages
 |--------------------------------------------------------------------------
 */

Route.get('/', 'PageController.home')
Route.on('a-propos').render('a-propos')

/**
 |--------------------------------------------------------------------------
 | Contact
 |--------------------------------------------------------------------------
 */

Route.get('contact','ContactController.create')
Route.post('contact', 'ContactController.store')

/**
 |--------------------------------------------------------------------------
 | Portfolio pages
 |--------------------------------------------------------------------------
 */

Route.get('portfolio', 'PortfolioController.index')
Route.get('portfolio/:id-:url', 'PortfolioDetailsController.show')

/**
 |--------------------------------------------------------------------------
 | Contact pages
 |--------------------------------------------------------------------------
 */

Route.get('contact','ContactController.create')
Route.post('contact', 'ContactController.store')

/**
 |--------------------------------------------------------------------------
 | Blog pages
 |--------------------------------------------------------------------------
 */

// Route.get('blog', 'BlogController.index')
// Route.get('blog/:id-:link', 'BlogController.show')
// Route.post('blog/:id/comment', 'CommentController.store')

// Route.post('newsletter', 'NewsletterController.store')

/**
 |--------------------------------------------------------------------------
 | Search
 |--------------------------------------------------------------------------
 */

// Route.get('search', 'SearchController.index')
// Route.post('search', 'SearchController.search')

/**
 |--------------------------------------------------------------------------
 | Links
 |--------------------------------------------------------------------------
 */

Route.get('discord','SocialController.discord')
Route.get('twitter','SocialController.twitter')
Route.get('github','SocialController.github')
Route.get('gitlab','SocialController.gitlab')
Route.get('facebook','SocialController.facebook')
Route.get('paypal','SocialController.paypal')
Route.get('google-plus','SocialController.google_plus')
Route.get('patreon','SocialController.patreon')

/**
 |--------------------------------------------------------------------------
 | DraftBot
 |--------------------------------------------------------------------------
 */

Route.get('draftbot','DraftBotController.show')
Route.get('draftbot/commandes','DraftBotController.index')
Route.get('draftbot/invite','DraftBotController.invite')

/**
 |--------------------------------------------------------------------------
 | Auth pages
 |--------------------------------------------------------------------------
 */

Route.group(() => {
    Route.get('register', 'UserController.create')
    Route.get('verify/:token','UserController.verify')
    Route.post('register', 'UserController.store')

    Route.get('login', 'SessionController.create')
    Route.post('login', 'SessionController.store')
    Route.delete('logout', 'SessionController.destroy')

    Route.get('login/password','PasswordController.create')
    Route.post('login/password', 'PasswordController.store')

    Route.get('login/password/change/:token','PasswordController.edit')
    Route.post('login/password/change/:token', 'PasswordController.update')
}).middleware(['verif']);

/**
 |--------------------------------------------------------------------------
 | Profil
 |--------------------------------------------------------------------------
 */

Route.group(() => {
  Route.on('me/').render('dashboard/accueil')
  Route.on('me/profil').render('dashboard/profil')

  Route.get('discord/login', 'SocialController.create')
  Route.get('discord/callback', 'SocialController.store')

  Route.post('me/profil/compte', 'UserController.update')
  Route.post('me/profil/image', 'Dashboard/FileController.uploadImage')
  Route.post('me/profil/social', 'SocialController.update')

  Route.get('logout', 'SessionController.destroy')
}).middleware(['auth']);

/**
 |--------------------------------------------------------------------------
 | NotClient pages
 |--------------------------------------------------------------------------
 */

Route.group(() => {
  Route.get('me/client', 'ClientController.create')
  Route.post('me/client', 'ClientController.store')
}).middleware(['auth','client']);

/**
 |--------------------------------------------------------------------------
 | Clients pages
 |--------------------------------------------------------------------------
 */

Route.group(() => {
  Route.get('me/client/dashboard', 'ClientController.show')
  Route.post('me/client/pay', 'ClientController.pay')
  Route.get('success', 'ClientController.success')
  Route.get('cancel', 'ClientController.cancel')
}).middleware(['auth','client_d']);

/**
 |--------------------------------------------------------------------------
 | Moderator pages
 |--------------------------------------------------------------------------
 */

// Route.group(() => {
//   Route.get('me/comments', 'Dashboard/CommentController.index')
//   Route.get('me/comments/:id/valide', 'Dashboard/CommentController.valide')
//   Route.get('me/comments/:id/delete', 'Dashboard/CommentController.destroy')

//   Route.get('me/articles', 'Dashboard/BlogController.index')
//   Route.get('me/articles/:id-:url', 'Dashboard/BlogController.show')
// }).middleware(['auth','modo']);

/**
 |--------------------------------------------------------------------------
 | Writer pages
 |--------------------------------------------------------------------------
 */

Route.group(() => {
  // Route.get('me/write', 'Dashboard/BlogController.create')
  // Route.post('me/write', 'Dashboard/BlogController.store')

  // Route.get('me/write/:id-:url', 'Dashboard/BlogController.edit')
  // Route.post('me/write/:id-:url', 'Dashboard/BlogController.update')

  // Route.get('blog/delete/:id-:url', 'Dashboard/BlogController.destroy')

  Route.get('me/upload','Dashboard/FileController.create')
  Route.post('me/upload','Dashboard/FileController.store')
}).middleware(['auth','writer']);

/**
 |--------------------------------------------------------------------------
 | Admin pages
 |--------------------------------------------------------------------------
 */

Route.group(() => {
  Route.get('admin/clients', 'Dashboard/ClientController.index')
  Route.get('admin/clients/:id', 'Dashboard/ClientController.show')
  Route.get('admin/clients/:id/accept', 'Dashboard/ClientController.accept')
  Route.post('admin/clients/:id/refuse', 'Dashboard/ClientController.refuse')

  Route.post('admin/clients/:project/upload','Dashboard/FileController.uploadProjectImage')
  Route.post('admin/clients/:project/update','Dashboard/ClientController.update')
  Route.get('admin/users', 'Dashboard/UserController.create')
  Route.get('admin/user/:id/client', 'Dashboard/ClientController.create')
  Route.post('admin/user/:id/client', 'Dashboard/ClientController.store')
  // Route.get('admin/newsletter', 'AdminController.newsletter')

  Route.get('admin/portfolio', 'PortfolioController.create')
  Route.post('admin/portfolio', 'PortfolioController.store')

  Route.get('admin/portfolio/:id', 'PortfolioController.edit')
  Route.post('admin/portfolio/:id', 'PortfolioController.update')
  Route.post('admin/portfolio/:id/details', 'PortfolioDetailsController.update')

  Route.get('admin/portfolio/:id/upgrade', 'PortfolioDetailsController.upgrade')
  Route.get('admin/portfolio/:id/decline', 'PortfolioDetailsController.decline')
}).middleware(['auth','admin'])

Route.get('api/project/:project_id', 'ClientController.getProjetCommits')
