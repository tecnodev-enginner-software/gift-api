import Database from '@ioc:Adonis/Lucid/Database'
import { test, TestContext } from '@japa/runner'
import RoleEnum from 'Contracts/enums/Role'
import { CountryFactory, StateFactory, RoleFactory, UserFactory } from 'Database/factories'

const BASE_URL = `/api/v1`

let tokenBasic = ''
let tokenManager = ''

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

test.group('Country', (group) => {
  group.each.setup(async (request) => {
    await Database.beginGlobalTransaction()

    const dataBasic = await userToken(request.context, RoleEnum.BASIC)
    tokenBasic = dataBasic.token

    const dataManager = await userToken(request.context, RoleEnum.MANAGER)
    tokenManager = dataManager.token
  })

  group.each.teardown(async (response) => {
    await response.context.client
      .delete(`${BASE_URL}/sessions`)
      .header('Authorization', `Bearer ${tokenBasic}`)
    await response.context.client
      .delete(`${BASE_URL}/sessions`)
      .header('Authorization', `Bearer ${tokenManager}`)
    await Database.rollbackGlobalTransaction()
  })

  test('store - it should create an country', async ({ client, assert }) => {
    const countryPayload = { name: 'test', abbreviation: 'test', bacen: 9999 }
    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.data, 'country undefined')
    assert.exists(body.data.id, 'id undefined')

    assert.equal(body.data.name, countryPayload.name)
    assert.equal(body.data.abbreviation, countryPayload.abbreviation)
    assert.equal(body.data.bacen, countryPayload.bacen)
  })

  test('store - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
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

  test('store - it should return 422 when the name has no minimum length', async ({
    client,
    assert,
  }) => {
    const countryPayload = { name: 'te', abbreviation: 'test' }
    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when the abbreviation has no minimum length', async ({
    client,
    assert,
  }) => {
    const countryPayload = { name: 'test', abbreviation: 'te' }
    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when the name does not respect the regex', async ({
    client,
    assert,
  }) => {
    const countryPayload = { name: '#0[', abbreviation: 'test' }
    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when the abbreviation does not respect the regex', async ({
    client,
    assert,
  }) => {
    const countryPayload = { name: 'test', abbreviation: '#0[' }
    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when bacen is alreay in use', async ({ client, assert }) => {
    const { bacen } = await CountryFactory.create()

    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json({
        bacen,
        name: 'test',
        abbreviation: 'test',
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

  test('store - it should return 422 when name is alreay in use', async ({ client, assert }) => {
    const { name } = await CountryFactory.create()
    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json({
        name,
        abbreviation: 'test',
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

  test('store - it should return 422 when abbreviation is alreay in use', async ({
    client,
    assert,
  }) => {
    const { abbreviation } = await CountryFactory.create()

    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json({
        name: 'test',
        abbreviation,
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

  test('store - it should return 403 when basic user', async ({ client, assert }) => {
    const countryPayload = { name: 'test', abbreviation: 'test', bacen: 99999 }

    const response = await client
      .post(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(countryPayload)

    response.assertStatus(403)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'FORBIDDEN_REQUEST')
    assert.equal(body.status, 403)
  })

  test('update - it should update an country', async ({ client, assert }) => {
    const { id } = await CountryFactory.create()
    const countryPayload = { name: 'testing', abbreviation: 'testing', bacen: 9999 }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.data, 'country undefined')

    assert.equal(body.data.abbreviation, countryPayload.abbreviation)
    assert.equal(body.data.name, countryPayload.name)
    assert.equal(body.data.id, id)
  })

  test('update - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const { id } = await CountryFactory.create()

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
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

  test('update - should return 422 when the name has no minimum length', async ({
    client,
    assert,
  }) => {
    const { id } = await CountryFactory.create()

    const countryPayload = { name: 'te', abbreviation: 'testing' }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - should return 422 when the abbreviation has no minimum length', async ({
    client,
    assert,
  }) => {
    const { id } = await CountryFactory.create()

    const countryPayload = { name: 'testing', abbreviation: 'te' }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - should return 422 when the name does not respect the regex', async ({
    client,
    assert,
  }) => {
    const { id } = await CountryFactory.create()

    const countryPayload = { name: '#0[', abbreviation: 'testing' }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - should return 422 when the abbreviation does not respect the regex', async ({
    client,
    assert,
  }) => {
    const { id } = await CountryFactory.create()

    const countryPayload = { name: 'testing', abbreviation: '#0[' }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(countryPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - it should return 422 when name is alreay in use', async ({ client, assert }) => {
    const { id } = await CountryFactory.create()
    const { name } = await CountryFactory.create()
    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json({
        name,
        abbreviation: 'testing',
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

  test('update - it should return 422 when abbreviation is alreay in use', async ({
    client,
    assert,
  }) => {
    const { id } = await CountryFactory.create()
    const { abbreviation } = await CountryFactory.create()

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json({
        name: 'testing',
        abbreviation,
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

  test('update - it should return 422 when bacen is alreay in use', async ({ client, assert }) => {
    const { id } = await CountryFactory.create()
    const { bacen } = await CountryFactory.create()

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json({
        name: 'testing',
        abbreviation: 'testing',
        bacen,
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

  test('show - it should return data', async ({ client, assert }) => {
    const { id, name, abbreviation } = await CountryFactory.create()

    const response = await client
      .get(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    response.assertStatus(200)

    const body = response.body()

    assert.isNotNull(body.data)

    assert.equal(body.data.id, id)
    assert.equal(body.data.name, name)
    assert.equal(body.data.abbreviation, abbreviation)
  })

  test('search - it should return list with data', async ({ client, assert }) => {
    const { id, name, abbreviation, bacen } = await CountryFactory.create()

    const response = await client
      .get(`${BASE_URL}/countries/search/${name}`)
      .header('Authorization', `Bearer ${tokenManager}`)

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

    assert.equal(last.id, id)
    assert.equal(last.name, name)
    assert.equal(last.abbreviation, abbreviation)
    assert.equal(last.bacen, bacen)
  })

  test('index - it should return list with data', async ({ client, assert }) => {
    const { id, name, abbreviation, bacen } = await CountryFactory.create()

    const responseOne = await client
      .get(`${BASE_URL}/countries`)
      .header('Authorization', `Bearer ${tokenManager}`)

    responseOne.assertStatus(200)

    const body = responseOne.body()

    assert.exists(body.paginate)
    assert.exists(body.paginate.meta)
    assert.exists(body.paginate.data)

    assert.isObject(body.paginate)
    assert.isObject(body.paginate.meta)

    const responseTwo = await client
      .get(`${BASE_URL}/countries${body.paginate.meta.lastPageUrl}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    responseTwo.assertStatus(200)

    const data = responseTwo.body()

    assert.isArray(data.paginate.data)
    assert.isNotEmpty(data.paginate.data)

    const last = data.paginate.data[data.paginate.data.length - 1]

    assert.equal(last.id, id)
    assert.equal(last.name, name)
    assert.equal(last.abbreviation, abbreviation)
    assert.equal(last.bacen, bacen)
  })

  test('destroy - it should return 204 in destroy data', async ({ client, assert }) => {
    const { id } = await CountryFactory.create()

    const response = await client
      .delete(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    response.assertStatus(204)
  })

  test('destroy - it should return 400 in destroy data with relationship', async ({
    client,
    assert,
  }) => {
    const { id } = await CountryFactory.create()
    await StateFactory.merge({ countryId: id }).create()

    const response = await client
      .delete(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    response.assertStatus(409)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })
})
