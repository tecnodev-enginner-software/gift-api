import Database from '@ioc:Adonis/Lucid/Database'

import { RoleFactory, FavoriteFactory, UserFactory } from 'Database/factories'

import RoleEnum from 'Contracts/enums/Role'

import { test, TestContext } from '@japa/runner'
import User from 'App/Models/User'
import Favorite from 'App/Models/Favorite'

const BASE_URL = `/api/v1`

let tokenBasic = ''

let userModelBasic = {} as User

const userToken = async function (context: TestContext, role: number): Promise<any> {
  const { client } = context

  const plainPassword = 'test'
  const roleBasic = await RoleFactory.merge({ binary: role }).create()
  const newUser = await UserFactory.merge({ password: plainPassword }).create()
  await newUser.related('roles').attach([roleBasic.id])
  const response = await client
    .post(`${BASE_URL}/sessions`)
    .json({ email: newUser.email, password: plainPassword })
  response.assertStatus(201)

  const body = response.body()

  return { user: body.user, token: body.token.token }
}

test.group('Favorite', (group) => {
  group.each.setup(async (request) => {
    await Database.beginGlobalTransaction()

    const dataBasic = await userToken(request.context, RoleEnum.BASIC)
    tokenBasic = dataBasic.token
    userModelBasic = dataBasic.user
  })

  group.each.teardown(async (response) => {
    await response.context.client
      .delete(`${BASE_URL}/sessions`)
      .header('Authorization', `Bearer ${tokenBasic}`)
    await Database.rollbackGlobalTransaction()
  })

  test('update - it should add an user favorite', async ({ client, assert }) => {
    const { id } = await UserFactory.create()
    const response = await client
      .put(`${BASE_URL}/favorites/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({ selected: true })
    response.assertStatus(204)

    const { userId, favoritedId } = await Favorite.findByOrFail('userId', userModelBasic.id)

    assert.equal(userId, userModelBasic.id)
    assert.equal(favoritedId, id)
  })

  test('update - it should remove an user favorite', async ({ client, assert }) => {
    const { id } = await UserFactory.create()
    const response = await client
      .put(`${BASE_URL}/favorites/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({ selected: false })
    response.assertStatus(204)

    const favorite = await Favorite.findBy('userId', userModelBasic.id)
    assert.isNull(favorite)
  })

  test('index - it should return user favorite added', async ({ client, assert }) => {
    const userOne = await UserFactory.create()

    await FavoriteFactory.merge({
      userId: userModelBasic.id,
      favoritedId: userOne.id,
    }).create()

    const response = await client
      .get(`${BASE_URL}/favorites`)
      .header('Authorization', `Bearer ${tokenBasic}`)
    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.paginate)
    assert.exists(body.paginate.meta)
    assert.exists(body.paginate.data)

    assert.isObject(body.paginate)
    assert.isObject(body.paginate.meta)

    assert.isArray(body.paginate.data)
    assert.isNotEmpty(body.paginate.data)

    const last = body.paginate.data[body.paginate.data.length - 1]

    assert.equal(last.user.id, userModelBasic.id)
    assert.equal(last.favorited.id, userOne.id)
  })

  test('index - it should return empty', async ({ client, assert }) => {
    const userOne = await UserFactory.create()
    const userTwo = await UserFactory.create()

    await FavoriteFactory.merge({
      userId: userTwo.id,
      favoritedId: userOne.id,
    }).create()

    const response = await client
      .get(`${BASE_URL}/favorites`)
      .header('Authorization', `Bearer ${tokenBasic}`)
    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.paginate)
    assert.exists(body.paginate.meta)
    assert.exists(body.paginate.data)

    assert.isObject(body.paginate)
    assert.isObject(body.paginate.meta)

    assert.isArray(body.paginate.data)
    assert.isEmpty(body.paginate.data)
  })
})
