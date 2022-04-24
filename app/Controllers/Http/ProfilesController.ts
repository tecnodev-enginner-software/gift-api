import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ApproveProfile from 'App/Validators/ApproveProfileValidator'
import CreateProfile from 'App/Validators/CreateProfileValidator'
import UpdateProfile from 'App/Validators/UpdateProfileValidator'

import Profile from 'App/Models/Profile'
import User from 'App/Models/User'
import BadRequest from 'App/Exceptions/BadRequestException'

export default class ProfilesController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await Profile.query().preload('user').paginate(page, limit)
    return response.ok({ paginate })
  }

  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    const profilePayload = await request.validate(CreateProfile)

    const userId = auth.user?.id ?? ''

    const user = await User.findOrFail(userId)
    await bouncer.with('UserPolicy').authorize('update', user)

    await user.load('profile')

    if (user.profile) {
      throw new BadRequest('registration already made', 400)
    }

    const profile = await Profile.create({ ...profilePayload, userId })
    await profile.load('user')

    return response.created({ profile })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { about } = await request.validate(UpdateProfile)

    const id = request.param('id')
    const user = await User.findOrFail(id)

    await bouncer.with('UserPolicy').authorize('update', user)

    await user.load('profile')
    const profile = user.profile

    if (!profile) {
      throw new BadRequest('registration not carried out', 400)
    }

    profile.merge({ about })

    await profile.save()
    await profile.load('user')

    return response.created({ profile })
  }

  public async approve({ request, response }: HttpContextContract) {
    const { consent } = await request.validate(ApproveProfile)

    const id = request.param('id')
    const user = await User.findOrFail(id)

    await user.load('profile')
    const profile = user.profile

    if (!profile) {
      throw new BadRequest('profile not found', 400)
    }

    profile.merge({ approved: consent })
    await profile.save()

    return response.noContent()
  }
}
