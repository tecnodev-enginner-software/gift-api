import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BadRequest from 'App/Exceptions/BadRequestException'
import ForbiddenRequest from 'App/Exceptions/ForbiddenRequestException'

import NotificationToken from 'App/Models/NotificationToken'
import Notification from 'App/Models/Notification'
import User from 'App/Models/User'

import StoreNotification from 'App/Validators/StoreNotificationValidator'
import RoleEnum from 'Contracts/enums/Role'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export default class NotificationsController {
  public async create({ request, response }: HttpContextContract) {
    //CREATE NOTIFICATION
    return response.noContent()
  }

  public async store({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new BadRequest('authentication not found', 400)
    }

    const user: User = auth.user

    const payload = await request.validate(StoreNotification)
    await NotificationToken.updateOrCreate(
      {
        deviceId: payload.deviceId,
      },
      { ...payload, userId: user.id }
    )

    return response.noContent()
  }

  public async update({ request, response, auth }: HttpContextContract) {
    //UPDATE CHECK NOTIFICATION
    return response.noContent()
  }

  public async index({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new BadRequest('authentication not found', 400)
    }

    const user: User = auth.user
    await user.load('roles')

    if (!user?.roles) {
      throw new ForbiddenRequest()
    }

    const page = request.input('page', 1)
    const limit = 10

    let paginate: ModelPaginatorContract<Notification>

    const countRole = user.roles.reduce((acc, val) => acc + val.binary, 0) ?? 1
    if (countRole < RoleEnum.MANAGER) {
      paginate = await Notification.query()
        .where('userId', user.id)
        .where('roleType', RoleEnum[countRole])
        .orderBy('created_at', 'desc')
        .paginate(page, limit)
    } else {
      paginate = await Notification.query()
        .where('roleType', RoleEnum.MANAGER)
        .orderBy('created_at', 'desc')
        .paginate(page, limit)
    }
    return response.ok({ paginate })
  }
}
