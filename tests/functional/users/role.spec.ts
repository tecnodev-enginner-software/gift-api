import { cuid } from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'
import { test, TestContext } from '@japa/runner'
import RoleEnum from 'Contracts/enums/Role'
import { RoleFactory, UserFactory } from 'Database/factories'

const BASE_URL = '/api/v1'

let tokenBasic = ''
let tokenManager = ''

const userToken = async function (context: TestContext, role: number): Promise<string> {
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

  return body.token.token
}

test.group('Role', (group) => {
  group.each.setup(async (request) => {
    await Database.beginGlobalTransaction()

    tokenBasic = await userToken(request.context, RoleEnum.BASIC)
    tokenManager = await userToken(request.context, RoleEnum.MANAGER)
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

  test('should return 403 if user basic level of access tries to access unauthorized route', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get(`${BASE_URL}/roles`)
      .header('Authorization', `Bearer ${tokenBasic}`)
    response.assertStatus(403)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'FORBIDDEN_REQUEST')
    assert.equal(body.status, 403)
  })

  test('should return 403 if user manager level of access tries to access unauthorized route', async ({
    client,
    assert,
  }) => {
    const response = await client
      .put(`${BASE_URL}/roles/${cuid()}`)
      .header('Authorization', `Bearer ${tokenManager}`)

    response.assertStatus(403)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'FORBIDDEN_REQUEST')
    assert.equal(body.status, 403)
  })
})
