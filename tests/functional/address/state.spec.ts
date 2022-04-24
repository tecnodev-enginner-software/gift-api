import Database from '@ioc:Adonis/Lucid/Database'
import { test, TestContext } from '@japa/runner'
import RoleEnum from 'Contracts/enums/Role'
import {
  CountryFactory,
  CityFactory,
  RegionFactory,
  RoleFactory,
  StateFactory,
  UserFactory,
} from 'Database/factories'

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

test.group('State', (group) => {
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

  test('store - it should create an state', async ({ client, assert }) => {
    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'test',
      uf: 'test',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .post(`${BASE_URL}/states`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.data, 'state undefined')
    assert.exists(body.data.id, 'id undefined')

    assert.equal(body.data.name, statePayload.name)
    assert.equal(body.data.uf, statePayload.uf)
    assert.equal(body.data.ddd, statePayload.ddd)
    assert.equal(body.data.ibge, statePayload.ibge)
    assert.equal(body.data.country.id, statePayload.countryId)
    assert.equal(body.data.region.id, statePayload.regionId)
  })

  test('store - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post(`${BASE_URL}/states`)
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
    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'te',
      uf: 'test',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .post(`${BASE_URL}/states`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when the uf has no minimum length', async ({
    client,
    assert,
  }) => {
    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'test',
      uf: 't',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .post(`${BASE_URL}/states`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

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
    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: '#$0]',
      uf: 'test',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .post(`${BASE_URL}/states`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when the uf does not respect the regex', async ({
    client,
    assert,
  }) => {
    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'test',
      uf: '#$0]',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .post(`${BASE_URL}/states`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

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
    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'test',
      uf: 'test',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .post(`${BASE_URL}/states`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(statePayload)

    response.assertStatus(403)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'FORBIDDEN_REQUEST')
    assert.equal(body.status, 403)
  })

  test('update - it should update an state', async ({ client, assert }) => {
    const { id } = await StateFactory.create()

    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'testing',
      uf: 'te',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .put(`${BASE_URL}/states/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.data, 'state undefined')

    assert.equal(body.data.uf, statePayload.uf)
    assert.equal(body.data.name, statePayload.name)
    assert.equal(body.data.id, id)
  })

  test('update - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const { id } = await StateFactory.create()

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
    const { id } = await StateFactory.create()

    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'te',
      uf: 'test',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - should return 422 when the uf has no minimum length', async ({
    client,
    assert,
  }) => {
    const { id } = await StateFactory.create()

    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'test',
      uf: 't',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

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
    const { id } = await StateFactory.create()

    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: '#$0]',
      uf: 'test',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - should return 422 when the uf does not respect the regex', async ({
    client,
    assert,
  }) => {
    const { id } = await StateFactory.create()

    const country = await CountryFactory.create()
    const region = await RegionFactory.create()

    const statePayload = {
      name: 'test',
      uf: '#$0]',
      ddd: '[89]',
      ibge: 9999,
      countryId: country.id,
      regionId: region.id,
    }

    const response = await client
      .put(`${BASE_URL}/countries/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(statePayload)

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
    const { id, name, uf, countryId, regionId, ddd, ibge } = await StateFactory.create()
    const response = await client
      .get(`${BASE_URL}/states/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    response.assertStatus(200)

    const body = response.body()

    assert.isNotNull(body.data)

    assert.equal(body.data.id, id)
    assert.equal(body.data.name, name)
    assert.equal(body.data.uf, uf)
    assert.equal(body.data.countryId, countryId)
    assert.equal(body.data.regionId, regionId)
    assert.equal(body.data.ddd, ddd)
    assert.equal(body.data.ibge, ibge)
  })

  test('search - it should return list with data', async ({ client, assert }) => {
    const { id, name, uf, countryId, regionId, ddd, ibge } = await StateFactory.create()

    const response = await client
      .get(`${BASE_URL}/states/search/${name}`)
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
    assert.equal(last.uf, uf)
    assert.equal(last.countryId, countryId)
    assert.equal(last.regionId, regionId)
    assert.equal(last.ddd, ddd)
    assert.equal(last.ibge, ibge)
  })

  test('index - it should return list with data', async ({ client, assert }) => {
    const { id, name, uf, countryId, regionId, ddd, ibge } = await StateFactory.create()

    const responseOne = await client
      .get(`${BASE_URL}/states`)
      .header('Authorization', `Bearer ${tokenManager}`)

    responseOne.assertStatus(200)

    const bodyOne = responseOne.body()

    assert.exists(bodyOne.paginate)
    assert.exists(bodyOne.paginate.meta)
    assert.exists(bodyOne.paginate.data)

    assert.isObject(bodyOne.paginate)
    assert.isObject(bodyOne.paginate.meta)

    const responseTwo = await client
      .get(`${BASE_URL}/states${bodyOne.paginate.meta.lastPageUrl}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    responseTwo.assertStatus(200)

    const bodyTwo = responseTwo.body()

    assert.isArray(bodyTwo.paginate.data)
    assert.isNotEmpty(bodyTwo.paginate.data)

    const last = bodyTwo.paginate.data[bodyTwo.paginate.data.length - 1]

    assert.equal(last.id, id)
    assert.equal(last.name, name)
    assert.equal(last.uf, uf)
    assert.equal(last.countryId, countryId)
    assert.equal(last.regionId, regionId)
    assert.equal(last.ddd, ddd)
    assert.equal(last.ibge, ibge)
  })

  test('destroy - it should return 204 in destroy data', async ({ client, assert }) => {
    const region = await RegionFactory.create()
    const { id } = await StateFactory.merge({ regionId: region.id }).create()

    const response = await client
      .delete(`${BASE_URL}/states/${id}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    response.assertStatus(204)
  })

  test('destroy - it should return 400 in destroy data with relationship', async ({
    client,
    assert,
  }) => {
    const region = await RegionFactory.create()
    const { id } = await StateFactory.merge({ regionId: region.id }).create()
    await CityFactory.merge({ stateId: id }).create()

    const response = await client
      .delete(`${BASE_URL}/states/${id}`)
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
