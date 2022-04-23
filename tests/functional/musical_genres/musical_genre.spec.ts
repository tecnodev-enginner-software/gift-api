import Database from '@ioc:Adonis/Lucid/Database'
import { MusicalGenreFactory, RoleFactory, UserFactory } from 'Database/factories'

import { test, TestContext } from '@japa/runner'
import RoleEnum from 'Contracts/enums/Role'

const BASE_URL = `/api/v1`

let tokenBasic = ''

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

test.group('Musical Genre', (group) => {
  group.each.setup(async (request) => {
    await Database.beginGlobalTransaction()

    const dataBasic = await userToken(request.context, RoleEnum.MANAGER)
    tokenBasic = dataBasic.token
  })

  group.each.teardown(async (response) => {
    await response.context.client
      .delete(`${BASE_URL}/sessions`)
      .header('Authorization', `Bearer ${tokenBasic}`)
    await Database.rollbackGlobalTransaction()
  })

  test('store - it should create an musical genre', async ({ client, assert }) => {
    const musicalGenrePayload = { description: 'test' }
    const response = await client
      .post(`${BASE_URL}/musical-genres`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(musicalGenrePayload)

    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.data, 'musical genre undefined')
    assert.exists(body.data.id, 'id undefined')

    assert.equal(body.data.description, musicalGenrePayload.description)
  })

  test('store - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post(`${BASE_URL}/musical-genres`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({})

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - should return 422 when the description has no minimum length', async ({
    client,
    assert,
  }) => {
    const musicalGenrePayload = { description: 'te' }
    const response = await client
      .post(`${BASE_URL}/musical-genres`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(musicalGenrePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - should return 422 when the description does not respect the regex', async ({
    client,
    assert,
  }) => {
    const musicalGenrePayload = { description: '#0[' }
    const response = await client
      .post(`${BASE_URL}/musical-genres`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(musicalGenrePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when description is alreay in use', async ({
    client,
    assert,
  }) => {
    const { description } = await MusicalGenreFactory.create()
    const response = await client
      .post(`${BASE_URL}/musical-genres`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({
        description,
      })

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - it should update an musical genre', async ({ client, assert }) => {
    const { id } = await MusicalGenreFactory.create()
    const description = 'testing'
    const response = await client
      .put(`${BASE_URL}/musical-genres/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({ description })

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.data, 'musical genre undefined')
    assert.equal(body.data.description, description)

    assert.equal(body.data.id, id)
  })

  test('update - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const { id } = await MusicalGenreFactory.create()
    const response = await client
      .put(`${BASE_URL}/musical-genres/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({})

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - should return 422 when the description has no minimum length', async ({
    client,
    assert,
  }) => {
    const { id } = await MusicalGenreFactory.create()
    const musicalGenrePayload = { description: 'te' }
    const response = await client
      .put(`${BASE_URL}/musical-genres/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(musicalGenrePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - should return 422 when the description does not respect the regex', async ({
    client,
    assert,
  }) => {
    const { id } = await MusicalGenreFactory.create()
    const musicalGenrePayload = { description: '#0[' }
    const response = await client
      .put(`${BASE_URL}/musical-genres/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(musicalGenrePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - it should return 422 when description is alreay in use', async ({
    client,
    assert,
  }) => {
    const { id } = await MusicalGenreFactory.create()
    const { description } = await MusicalGenreFactory.create()
    const response = await client
      .put(`${BASE_URL}/musical-genres/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({
        description,
      })

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('index - it should return list with data', async ({ client, assert }) => {
    const { id, description } = await MusicalGenreFactory.create()

    const response = await client.get(`${BASE_URL}/musical-genres`)

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.paginate)
    assert.exists(body.paginate.meta)
    assert.exists(body.paginate.data)

    assert.isObject(body.paginate)
    assert.isObject(body.paginate.meta)

    assert.isArray(body.paginate.data)
    assert.isNotEmpty(body.paginate.data)

    assert.equal(body.paginate.data[0].id, id)
    assert.equal(body.paginate.data[0].description, description)
  })

  test('show - it should return list with data', async ({ client, assert }) => {
    const { id, description } = await MusicalGenreFactory.create()
    const response = await client.get(`${BASE_URL}/musical-genres/${id}`)

    response.assertStatus(200)

    const body = response.body()

    assert.isNotNull(body.data)
    assert.exists(body.data, id)
    assert.exists(body.data, description)
  })

  test('destroy - it should 204 when delete the data', async ({ client, assert }) => {
    const { id } = await MusicalGenreFactory.create()
    const responseOne = await client
      .delete(`${BASE_URL}/musical-genres/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)

    responseOne.assertStatus(204)

    const responseTwo = await client.get(`${BASE_URL}/musical-genres/${id}`)

    responseTwo.assertStatus(404)

    const body = responseTwo.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 404)
  })
})
