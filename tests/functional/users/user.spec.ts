import Mail from '@ioc:Adonis/Addons/Mail'
import Event from '@ioc:Adonis/Core/Event'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import LinkTokenEnum from 'Contracts/enums/LinkToken'
import ProfileEnum from 'Contracts/enums/Profile'
import RoleEnum from 'Contracts/enums/Role'
import { RoleFactory, UserFactory, MusicalGenreFactory } from 'Database/factories'
import { DateTime, Duration } from 'luxon'

const BASE_URL = '/api/v1'

let token = ''
let user = {} as User

test.group('User', (group) => {
  group.each.setup(async (request) => {
    await Database.beginGlobalTransaction()

    const roleBasic = await RoleFactory.merge({ binary: RoleEnum.BASIC }).create()

    const plainPassword = 'test'
    const newUser = await UserFactory.merge({ password: plainPassword }).create()
    await newUser
      .related('profile')
      .updateOrCreate({ userId: newUser.id }, { accountType: ProfileEnum.TELENT, about: 'test' })
    await newUser.related('roles').attach([roleBasic.id])

    const response = await request.context.client
      .post(`${BASE_URL}/sessions`)
      .json({ email: newUser.email, password: plainPassword })

    response.assertStatus(201)

    const body = response.body()

    token = body.token.token
    user = newUser
  })

  group.each.teardown(async (response) => {
    await response.context.client
      .delete(`${BASE_URL}/sessions`)
      .header('Authorization', `Bearer ${token}`)
    await Database.rollbackGlobalTransaction()
  })

  test('store - it should create an talent user of basic type', async ({ client, assert }) => {
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
  })

  test('store - it should create an talent user of complete type', async ({ client, assert }) => {
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
  })

  test('store - it should return 422 when the required data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client.post(`${BASE_URL}/users`).json({})
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when the name has no minimum length on create an talent user', async ({
    client,
    assert,
  }) => {
    const userPayload = {
      email: 'test@test.com',
      accountType: 'talent',
      password: 'test1234',
      fullName: 'te',
      about: 'test test test test',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when email is invalid', async ({ client, assert }) => {
    const userPayload = {
      email: 'test',
      accountType: 'talent',
      password: 'test1234',
      fullName: 'te',
      about: 'test test test test',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when email is alreay in use', async ({ client, assert }) => {
    const { email } = await UserFactory.create()

    const userPayload = {
      email: email,
      accountType: 'talent',
      password: 'test1234',
      fullName: 'test test@',
      about: 'test test test test',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
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
    const userPayload = {
      email: 'test@test.com',
      accountType: '',
      password: 'test123',
      fullName: 'test test@',
      about: 'test test test test',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 422 when password is invalid', async ({ client, assert }) => {
    const userPayload = {
      email: 'test@test.com',
      accountType: 'talent',
      password: 'test123',
      fullName: 'test test@',
      about: 'test test test test',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should create an client cpf user', async ({ client, assert }) => {
    const userPayload = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      accountType: 'client',
      password: 'test1234',
      corporateName: 'test',
      document: '81650170041',
      documentType: 'cpf',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')

    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.corporateName, userPayload.corporateName)

    assert.notExists(body.user.password, 'Password defined')
  })

  test('store - it should create an client cnpj user', async ({ client, assert }) => {
    const userPayload = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      accountType: 'client',
      password: 'test1234',
      corporateName: 'test',
      document: '81307435000185',
      documentType: 'cnpj',
    }

    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(201)

    const body = response.body()

    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')

    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.corporateName, userPayload.corporateName)

    assert.notExists(body.user.password, 'Password defined')
  })

  test('store - it should return 422 when the corporate name has no minimum length on create an client user', async ({
    client,
    assert,
  }) => {
    const userPayload = {
      email: 'test@test.com',
      accountType: 'client',
      password: 'test1234',
      corporateName: 'te',
      document: '81307435000185',
      documentType: 'cnpj',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(422)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.exists(body.errors)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('store - it should return 400 when cpf is invalid', async ({ client, assert }) => {
    const userPayload = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      accountType: 'client',
      password: 'test1234',
      corporateName: 'test',
      document: '00000000000',
      documentType: 'cpf',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)

    response.assertStatus(400)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
  })

  test('store - it should return 400 when cnpj is invalid', async ({ client, assert }) => {
    const userPayload = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      accountType: 'client',
      password: 'test1234',
      corporateName: 'test',
      document: '00000000000000',
      documentType: 'cnpj',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)
    response.assertStatus(400)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
  })

  test('store - it should return 400 when document type is invalid', async ({ client, assert }) => {
    const userPayload = {
      username: 'test',
      email: 'test@test.com',
      accountType: 'client',
      password: 'test1234',
      corporateName: 'test',
      document: '81307435000185',
      documentType: '',
    }
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)

    response.assertStatus(400)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
  })

  test('store - it should return 400 when musical generes is invalid', async ({
    client,
    assert,
  }) => {
    const userPayload = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      accountType: ProfileEnum.TELENT,
      password: 'test1234',
    }

    const response = await client.post(`${BASE_URL}/users`).json(userPayload)

    response.assertStatus(400)

    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
  })

  test('store - it should send email with user activation instructions', async ({
    client,
    assert,
  }) => {
    const emitter = Event.fake()
    const mailer = Mail.fake()

    const musicalGenres = await MusicalGenreFactory.createMany(5)

    const userPayload = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      accountType: ProfileEnum.TELENT,
      password: 'test1234',
      musicalGeneres: musicalGenres.map((musicalGenre) => musicalGenre.id),
    }

    //INICIO TEST API
    const response = await client.post(`${BASE_URL}/users`).json(userPayload)

    response.assertStatus(201)
    //FIM TEST API

    //INICIO TEST EVENT
    assert.isTrue(emitter.exists('new:user'))

    const { name, data } = emitter.find('new:user')!

    assert.isTrue(name === 'new:user')

    const { email, token, fullName } = data

    assert.equal(email, userPayload.email)
    assert.equal(fullName, userPayload.fullName)

    assert.isNotEmpty(token)
    //FIM TEST EVENT

    // TODO: VER TESTE COM MAILER
    //INICIO TEST MAIL
    // assert.isTrue(mailer.isFaked('smtp'))

    // assert.isTrue(
    //   mailer.exists((mail) => {
    //     console.log(mail)
    //     return mail.subject === 'Gift: Recuperação de Senha'
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return mail.html?.includes(userPayload.fullName) ?? false
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return (
    //       mail.to?.includes({
    //         address: userPayload.email,
    //       }) ?? false
    //     )
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return mail.from?.address === 'no-reply@talentos.gift'
    //   })
    // )
    //FIM TEST MAIL

    Event.restore()
    Mail.restore()
  })

  test('store - it should create activation token', async ({ client, assert }) => {
    const emitter = Event.fake()
    const mailer = Mail.fake()

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

    //INICIO TEST EVENT
    assert.isTrue(emitter.exists('new:user'))

    const { name, data } = emitter.find('new:user')!

    assert.isTrue(name === 'new:user')

    assert.equal(data.email, userPayload.email)
    assert.equal(data.fullName, userPayload.fullName)

    assert.isNotEmpty(data.token)
    //FIM TEST EVENT

    // TODO: VER TESTE COM MAILER
    //INICIO TEST MAIL
    // assert.isTrue(mailer.isFaked('smtp'))

    // assert.isTrue(
    //   mailer.exists((mail) => {
    //     console.log(mail)
    //     return mail.subject === 'Gift: Recuperação de Senha'
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return mail.html?.includes(userPayload.fullName) ?? false
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return (
    //       mail.to?.includes({
    //         address: userPayload.email,
    //       }) ?? false
    //     )
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return mail.from?.address === 'no-reply@talentos.gift'
    //   })
    // )
    //FIM TEST MAIL

    const body = response.body()

    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')

    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.firstName, userPayload.fullName)

    assert.notExists(body.user.password, 'Password defined')

    const user = await User.find(body.user.id)

    const tokens = await user?.related('tokens').query()
    assert.isNotEmpty(tokens)

    const token = tokens?.find((token) => token.type === LinkTokenEnum.ACTIVATION)
    if (token) {
      assert.isNotEmpty(token)
    }

    Event.restore()
    Mail.restore()
  })

  test('update - it should update an user', async ({ client, assert }) => {
    const email = 'test@test.com'

    const response = await client
      .put(`${BASE_URL}/users/${user.id}`)
      .json({ email, password: user.password })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.user, 'user undefined')

    assert.equal(body.user.email, email)
    assert.equal(body.user.id, user.id)
  })

  test('update - it should update the password of the user', async ({ client, assert }) => {
    const password = 'test1234'

    const response = await client
      .put(`${BASE_URL}/users/${user.id}`)
      .json({ email: user.email, password })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const body = response.body()

    assert.exists(body.user, 'user undefined')
    assert.equal(body.user.id, user.id)

    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))
  })

  test('active - it should be able to activate user', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const { token } = await user
      .related('tokens')
      .create({ token: 'token', type: LinkTokenEnum.ACTIVATION })

    const response = await client.post(`${BASE_URL}/users/activate`).json({ token })

    response.assertStatus(204)

    await user.refresh()
    assert.isTrue(user.valid)
  })

  test('active - it should return 422 when required data is not provided or data is invalid', async ({
    client,
    assert,
  }) => {
    const response = await client.post(`${BASE_URL}/users/activate`).json({})
    response.assertStatus(422)

    const body = response.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('active - it should return 404 when using the same token twice', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    const { token } = await user
      .related('tokens')
      .create({ token: 'token', type: LinkTokenEnum.ACTIVATION })

    const responseOne = await client.post(`${BASE_URL}/users/activate`).json({ token })
    responseOne.assertStatus(204)

    const responseTwo = await client.post(`${BASE_URL}/users/activate`).json({ token })
    responseTwo.assertStatus(404)

    const body = responseTwo.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 404)
  })

  test('active - it cannot activate user when token is expired after 2 hours', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    const date = DateTime.now().minus(Duration.fromISOTime('02:01'))
    const { token } = await user
      .related('tokens')
      .create({ token: 'token', type: LinkTokenEnum.ACTIVATION, createdAt: date })

    const response = await client.post(`${BASE_URL}/users/activate`).json({ token })
    response.assertStatus(410)

    const body = response.body()

    assert.equal(body.code, 'TOKEN_EXPIRED')
    assert.equal(body.status, 410)
    assert.equal(body.message, 'token has expired')
  })

  test('show - it should details user with parameters', async ({ client, assert }) => {
    const response = await client
      .get(`${BASE_URL}/users/${user.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const body = response.body()

    assert.isNotEmpty(body.user)
    assert.isNotEmpty(body.user.profile)
    assert.isNotEmpty(body.user.roles)

    assert.isArray(body.user.roles)
  })

  test('show - it should details user dont parameters', async ({ client, assert }) => {
    const response = await client
      .get(`${BASE_URL}/users`)
      .header('Authorization', `Bearer ${token}`)

    const body = response.body()

    response.assertStatus(200)

    assert.isNotEmpty(body.user)
    assert.isNotEmpty(body.user.profile)
    assert.isNotEmpty(body.user.roles)

    assert.isArray(body.user.roles)
  })
})
