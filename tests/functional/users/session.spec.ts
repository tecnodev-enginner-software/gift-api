import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

const BASE_URL = '/api/v1'

test.group('Session', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('store - it should authenticate an user', async ({ client, assert }) => {
    const plainPassword = 'test'
    const { id, email } = await UserFactory.merge({ password: plainPassword }).create()
    const response = await client
      .post(`${BASE_URL}/sessions`)
      .json({ email, password: plainPassword })
    response.assertStatus(201)

    const body = response.body()

    assert.isDefined(body.user, 'User undefined')
    assert.equal(body.user.id, id)
  })

  test('store - it should return an api token when session is created', async ({
    client,
    assert,
  }) => {
    const plainPassword = 'test'
    const { id, email } = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client
      .post(`${BASE_URL}/sessions`)
      .json({ email, password: plainPassword })
    response.assertStatus(201)

    const body = response.body()

    assert.isDefined(body.token, 'Token undefined')
    assert.equal(body.user.id, id)
  })

  test('store - it should return 422 when credentials are not provided', async ({
    client,
    assert,
  }) => {
    const response = await client.post(`${BASE_URL}/sessions`).json({})
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 400 when credentials are invalid', async ({ client, assert }) => {
    const { email } = await UserFactory.create()
    const response = await client.post(`${BASE_URL}/sessions`).json({
      email,
      password: 'test',
    })
    response.assertStatus(400)

    const body = response.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
    assert.equal(body.message, 'invalid credentials')
  })

  test('destroy - it should return 200 when user signs out', async ({ client, assert }) => {
    const plainPassword = 'test'
    const { email } = await UserFactory.merge({ password: plainPassword }).create()
    const responseOne = await client
      .post(`${BASE_URL}/sessions`)
      .json({ email, password: plainPassword })
    responseOne.assertStatus(201)

    const body = responseOne.body()

    const apiToken = body.token

    const responseTwo = await client
      .delete(`${BASE_URL}/sessions`)
      .header('Authorization', `Bearer ${apiToken.token}`)
    responseTwo.assertStatus(200)
  })

  test('destroy - it should revoke token when user signs out', async ({ client, assert }) => {
    const plainPassword = 'test'
    const { email } = await UserFactory.merge({ password: plainPassword }).create()

    const responseOne = await client
      .post(`${BASE_URL}/sessions`)
      .json({ email, password: plainPassword })
    responseOne.assertStatus(201)

    const body = responseOne.body()

    const apiToken = body.token

    const responseTwo = await client
      .delete(`${BASE_URL}/sessions`)
      .header('Authorization', `Bearer ${apiToken.token}`)
    responseTwo.assertStatus(200)

    const token = await Database.query().select('*').from('api_tokens')
    assert.isEmpty(token)
  })
})
