import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TextInfo from 'App/Models/TextInfo'
import CreateTextInfo from 'App/Validators/CreateTextInfoValidator'
import UpdateTextInfo from 'App/Validators/UpdateTextInfoValidator'

export default class TextInfosController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await TextInfo.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await TextInfo.findOrFail(id)
    return response.ok({ data })
  }

  public async store({ request, response }: HttpContextContract) {
    const infoPayload = await request.validate(CreateTextInfo)
    const data = await TextInfo.create(infoPayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const { html } = await request.validate(UpdateTextInfo)
    const id = request.param('id')
    const data = await TextInfo.findOrFail(id)

    data.html = html
    await data.save()

    return response.ok({ data })
  }
}
