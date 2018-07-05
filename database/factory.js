'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: 'secret',
  }
})

Factory.blueprint('App/Models/Post', (faker) => {
  return {
    title: faker.sentence(),
    description: faker.paragraph(),
    tags: `${faker.word()}, ${faker.word()}`,
    content: faker.paragraph(3),
  }
})

Factory.blueprint('App/Models/Portfolio', (faker) => {
  return {
    name: faker.sentence(),
    description: faker.paragraph(),
    type: `${faker.word()}, ${faker.word()}`,
    illustration: faker.image()
  }
})

Factory.blueprint('App/Models/Comment', (faker, parent_id) => {
  return {
    name: faker.username(),
    email: faker.email(),
    website: faker.url(),
    twitter: faker.username(),
    github: faker.username(),
    linkedin: faker.username(),
    content: faker.paragraph(3),
    post_id: 1,
    seen: 0,
    parent_id: parent_id
  }
})