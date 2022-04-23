import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Modality from 'App/Models/Modality'
import CreateModality from 'App/Validators/CreateModalityValidator'
import UpdateModality from 'App/Validators/UpdateModalityValidator'

export default class ModalitiesController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await Modality.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await Modality.findOrFail(id)
    return response.ok({ data })
  }

  public async store({ request, response }: HttpContextContract) {
    const modalityPayload = await request.validate(CreateModality)
    const data = await Modality.create(modalityPayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const { description } = await request.validate(UpdateModality)
    const id = request.param('id')
    const data = await Modality.findOrFail(id)

    data.description = description
    await data.save()

    return response.ok({ data })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await Modality.findOrFail(id)
    await data.delete()
    return response.noContent()
  }
}
