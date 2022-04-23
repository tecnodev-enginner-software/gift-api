import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RolesController {
  public async index({ request, response }: HttpContextContract) {
    return response.ok({})
  }

  public async update({ request, response }: HttpContextContract) {
    return response.ok({})
  }
}
