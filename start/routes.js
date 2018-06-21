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

Route.get('/contact', 'ContactController.index')

Route.get('/portfolio', 'PortfolioController.index')

Route.get('/portfolio/:id', 'PortfolioController.details')

Route.get('/blog', 'BlogController.index')

Route.get('/blog/list', 'BlogController.list')

Route.post('contact', 'ContactController.verify')