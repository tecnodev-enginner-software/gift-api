import Database from '@ioc:Adonis/Lucid/Database'
import { test, TestContext } from '@japa/runner'
import Notification from 'App/Models/Notification'
import User from 'App/Models/User'
import RoleEnum from 'Contracts/enums/Role'
import { NotificationFactory, RoleFactory, UserFactory } from 'Database/factories'

const BASE_URL = `/api/v1`

let tokenBasic = ''
let userModelBasic = {} as User

let tokenManager = ''
let userModelManager = {} as User

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

test.group('Notification', (group) => {
  group.each.setup(async (request) => {
    await Database.beginGlobalTransaction()

    const dataBasic = await userToken(request.context, RoleEnum.BASIC)
    tokenBasic = dataBasic.token
    userModelBasic = dataBasic.user

    const dataManager = await userToken(request.context, RoleEnum.MANAGER)
    tokenManager = dataManager.token
    userModelManager = dataManager.user
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

  test('index - it should return list type ', async ({ client, assert }) => {
    await NotificationFactory.merge({
      userId: userModelBasic.id,
    }).createMany(10)

    const response = await client
      .get(`${BASE_URL}/notifications`)
      .header('Authorization', `Bearer ${tokenBasic}`)
    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.paginate)
    assert.exists(body.paginate.meta)
    assert.exists(body.paginate.data)

    assert.isObject(body.paginate)
    assert.isObject(body.paginate.meta)

    assert.isArray(body.paginate.data)
  })
})
