/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import RoleEnum from 'Contracts/enums/Role'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.group(() => {
        Route.post('/', 'UsersController.store')
        Route.post('/activate', 'UsersController.active')
      }).prefix('/users')

      Route.post('/forgot-password', 'PasswordsController.forgot')
      Route.post('/reset-password', 'PasswordsController.reset')

      Route.delete('/sessions', 'SessionsController.destroy')

      Route.resource('/musical-genres', 'MusicalGenresController').only(['index', 'show'])

      Route.resource('/modalities', 'ModalitiesController').only(['index', 'show'])

      Route.resource('/event-sizes', 'EventSizesController').only(['index', 'show'])

      Route.resource('/event-types', 'EventTypesController').only(['index', 'show'])

      Route.resource('/text-infos', 'TextInfosController').only(['index', 'show'])

      Route.resource('/sessions', 'SessionsController').only(['store', 'destroy'])
    })

    Route.group(() => {
      Route.group(() => {
        Route.get('/', 'ProfilesController.index').middleware(`role:${RoleEnum.MANAGER}`)
        Route.put('/approve/:id', 'ProfilesController.approve').middleware(
          `role:${RoleEnum.MANAGER}`
        )
        Route.put('/:id', 'ProfilesController.update')
        Route.post('/', 'ProfilesController.store')
      }).prefix('/profiles')

      Route.group(() => {
        Route.get('/:userId?', 'UsersController.show')
        Route.put('/:id', 'UsersController.update')
      }).prefix('/users')

      Route.resource('/roles', 'RolesController')
        .only(['index', 'update', 'destroy'])
        .middleware({
          index: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.ADMIN}`],
        })

      Route.resource('/musical-genres', 'MusicalGenresController')
        .only(['store', 'update', 'destroy'])
        .middleware({
          store: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
          destroy: [`role:${RoleEnum.MANAGER}`],
        })

      Route.resource('/modalities', 'ModalitiesController')
        .only(['store', 'update', 'destroy'])
        .middleware({
          store: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
          destroy: [`role:${RoleEnum.MANAGER}`],
        })

      Route.resource('/event-sizes', 'EventSizesController')
        .only(['store', 'update', 'destroy'])
        .middleware({
          store: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
          destroy: [`role:${RoleEnum.MANAGER}`],
        })

      Route.resource('/event-types', 'EventTypesController')
        .only(['store', 'update', 'destroy'])
        .middleware({
          store: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
          destroy: [`role:${RoleEnum.MANAGER}`],
        })

      Route.resource('/text-infos', 'TextInfosController')
        .only(['store', 'update'])
        .middleware({
          store: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
          destroy: [`role:${RoleEnum.MANAGER}`],
        })

      Route.get('/countries/search/:term', 'CountriesController.search').middleware(
        `role:${RoleEnum.MANAGER}`
      )
      Route.resource('/countries', 'CountriesController')
        .only(['store', 'update', 'show', 'index'])
        .middleware({
          index: [`role:${RoleEnum.MANAGER}`],
          store: [`role:${RoleEnum.MANAGER}`],
          show: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
        })

      Route.get('/states/search/:term', 'StatesController.search').middleware(
        `role:${RoleEnum.MANAGER}`
      )
      Route.resource('/states', 'StatesController')
        .only(['store', 'update', 'show', 'index'])
        .middleware({
          index: [`role:${RoleEnum.MANAGER}`],
          store: [`role:${RoleEnum.MANAGER}`],
          show: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
        })

      Route.get('/cities/search/:term', 'CitiesController.search').middleware(
        `role:${RoleEnum.MANAGER}`
      )
      Route.resource('/cities', 'CitiesController')
        .only(['store', 'update', 'show', 'index'])
        .middleware({
          index: [`role:${RoleEnum.MANAGER}`],
          store: [`role:${RoleEnum.MANAGER}`],
          show: [`role:${RoleEnum.MANAGER}`],
          update: [`role:${RoleEnum.MANAGER}`],
        })
    }).middleware(['auth'])
  }).prefix('/v1')
}).prefix('/api')
