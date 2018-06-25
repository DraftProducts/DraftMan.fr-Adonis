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

Route.on('/a-propos').render('a-propos')

Route.on('/discord').render('discord')

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

Route.get('/blog', 'PostController.index')

Route.get('/blog/list', 'PostController.list')

Route.get('/blog/:link-:id', 'PostController.article')

/**
 |--------------------------------------------------------------------------
 | Portfolio pages
 |--------------------------------------------------------------------------
 */ 

Route.get('/portfolio', 'PortfolioController.index')

Route.get('/portfolio/:id', 'PortfolioController.details')

/**
 |--------------------------------------------------------------------------
 | Contact pages
 |--------------------------------------------------------------------------
 */ 

Route.get('/contact', 'ContactController.index')

Route.post('/contact', 'ContactController.verify')

/**
 |--------------------------------------------------------------------------
 | Admin pages
 |--------------------------------------------------------------------------
 */ 

Route.get('/login', 'SessionController.login')

Route.post('/login', 'SessionController.check')

Route.get('/register', 'SessionController.register')

Route.post('/register', 'SessionController.store')