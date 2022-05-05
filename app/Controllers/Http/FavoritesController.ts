import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BadRequest from 'App/Exceptions/BadRequestException'

import UpdateFavorite from 'App/Validators/UpdateFavoriteValidator'

import Favorite from 'App/Models/Favorite'

export default class FavoritesController {
  public async index({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new BadRequest('authentication not found', 400)
    }

    const { id } = auth.user

    const page = request.input('page', 1)
    const limit = 10

    const paginate = await Favorite.query()
      .where('user_id', id)
      .preload('user')
      .preload('favorited')
      .paginate(page, limit)

    return response.ok({ paginate })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const { selected } = await request.validate(UpdateFavorite)

    if (!auth.user) {
      throw new BadRequest('authentication not found', 400)
    }

    const user = auth.user

    await bouncer.with('UserPolicy').authorize('update', user)

    const id = request.param('id')
    if (selected) {
      await Favorite.updateOrCreate(
        {
          userId: user.id,
        },
        {
          favoritedId: id,
        }
      )
    } else {
      const favorite = await Favorite.query()
        .where((query) => {
          query.where('user_id', user.id).where('favorited_id', id)
        })
        .first()

      if (favorite) {
        favorite.delete()
      }
    }

    return response.noContent()
  }
}
