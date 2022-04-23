import { rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateStateValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    uf: schema.string({ trim: true }, [
      rules.alpha(),
      rules.minLength(2),
      rules.regex(/^[a-zA-Z]+$/i),
    ]),
    name: schema.string({ trim: true }, [
      rules.alpha(),
      rules.minLength(3),
      rules.regex(/^[a-zA-Z]+$/i),
    ]),
    countryId: schema.string({ trim: true }),
    regionId: schema.string({ trim: true }),
    ddd: schema.string.optional({ trim: true }),
    ibge: schema.number.optional(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'countryId.required': 'country is required',
    'regionId.required': 'region is required',
    'name.required': 'name is required',
    'uf.required': 'uf is required',
    'uf.minLength': 'uf must be {{ options.minLength }} characters',
  }
}
