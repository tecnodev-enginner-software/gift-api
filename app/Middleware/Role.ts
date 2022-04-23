import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenRequest from 'App/Exceptions/ForbiddenRequestException'
import User from 'App/Models/User'

export default class Role {
  public async handle(
    { auth, request }: HttpContextContract,
    next: () => Promise<void>,
    guards?: number[]
  ) {
    await auth.check()
    const user: User | undefined = request.ctx?.auth.user

    if (user) {
      const binary = guards?.reduce((acc, val) => acc + val, 0) ?? 1
      await user.load('roles')

      if (binary && binary > 1) {
        if (!user?.roles) {
          throw new ForbiddenRequest()
        }

        const countRole = user.roles.reduce((acc, val) => acc + val.binary, 0) ?? 1
        if (countRole < binary) {
          throw new ForbiddenRequest()
        }
      }
    }
    await next()
  }
}
