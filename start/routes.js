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

Route.get('/', 'HomeController.index')

Route.on('a-propos').render('a-propos')

Route.on('discord').render('discord')

Route.get('discord/login', 'ProfilController.discordLogin')

Route.on('draftbot').render('draftbot')

/**
 |--------------------------------------------------------------------------
 | Search
 |--------------------------------------------------------------------------
 */

Route.get('/search', 'SearchController.index')
Route.post('/search', 'SearchController.search')

/**
 |--------------------------------------------------------------------------
 | Blog pages
 |--------------------------------------------------------------------------
 */

Route.get('blog', 'PostController.index')
Route.get('blog/list', 'PostController.list')
Route.get('blog/:id-:link', 'PostController.show')
Route.post('blog/:id/comment', 'PostController.comment')

/**
 |--------------------------------------------------------------------------
 | Portfolio pages
 |--------------------------------------------------------------------------
 */

Route.get('portfolio', 'PortfolioController.index')
Route.get('portfolio/:id', 'PortfolioController.show')

/**
 |--------------------------------------------------------------------------
 | Contact pages
 |--------------------------------------------------------------------------
 */

Route.get('contact', 'ContactController.index')
Route.post('contact', 'ContactController.verify')

/**
 |--------------------------------------------------------------------------
 | Admin pages
 |--------------------------------------------------------------------------
 */

Route.group(() => {
    Route.get('login', 'LoginController.create')
    Route.post('login', 'LoginController.store')
    Route.get('register', 'RegisterController.create')
    Route.post('register', 'RegisterController.store')
}).middleware(['verif']);

Route.group(() => {
    Route.get('/me/client', 'ClientController.client')
    Route.post('/me/client', 'ClientController.send')
}).middleware(['auth','client']);
Route.group(() => {
    Route.get('/me/client/dashboard', 'ClientController.dashboard')
    Route.post('/me/client/pay', 'ClientController.pay')
    Route.get('/me/client/success', 'ClientController.paySuccess')
}).middleware(['auth','client_d']);

Route.group(() => {
    Route.get('/me/', 'BackofficeController.index')
    Route.get('/me/profil', 'ProfilController.index')

    Route.get('discord/callback', 'ProfilController.discordCallback')

    Route.post('/me/profil/compte', 'ProfilController.storeBasic')
    Route.post('/me/profil/infos', 'ProfilController.storeInfos')

    Route.get('/legout', 'RegisterController.legout')
}).middleware(['auth']);

Route.group(() => {
    Route.get('/me/comments', 'BackofficeController.comments')
    Route.get('/me/comments/:id/delete', 'BackofficeController.destroy_comment')
    Route.get('/me/comments/:id/valide', 'BackofficeController.valide_comment')

    Route.get('/me/articles', 'BackofficeController.articles')
}).middleware(['auth','modo']);

Route.group(() => {
    Route.get('/me/write', 'PostController.create')
    Route.post('/me/write', 'PostController.store')

    Route.get('/me/write/:id-:url', 'PostController.edit')
    Route.post('/me/write/:id-:url', 'PostController.update')

    Route.get('/blog/delete/:id-:url', 'PostController.delete')
    
    Route.get('/me/upload', 'BackofficeController.upload')
}).middleware(['auth','writer']);

Route.group(() => {
    Route.get('/admin/clients', 'AdminController.clients')
    Route.get('/admin/users', 'AdminController.users')
    Route.get('/admin/newsletter', 'AdminController.newsletter')

    Route.get('/admin/portfolio', 'PortfolioController.create')
    Route.post('/admin/portfolio', 'PortfolioController.store')

    Route.get('/admin/portfolio/:id', 'PortfolioController.edit')
    Route.post('/admin/portfolio/:id', 'PortfolioController.update')
    Route.post('/admin/portfolio/:id/details', 'PortfolioController.updateDetails')

    Route.get('/admin/portfolio/:id/upgrade', 'PortfolioController.upgrade')
}).middleware(['auth','admin']);