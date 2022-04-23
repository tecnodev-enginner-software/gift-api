import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateSession from 'App/Validators/CreateSessionValidator'
import BadRequest from 'App/Exceptions/BadRequestException'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate(CreateSession)
    const token = await auth.use('api').attempt(email, password)
    const user = auth.user!

    if (!user.active) {
      throw new BadRequest('User is not yet active on the system. Check your email.', 400)
    }

    return response.created({ user, token })
  }

  public async destroy({ response, auth }: HttpContextContract) {
    await auth.logout()
    return response.ok({})
  }
}
