import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventSize from 'App/Models/EventSize'
import CreateEventSize from 'App/Validators/CreateEventSizeValidator'
import UpdateEventSize from 'App/Validators/UpdateEventSizeValidator'

export default class EventSizesController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await EventSize.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await EventSize.findOrFail(id)
    return response.ok({ data })
  }

  public async store({ request, response }: HttpContextContract) {
    const eventPayload = await request.validate(CreateEventSize)
    const data = await EventSize.create(eventPayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const { description } = await request.validate(UpdateEventSize)
    const id = request.param('id')
    const data = await EventSize.findOrFail(id)

    data.description = description
    await data.save()

    return response.ok({ data })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await EventSize.findOrFail(id)
    await data.delete()
    return response.noContent()
  }
}
