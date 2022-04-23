import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateState from 'App/Validators/CreateStateValidator'
import UpdateState from 'App/Validators/UpdateStateValidator'

import State from 'App/Models/State'

export default class StatesController {
  public async search({ request, response }: HttpContextContract) {
    const { term, page } = await request.params()
    const limit = 10

    const paginate = await State.query()
      .where('name', 'LIKE', `%${term}%`)
      .paginate(page ?? 1, limit)
    return response.ok({ paginate })
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await State.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async store({ request, response }: HttpContextContract) {
    const statePayload = await request.validate(CreateState)
    const data = await State.create(statePayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const statePayload = await request.validate(UpdateState)
    const id = request.param('id')
    const data = await State.findOrFail(id)

    data.merge({ ...statePayload })
    await data.save()

    return response.ok({ data })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await State.findOrFail(id)
    return response.ok({ data })
  }
}