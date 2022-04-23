import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Hash from '@ioc:Adonis/Core/Hash'

import Database from '@ioc:Adonis/Lucid/Database'

import LinkTokenEnum from 'Contracts/enums/LinkToken'

import { UserFactory } from 'Database/factories'
import { DateTime, Duration } from 'luxon'

import { test } from '@japa/runner'

const BASE_URL = `/api/v1`

test.group('Password', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should send email with forgot password instructions', async ({ client, assert }) => {
    const emitter = Event.fake()
    const mailer = Mail.fake()

    const user = await UserFactory.create()

    const response = await client.post(`${BASE_URL}/forgot-password`).json({
      email: user.email,
    })

    response.assertStatus(204)

    //INICIO TEST EVENT
    assert.isTrue(emitter.exists('forgot:password'))

    const { name, data } = emitter.find('forgot:password')!

    assert.isTrue(name === 'forgot:password')

    const { email, token, fullName } = data

    assert.equal(email, user.email)
    assert.equal(fullName, user.fullName)

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
    //     return mail.html?.includes(user.fullName) ?? false
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return (
    //       mail.to?.includes({
    //         address: user.email,
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

  test('it should create reset password token', async ({ client, assert }) => {
    const emitter = Event.fake()
    const mailer = Mail.fake()

    const user = await UserFactory.create()

    const response = await client.post(`${BASE_URL}/forgot-password`).json({
      email: user.email,
    })

    response.assertStatus(204)

    const tokens = user.related('tokens').query()
    assert.isNotEmpty(tokens)

    //INICIO TEST EVENT
    assert.isTrue(emitter.exists('forgot:password'))

    const { name, data } = emitter.find('forgot:password')!

    assert.isTrue(name === 'forgot:password')

    const { email, token, fullName } = data

    assert.equal(email, user.email)
    assert.equal(fullName, user.fullName)

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
    //     return mail.html?.includes(user.fullName) ?? false
    //   })
    // )

    // assert.isTrue(
    //   mailer.find((mail) => {
    //     return (
    //       mail.to?.includes({
    //         address: user.email,
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

  test('it should return 422 when email is invalid', async ({ client, assert }) => {
    const response = await client.post(`${BASE_URL}/forgot-password`).json({ email: 'test@' })

    response.assertStatus(422)

    const body = response.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when required data is not provided or data is invalid', async ({
    client,
    assert,
  }) => {
    const response = await client.post(`${BASE_URL}/forgot-password`).json({})

    response.assertStatus(422)

    const body = response.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should be able to reset password', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const { token } = await user
      .related('tokens')
      .create({ token: 'token', type: LinkTokenEnum.PASSWORD })
    const password = 'test1234'

    const response = await client.post(`${BASE_URL}/reset-password`).json({ token, password })

    response.assertStatus(204)

    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))
  })

  test('it should return 422 when required data is not provided or data is invalid', async ({
    client,
    assert,
  }) => {
    const response = await client.post(`${BASE_URL}/reset-password`).json({})

    response.assertStatus(422)

    const body = response.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 404 when using the same token twice', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const { token } = await user
      .related('tokens')
      .create({ token: 'token', type: LinkTokenEnum.PASSWORD })
    const password = 'test1234'

    const responseOne = await client.post(`${BASE_URL}/reset-password`).json({ token, password })
    responseOne.assertStatus(204)

    const responseTwo = await client.post(`${BASE_URL}/reset-password`).json({ token, password })
    responseTwo.assertStatus(404)

    const body = responseTwo.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 404)
  })

  test('it cannot reset password when token is expired after 2 hours', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    const date = DateTime.now().minus(Duration.fromISOTime('02:01'))
    const { token } = await user
      .related('tokens')
      .create({ token: 'token', type: LinkTokenEnum.PASSWORD, createdAt: date })
    const password = 'test1234'

    const response = await client.post(`${BASE_URL}/reset-password`).json({ token, password })
    response.assertStatus(410)

    const body = response.body()

    assert.equal(body.code, 'TOKEN_EXPIRED')
    assert.equal(body.status, 410)
    assert.equal(body.message, 'token has expired')
  })
})
