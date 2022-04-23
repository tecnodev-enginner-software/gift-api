import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MusicalGenre from 'App/Models/MusicalGenre'
import CreateMusicalGenre from 'App/Validators/CreateMusicalGenreValidator'
import UpdateMusicalGenre from 'App/Validators/UpdateMusicalGenreValidator'

export default class MusicalGenresController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const paginate = await MusicalGenre.query().paginate(page, limit)
    return response.ok({ paginate })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await MusicalGenre.findOrFail(id)
    return response.ok({ data })
  }

  public async store({ request, response }: HttpContextContract) {
    const musicalGenrePayload = await request.validate(CreateMusicalGenre)
    const data = await MusicalGenre.create(musicalGenrePayload)
    return response.created({ data })
  }

  public async update({ request, response }: HttpContextContract) {
    const { description } = await request.validate(UpdateMusicalGenre)
    const id = request.param('id')
    const data = await MusicalGenre.findOrFail(id)

    data.description = description
    await data.save()

    return response.ok({ data })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const data = await MusicalGenre.findOrFail(id)
    await data.delete()
    return response.noContent()
  }
}
