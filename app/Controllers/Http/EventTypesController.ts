import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventType from 'App/Models/EventType'
import CreateEventType from 'App/Validators/CreateEventTypeValidator'
import UpdateEventType from 'App/Validators/UpdateEventTypeValidator'

export default class EventTypesController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await EventType.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await EventType.findOrFail(id)
    return response.ok({ data })
  }

  public async store({ request, response }: HttpContextContract) {
    const eventPayload = await request.validate(CreateEventType)
    const data = await EventType.create(eventPayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const { description } = await request.validate(UpdateEventType)
    const id = request.param('id')
    const data = await EventType.findOrFail(id)

    data.description = description
    await data.save()

    return response.ok({ data })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await EventType.findOrFail(id)
    await data.delete()
    return response.noContent()
  }
}
