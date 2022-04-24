import Database from '@ioc:Adonis/Lucid/Database'
import { test, TestContext } from '@japa/runner'
import User from 'App/Models/User'
import ProfileEnum from 'Contracts/enums/Profile'
import RoleEnum from 'Contracts/enums/Role'
import { RoleFactory, UserFactory, MusicalGenreFactory } from 'Database/factories'

const BASE_URL = `/api/v1`

let tokenBasic = ''
let tokenManager = ''

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

test.group('Profile', (group) => {
  group.each.setup(async (request) => {
    await Database.beginGlobalTransaction()

    const dataBasic = await userToken(request.context, RoleEnum.BASIC)
    tokenBasic = dataBasic.token
    userModelBasic = dataBasic.user

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

  test('store - it should create an talent user of basic type return 201 with valid profile', async ({
    client,
    assert,
  }) => {
    const musicalGenres = await MusicalGenreFactory.createMany(5)
    const userPayload = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      accountType: ProfileEnum.TELENT,
      password: 'test1234',
      musicalGeneres: musicalGenres.map((musicalGenre) => musicalGenre.id),
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')

    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.firstName, userPayload.fullName)

    assert.notExists(body.user.password, 'Password defined')

    assert.exists(body.user.profile.accountType)

    assert.equal(body.user.profile.accountType, userPayload.accountType)
  })

  test('store - it should create an talent user of complete type return 201 with valid profile', async ({
    client,
    assert,
  }) => {
    const musicalGenres = await MusicalGenreFactory.createMany(5)
    const userPayload = {
      username: 'test',
      email: 'test@test.com',
      accountType: ProfileEnum.TELENT,
      password: 'test1234',
      fullName: 'test test@',
      about: 'test test test test',
      musicalGeneres: musicalGenres.map((musicalGenre) => musicalGenre.id),
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(201)

    const body = response.body()

    const names = userPayload.fullName.split(' ')
    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')

    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.firstName, names[0])
    assert.equal(body.user.lastName, names[1])

    assert.notExists(body.user.password, 'Password defined')

    assert.exists(body.user.profile.accountType)

    assert.equal(body.user.profile.accountType, userPayload.accountType)
    assert.equal(body.user.profile.about, userPayload.about)
  })

  test('store - it should create profile', async ({ client, assert }) => {
    const profilePayload = {
      accountType: ProfileEnum.TELENT,
    }

    const response = await client
      .post(`${BASE_URL}/profiles`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(profilePayload)
    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.profile, 'Profile undefined')
    assert.exists(body.profile.id, 'Id undefined')

    assert.equal(body.profile.accountType, profilePayload.accountType)
    assert.equal(body.profile.userId, userModelBasic.id)
  })

  test('store - it should create profile complete', async ({ client, assert }) => {
    const profilePayload = {
      accountType: ProfileEnum.TELENT,
      about: 'test test test',
    }

    const response = await client
      .post(`${BASE_URL}/profiles`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(profilePayload)
    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.profile, 'Profile undefined')
    assert.exists(body.profile.id, 'Id undefined')

    assert.equal(body.profile.accountType, profilePayload.accountType)
    assert.equal(body.profile.about, profilePayload.about)
    assert.equal(body.profile.userId, userModelBasic.id)
  })

  test('store - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post(`${BASE_URL}/profiles`)
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

  test('store - it should return 422 when account type is invalid', async ({ client, assert }) => {
    const profilePayload = {
      about: 'test test test test',
    }

    const response = await client
      .post(`${BASE_URL}/profiles`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(profilePayload)
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 400 when trying a new registration in an already registered profile', async ({
    client,
    assert,
  }) => {
    const user = await User.findOrFail(userModelBasic.id)

    await user
      .related('profile')
      .updateOrCreate({ userId: user.id }, { accountType: ProfileEnum.TELENT, about: 'test' })

    const profilePayload = {
      accountType: ProfileEnum.CLIENT,
      about: 'test test test test',
    }

    const response = await client
      .post(`${BASE_URL}/profiles`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(profilePayload)
    response.assertStatus(400)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
  })

  test('update - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const user = await User.findOrFail(userModelBasic.id)

    await user
      .related('profile')
      .updateOrCreate({ userId: user.id }, { accountType: ProfileEnum.TELENT, about: 'test' })

    const response = await client
      .put(`${BASE_URL}/profiles/${user.id}`)
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

  test('update - it should updated profile', async ({ client, assert }) => {
    const user = await User.findOrFail(userModelBasic.id)

    await user
      .related('profile')
      .updateOrCreate({ userId: user.id }, { accountType: ProfileEnum.TELENT, about: 'test' })

    const profilePayload = {
      about: 'test test test test',
    }

    const response = await client
      .put(`${BASE_URL}/profiles/${user.id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(profilePayload)
    response.assertStatus(201)

    const body = response.body()

    assert.equal(body.profile.about, profilePayload.about)
    assert.equal(body.profile.userId, user.id)
  })

  test('update - it should return 400 registration not carried out', async ({ client, assert }) => {
    const profilePayload = {
      about: 'test test test',
    }

    const response = await client
      .put(`${BASE_URL}/profiles/${userModelBasic.id}`)
      .header('Authorization', `Bearer ${tokenBasic}`)
      .json(profilePayload)
    response.assertStatus(400)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
  })

  test('approve - it should approve profile', async ({ client, assert }) => {
    const user = await User.findOrFail(userModelBasic.id)

    await user
      .related('profile')
      .updateOrCreate({ userId: user.id }, { accountType: ProfileEnum.TELENT, about: 'test' })

    const profilePayload = {
      consent: true,
    }

    const response = await client
      .put(`${BASE_URL}/profiles/approve/${user.id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(profilePayload)
    response.assertStatus(204)

    await user.load('profile')

    assert.isTrue(user.profile.approved)
  })

  test('approve - it should not approve profile', async ({ client, assert }) => {
    const user = await User.findOrFail(userModelBasic.id)

    await user
      .related('profile')
      .updateOrCreate({ userId: user.id }, { accountType: ProfileEnum.TELENT, about: 'test' })

    const profilePayload = {
      consent: false,
    }

    const response = await client
      .put(`${BASE_URL}/profiles/approve/${user.id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(profilePayload)
    response.assertStatus(204)

    await user.load('profile')

    assert.isFalse(user.profile.approved)
  })

  test('approve - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const user = await User.findOrFail(userModelBasic.id)

    await user
      .related('profile')
      .updateOrCreate({ userId: user.id }, { accountType: ProfileEnum.TELENT, about: 'test' })

    const profilePayload = {}

    const response = await client
      .put(`${BASE_URL}/profiles/approve/${user.id}`)
      .header('Authorization', `Bearer ${tokenManager}`)
      .json(profilePayload)
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
    const user = await User.findOrFail(userModelBasic.id)

    await user
      .related('profile')
      .updateOrCreate({ userId: user.id }, { accountType: ProfileEnum.TELENT, about: 'test' })

    await user.load('profile')

    const response = await client
      .get(`${BASE_URL}/profiles`)
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

    assert.equal(body.paginate.data[0].id, user.profile.id)
    assert.equal(body.paginate.data[0].userId, user.id)
    assert.equal(body.paginate.data[0].user.fullName, user.fullName)
  })
})
