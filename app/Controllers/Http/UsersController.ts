import { cpf, cnpj } from 'cpf-cnpj-validator'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Event from '@ioc:Adonis/Core/Event'

import ProfileEnum from 'Contracts/enums/Profile'
import LinkTokenEnum from 'Contracts/enums/LinkToken'
import RoleEnum from 'Contracts/enums/Role'

import UpdateUser from 'App/Validators/UpdateUserValidator'
import CreateUser from 'App/Validators/CreateUserValidator'
import ActivateUser from 'App/Validators/ActivateUserValidator'

import TokenExpired from 'App/Exceptions/TokenExpiredException'
import BadRequest from 'App/Exceptions/BadRequestException'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

import { randomBytes } from 'crypto'
import { promisify } from 'util'

export default class UsersController {
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { email, password } = await request.validate(UpdateUser)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    await bouncer.with('UserPolicy').authorize('update', user)

    user.email = email
    user.password = password
    await user.save()

    return response.ok({ user })
  }

  public async store({ request, response }: HttpContextContract) {
    const userCompletePayload = await request.validate(CreateUser)
    const { username, email, password, accountType, about } = userCompletePayload

    let user: User

    switch (accountType) {
      case ProfileEnum.TELENT: {
        const { fullName, musicalGeneres } = userCompletePayload

        if (!fullName) {
          throw new BadRequest('name not found', 400)
        }

        if (!Array.isArray(musicalGeneres) || !musicalGeneres.length) {
          throw new BadRequest('musical generes not found', 400)
        }

        const { firstName, lastName } = splitName(fullName)
        user = await User.create({
          username,
          email,
          password,
          firstName,
          lastName,
          fullName,
        })

        await user.related('musicalGenres').attach(musicalGeneres)
        break
      }
      case ProfileEnum.CLIENT: {
        const { documentType, document, corporateName } = userCompletePayload

        if (!document || !corporateName) {
          throw new BadRequest('document not found', 400)
        }

        switch (documentType) {
          case 'cpf': {
            if (!cpf.isValid(document)) {
              throw new BadRequest('cpf is invalid', 400)
            }
            break
          }
          case 'cnpj': {
            if (!cnpj.isValid(document)) {
              throw new BadRequest('cnpj is invalid', 400)
            }
            break
          }
          default:
            throw new BadRequest('document type not found', 400)
        }

        user = await User.create({
          username,
          email,
          password,
          corporateName,
          fullName: corporateName,
        })

        await user
          .related('documents')
          .updateOrCreate({ userId: user.id }, { code: document, documentType })
        break
      }
      default:
        throw new BadRequest('account type not found', 400)
    }

    const role = await Role.findByOrFail('binary', RoleEnum.BASIC)
    await user.related('roles').attach([role.id])
    await user.related('profile').updateOrCreate({ userId: user.id }, { about, accountType })

    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')
    await user.related('tokens').updateOrCreate(
      { userId: user.id },
      {
        token,
        type: LinkTokenEnum.ACTIVATION,
      }
    )

    await user.load('profile')

    Event.emit('new:user', { email, token, fullName: user.fullName })

    return response.created({ user })
  }

  public async active({ request, response }: HttpContextContract) {
    const { token } = await request.validate(ActivateUser)

    const userByToken = await User.query()
      .whereHas('tokens', (query) => {
        query.where('token', token)
      })
      .preload('tokens')
      .firstOrFail()

    const tokenFind = userByToken.tokens.find((x) => x.type === LinkTokenEnum.ACTIVATION)
    if (!tokenFind) {
      throw new BadRequest('Not found token', 400)
    }

    const tokenAge = Math.abs(tokenFind.createdAt.diffNow('hours').hours)
    if (tokenAge > 2) throw new TokenExpired()

    userByToken.merge({ valid: true })
    await userByToken.save()
    await tokenFind.delete()

    return response.noContent()
  }

  public async show({ params, response, auth }: HttpContextContract) {
    const userId = params.userId

    let user: User
    if (userId) {
      user = await User.findOrFail(userId)
    } else {
      user = auth.user!
    }

    await user.load((loader) => {
      loader.load('profile').load('roles')
    })

    return response.ok({ user })
  }
}

const splitName = (name = '') => {
  const [firstName, ...lastName] = name.split(' ').filter(Boolean)
  return {
    firstName: firstName,
    lastName: lastName.join(' '),
  }
}
