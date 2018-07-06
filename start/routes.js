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

Route.on('/').render('index')

Route.on('a-propos').render('a-propos')

Route.on('discord').render('discord')

Route.get('discord/login', 'BackofficeProfilController.discordLogin')

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
Route.get('blog/:link-:id', 'PostController.article')

/**
 |--------------------------------------------------------------------------
 | Portfolio pages
 |--------------------------------------------------------------------------
 */

Route.get('portfolio', 'PortfolioController.index')
Route.get('portfolio/:id', 'PortfolioController.details')

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
    Route.get('/me/', 'BackofficeAccueilController.index')
    Route.get('/me/profil', 'BackofficeProfilController.index')
    Route.get('/me/client', 'BackofficeClientController.index')
    Route.get('/me/comments', 'BackofficeCommentsController.index')

    Route.get('discord/callback', 'BackofficeProfilController.discordCallback')

    Route.post('/me/profil/compte', 'BackofficeProfilController.storeBasic')
    Route.post('/me/profil/infos', 'BackofficeProfilController.storeInfos')
    
}).middleware(['auth']);

Route.group(() => {
    Route.get('/me/comments', 'BackofficeCommentsController.index')
}).middleware(['auth','modo']);