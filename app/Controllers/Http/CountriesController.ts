import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateCountry from 'App/Validators/CreateCountryValidator'
import UpdateCountry from 'App/Validators/UpdateCountryValidator'

import Country from 'App/Models/Country'

export default class CountriesController {
  public async search({ request, response }: HttpContextContract) {
    const { term, page } = await request.params()
    const limit = 10

    const paginate = await Country.query()
      .where('name', 'LIKE', `%${term}%`)
      .paginate(page ?? 1, limit)
    return response.ok({ paginate })
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await Country.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async store({ request, response }: HttpContextContract) {
    const countryPayload = await request.validate(CreateCountry)
    const data = await Country.create(countryPayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const countryPayload = await request.validate(UpdateCountry)
    const id = request.param('id')
    const data = await Country.findOrFail(id)

    data.merge({ ...countryPayload })
    await data.save()

    return response.ok({ data })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await Country.findOrFail(id)
    return response.ok({ data })
  }
}
