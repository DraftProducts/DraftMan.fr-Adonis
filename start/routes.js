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
 | Static pages
 |--------------------------------------------------------------------------
 */

Route.get('/', 'BlogController.accueil')

Route.on('a-propos').render('a-propos')

Route.on('discord').render('discord')

Route.get('discord/login', 'ProfilController.discordLogin')

Route.on('success').render('success')

Route.on('draftbot').render('draftbot')

/**
 |--------------------------------------------------------------------------
 | Search
 |--------------------------------------------------------------------------
 */

Route.get('search', 'SearchController.index')
Route.post('search', 'SearchController.search')

/**
 |--------------------------------------------------------------------------
 | Blog pages
 |--------------------------------------------------------------------------
 */

Route.get('blog', 'BlogController.index')
Route.get('blog/list', 'BlogController.list')
Route.get('blog/:id-:link', 'BlogController.show')
Route.post('blog/:id/comment', 'BlogController.comment')

Route.post('newsletter', 'BlogController.newsletter')

/**
 |--------------------------------------------------------------------------
 | Portfolio pages
 |--------------------------------------------------------------------------
 */

Route.get('portfolio', 'PortfolioController.index')
Route.get('portfolio/:id-:url', 'PortfolioController.show')

/**
 |--------------------------------------------------------------------------
 | Contact pages
 |--------------------------------------------------------------------------
 */

Route.on('contact').render('contact')
Route.post('contact', 'ContactController.send')

/**
 |--------------------------------------------------------------------------
 | Admin pages
 |--------------------------------------------------------------------------
 */

Route.group(() => {
    Route.on('login').render('auth.login')
    Route.post('login', 'AuthController.login')
    Route.on('register').render('auth.register')
    Route.post('register', 'AuthController.register')
}).middleware(['verif']);

Route.group(() => {
    Route.get('me/client', 'ClientController.client_request')
    Route.post('me/client', 'ClientController.request')
}).middleware(['auth','client']);

Route.group(() => {
    Route.get('me/client/dashboard', 'ClientController.dashboard')
    Route.post('me/client/pay', 'ClientController.pay')
    Route.get('success', 'ClientController.paypalSuccess')
    Route.get('cancel', 'ClientController.paypalCancel')
}).middleware(['auth','client_d']);

Route.group(() => {
    Route.on('me/').render('dashboard.accueil')
    Route.on('me/profil').render('dashboard.profil')

    Route.get('discord/callback', 'ProfilController.discordCallback')

    Route.post('me/profil/compte', 'ProfilController.storeBasic')
    Route.post('me/profil/infos', 'ProfilController.storeInfos')

    Route.get('logout', 'AuthController.logout')
}).middleware(['auth']);

Route.group(() => {
    Route.get('me/comments', 'BackofficeController.comments')
    Route.get('me/comments/:id/delete', 'BackofficeController.destroy_comment')
    Route.get('me/comments/:id/valide', 'BackofficeController.valide_comment')

    Route.get('me/articles', 'BackofficeController.articles')
}).middleware(['auth','modo']);

Route.group(() => {
    Route.get('me/write', 'BlogController.create')
    Route.post('me/write', 'BlogController.store')

    Route.get('me/write/:id-:url', 'BlogController.edit')
    Route.post('me/write/:id-:url', 'BlogController.update')

    Route.get('blog/delete/:id-:url', 'BlogController.delete')
    
    Route.on('me/upload').render('dahsboard.upload')
}).middleware(['auth','writer']);

Route.group(() => {
    Route.get('admin/clients', 'ClientController.clients')
    Route.get('admin/clients/:id', 'ClientController.show')
    Route.get('admin/clients/:id/accept', 'ClientController.accept')
    Route.post('admin/clients/:id/refuse', 'ClientController.refuse')
    // Route.get('admin/users', 'AdminController.users')
    // Route.get('admin/newsletter', 'AdminController.newsletter')

    Route.get('admin/portfolio', 'PortfolioController.create')
    Route.post('admin/portfolio', 'PortfolioController.store')

    Route.get('admin/portfolio/:id', 'PortfolioController.edit')
    Route.post('admin/portfolio/:id', 'PortfolioController.update')
    Route.post('admin/portfolio/:id/details', 'PortfolioController.updateDetails')

    Route.get('admin/portfolio/:id/upgrade', 'PortfolioController.upgrade')
    Route.get('admin/portfolio/:id/decline', 'PortfolioController.decline')
}).middleware(['auth','admin']);

/**
 |--------------------------------------------------------------------------
 | Error pages
 |--------------------------------------------------------------------------
 */