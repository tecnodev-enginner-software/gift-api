import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class CuidRequest {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const pattern: string = request.ctx?.route?.pattern ?? ''
    if (pattern.includes('/:id')) {
      const id: string = request.param('id')
      if (!cuid.isCuid(id)) {
        throw new BadRequest('id of param invalid', 400)
      }
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
