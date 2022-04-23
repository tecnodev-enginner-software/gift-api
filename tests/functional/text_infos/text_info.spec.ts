import Database from '@ioc:Adonis/Lucid/Database'
import { RoleFactory, TextInfoFactory, UserFactory } from 'Database/factories'

import { test, TestContext } from '@japa/runner'

import RoleEnum from 'Contracts/enums/Role'
import TextInfoEnum from 'Contracts/enums/TextInfo'

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

test.group('Text Info', (group) => {
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

  test('store - it should create an text info', async ({ client, assert }) => {
    const infoPayload = { type: 'term', html: '</br>teste</br>' }
    const response = await client
      .post(`${BASE_URL}/text-infos`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(infoPayload)

    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.data, 'text info undefined')
    assert.exists(body.data.id, 'id undefined')

    assert.equal(body.data.type, infoPayload.type)
    assert.equal(body.data.html, infoPayload.html)
  })

  test('store - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post(`${BASE_URL}/text-infos`)
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

  test('store - it should return 422 when type is alreay in use', async ({ client, assert }) => {
    const { type } = await TextInfoFactory.create()
    const response = await client
      .post(`${BASE_URL}/text-infos`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({
        type,
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

  test('store - it should return 422 when html invalid', async ({ client, assert }) => {
    const infoPayload = { type: 'term', html: '' }
    const response = await client
      .post(`${BASE_URL}/text-infos`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(infoPayload)

    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('update - it should update an text info', async ({ client, assert }) => {
    const { id, type } = await TextInfoFactory.create()
    const html = '<p>testing<p/>'
    const response = await client
      .put(`${BASE_URL}/text-infos/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({ type, html })

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.data, 'text info undefined')

    assert.equal(body.data.html, html)
    assert.equal(body.data.id, id)
  })

  test('update - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const { id } = await TextInfoFactory.create()
    const response = await client
      .put(`${BASE_URL}/text-infos/${id}`)
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

  test('update - it should update a text info and not update the type possibility one', async ({
    client,
    assert,
  }) => {
    const { id } = await TextInfoFactory.merge({ type: TextInfoEnum.TERM }).create()
    const { type } = await TextInfoFactory.merge({ type: TextInfoEnum.POLICY }).create()

    const html = '<p>testing</p>'

    const response = await client
      .put(`${BASE_URL}/text-infos/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({
        type,
        html,
      })

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.data, 'text info undefined')

    assert.equal(body.data.html, html)
    assert.equal(body.data.id, id)

    assert.notEqual(body.data.type, type)
  })

  test('update - it should update a text info and not update the type possibility two', async ({
    client,
    assert,
  }) => {
    const { id } = await TextInfoFactory.merge({ type: TextInfoEnum.POLICY }).create()
    const { type } = await TextInfoFactory.merge({ type: TextInfoEnum.TERM }).create()

    const html = '<p>testing</p>'

    const response = await client
      .put(`${BASE_URL}/text-infos/${id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json({
        type,
        html,
      })

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.data, 'text info undefined')

    assert.equal(body.data.html, html)
    assert.equal(body.data.id, id)

    assert.notEqual(body.data.type, type)
  })

  test('index - it should return list with data', async ({ client, assert }) => {
    const { id, html } = await TextInfoFactory.create()

    const response = await client.get(`${BASE_URL}/text-infos`)

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
    assert.equal(body.paginate.data[0].html, html)
  })

  test('show - it should return list with data', async ({ client, assert }) => {
    const { id, html } = await TextInfoFactory.create()

    const response = await client.get(`${BASE_URL}/text-infos/${id}`)

    response.assertStatus(200)

    const body = response.body()

    assert.isNotNull(body.data)
    assert.exists(body.data, id)
    assert.exists(body.data, html)
  })
})
