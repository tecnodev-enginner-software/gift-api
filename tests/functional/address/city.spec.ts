import Database from '@ioc:Adonis/Lucid/Database'
import { test, TestContext } from '@japa/runner'
import RoleEnum from 'Contracts/enums/Role'
import { CityFactory, RoleFactory, StateFactory, UserFactory } from 'Database/factories'

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

test.group('City', (group) => {
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

  test('store - it should create an city', async ({ client, assert }) => {
    const state = await StateFactory.create()

    const cityPayload = {
      name: 'test',
      geom: '(-20.0778007507324,-41.1260986328125)',
      latitude: -2.00778007507324e17,
      longitude: -4.11260986328125e14,
      stateId: state.id,
      codTom: 9999,
      ibge: 9999,
    }

    const response = await client
      .post(`${BASE_URL}/cities`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(cityPayload)

    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.data, 'city undefined')
    assert.exists(body.data.id, 'id undefined')

    assert.equal(body.data.name, cityPayload.name)
    assert.equal(body.data.geom, cityPayload.geom)
    assert.equal(body.data.latitude, cityPayload.latitude)
    assert.equal(body.data.longitude, cityPayload.longitude)
    assert.equal(body.data.stateId, cityPayload.stateId)
    assert.equal(body.data.codTom, cityPayload.codTom)
    assert.equal(body.data.ibge, cityPayload.ibge)
  })

  test('store - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post(`${BASE_URL}/cities`)
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
    const state = await StateFactory.create()

    const cityPayload = {
      name: 'te',
      geom: '(-20.0778007507324,-41.1260986328125)',
      latitude: -2.00778007507324e17,
      longitude: -4.11260986328125e14,
      stateId: state.id,
      codTom: 9999,
      ibge: 9999,
    }

    const response = await client
      .post(`${BASE_URL}/cities`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(cityPayload)

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
    const state = await StateFactory.create()

    const cityPayload = {
      name: '@na_me!',
      geom: '(-20.0778007507324,-41.1260986328125)',
      latitude: -2.00778007507324e17,
      longitude: -4.11260986328125e14,
      stateId: state.id,
      codTom: 9999,
      ibge: 9999,
    }

    const response = await client
      .post(`${BASE_URL}/cities`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(cityPayload)

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
    const state = await StateFactory.create()

    const cityPayload = {
      name: 'test',
      geom: '(-20.0778007507324,-41.1260986328125)',
      latitude: -2.00778007507324e17,
      longitude: -4.11260986328125e14,
      stateId: state.id,
      codTom: 9999,
      ibge: 9999,
    }

    const response = await client
      .post(`${BASE_URL}/cities`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(cityPayload)

    response.assertStatus(403)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'FORBIDDEN_REQUEST')
    assert.equal(body.status, 403)
  })

  test('update - it should update an state', async ({ client, assert }) => {
    const { id } = await CityFactory.create()

    const state = await StateFactory.create()

    const cityPayload = {
      name: 'test',
      geom: '(-20.0778007507324,-41.1260986328125)',
      latitude: -2.00778007507324e17,
      longitude: -4.11260986328125e14,
      stateId: state.id,
      codTom: 9999,
      ibge: 9999,
    }

    const response = await client
      .put(`${BASE_URL}/cities/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(cityPayload)

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.data, 'city undefined')
    assert.exists(body.data.id, 'id undefined')

    assert.equal(body.data.name, cityPayload.name)
    assert.equal(body.data.geom, cityPayload.geom)
    assert.equal(body.data.latitude, cityPayload.latitude)
    assert.equal(body.data.longitude, cityPayload.longitude)
    assert.equal(body.data.stateId, cityPayload.stateId)
    assert.equal(body.data.codTom, cityPayload.codTom)
    assert.equal(body.data.ibge, cityPayload.ibge)
  })

  test('update - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const { id } = await CityFactory.create()

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
    const { id } = await CityFactory.create()

    const state = await StateFactory.create()

    const cityPayload = {
      name: 'te',
      geom: '(-20.0778007507324,-41.1260986328125)',
      latitude: -2.00778007507324e17,
      longitude: -4.11260986328125e14,
      stateId: state.id,
      codTom: 9999,
      ibge: 9999,
    }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(cityPayload)

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
    const { id } = await CityFactory.create()

    const state = await StateFactory.create()

    const cityPayload = {
      name: '@na_me!',
      geom: '(-20.0778007507324,-41.1260986328125)',
      latitude: -2.00778007507324e17,
      longitude: -4.11260986328125e14,
      stateId: state.id,
      codTom: 9999,
      ibge: 9999,
    }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(cityPayload)

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
    const { id, name, stateId, ibge } = await CityFactory.create()

    const response = await client
      .get(`${BASE_URL}/cities/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    response.assertStatus(200)

    const body = response.body()

    assert.isNotNull(body.data)

    assert.equal(body.data.id, id)
    assert.equal(body.data.name, name)
    assert.equal(body.data.stateId, stateId)
    assert.equal(body.data.ibge, ibge)
  })

  test('search - it should return list with data', async ({ client, assert }) => {
    const { id, name, stateId, ibge } = await CityFactory.create()

    const response = await client
      .get(`${BASE_URL}/cities/search/${name}`)
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
    assert.equal(last.stateId, stateId)
    assert.equal(last.ibge, ibge)
  })

  test('index - it should return list with data', async ({ client, assert }) => {
    const { id, name, stateId, ibge } = await CityFactory.create()

    const responseOne = await client
      .get(`${BASE_URL}/cities`)
      .header('Authorization', `Bearer ${tokenManager}`)

    responseOne.assertStatus(200)

    const bodyOne = responseOne.body()

    assert.exists(bodyOne.paginate)
    assert.exists(bodyOne.paginate.meta)
    assert.exists(bodyOne.paginate.data)

    assert.isObject(bodyOne.paginate)
    assert.isObject(bodyOne.paginate.meta)

    const responseTwo = await client
      .get(`${BASE_URL}/cities${bodyOne.paginate.meta.lastPageUrl}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    responseTwo.assertStatus(200)

    const bodyTwo = responseTwo.body()

    assert.isArray(bodyTwo.paginate.data)
    assert.isNotEmpty(bodyTwo.paginate.data)

    const last = bodyTwo.paginate.data[bodyTwo.paginate.data.length - 1]

    assert.equal(last.id, id)
    assert.equal(last.name, name)
    assert.equal(last.stateId, stateId)
    assert.equal(last.ibge, ibge)
  })
})
