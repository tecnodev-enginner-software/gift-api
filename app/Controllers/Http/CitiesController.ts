import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateCity from 'App/Validators/CreateCityValidator'
import UpdateCity from 'App/Validators/UpdateCityValidator'

import City from 'App/Models/City'

export default class CitiesController {
  public async search({ request, response }: HttpContextContract) {
    const { term, page } = await request.params()
    const limit = 10

    const paginate = await City.query()
      .where('name', 'LIKE', `%${term}%`)
      .paginate(page ?? 1, limit)
    return response.ok({ paginate })
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await City.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async store({ request, response }: HttpContextContract) {
    const cityPayload = await request.validate(CreateCity)
    const data = await City.create(cityPayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const cityPayload = await request.validate(UpdateCity)
    const id = request.param('id')
    const data = await City.findOrFail(id)

    data.merge({ ...cityPayload })
    await data.save()

    return response.ok({ data })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await City.findOrFail(id)
    return response.ok({ data })
  }
}
