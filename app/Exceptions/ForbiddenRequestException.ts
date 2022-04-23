import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and er
ror code for every exception.
|
| @example
| new BadRequestException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ForbiddenRequestException extends Exception {
  public code = 'FORBIDDEN_REQUEST'
  public status = 403

  constructor() {
    super("You don't have permission to access")
  }

  public async handle(error: this, ctx: HttpContextContract) {
    return ctx.response.status(error.status).send({
      code: error.code,
      message: error.message,
      status: error.status,
    })
  }
}
