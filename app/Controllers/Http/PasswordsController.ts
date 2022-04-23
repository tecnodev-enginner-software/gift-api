import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import TokenExpired from 'App/Exceptions/TokenExpiredException'
import BadRequest from 'App/Exceptions/BadRequestException'

import User from 'App/Models/User'

import LinkTokenEnum from 'Contracts/enums/LinkToken'
import ForgotPassword from 'App/Validators/ForgotPasswordValidator'
import ResetPassword from 'App/Validators/ResetPasswordValidator'

import { randomBytes } from 'crypto'
import { promisify } from 'util'

export default class PasswordsController {
  public async forgot({ request, response }: HttpContextContract) {
    const { email } = await request.validate(ForgotPassword)
    const user = await User.findByOrFail('email', email)

    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')
    await user.related('tokens').updateOrCreate(
      { userId: user.id },
      {
        token,
        type: LinkTokenEnum.PASSWORD,
      }
    )

    Event.emit('forgot:password', { email, token, fullName: user.fullName })

    const urlWithToken = `${Env.get('WEB_APP_URL')}/verification?token=${token}`

    await Mail.sendLater((message) => {
      message
        .from('no-reply@talentos.gift')
        .to(email)
        .subject('Gift: Recuperação de Senha')
        .htmlView('emails/forgotpassword', {
          productName: 'Gift',
          name: user.fullName,
          resetPasswordUrl: urlWithToken,
        })
    })

    return response.noContent()
  }

  public async reset({ request, response }: HttpContextContract) {
    const { token, password } = await request.validate(ResetPassword)

    const userByToken = await User.query()
      .whereHas('tokens', (query) => {
        query.where('token', token)
      })
      .preload('tokens')
      .firstOrFail()

    const tokenFind = userByToken.tokens.find((x) => x.type === LinkTokenEnum.PASSWORD)
    if (!tokenFind) {
      throw new BadRequest('Not found token', 400)
    }

    const tokenAge = Math.abs(tokenFind.createdAt.diffNow('hours').hours)
    if (tokenAge > 2) throw new TokenExpired()

    userByToken.password = password
    await userByToken.save()
    await tokenFind.delete()

    return response.noContent()
  }
}
