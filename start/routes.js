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

Route.on('/').render('index')

Route.on('/a-propos').render('a-propos')

Route.on('/discord').render('discord')


Route.get('/search', 'SearchController.index')

Route.post('search', 'SearchController.search')


Route.get('/blog', 'PostController.index')

Route.get('/blog/list', 'PostController.list')

Route.get('/blog/:link-:id', 'PostController.article')


Route.get('/portfolio', 'PortfolioController.index')

Route.get('/portfolio/:id', 'PortfolioController.details')


Route.get('/contact', 'ContactController.index')

Route.post('contact', 'ContactController.verify')