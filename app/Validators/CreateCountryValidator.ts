import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateCountryValidator {
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
    name: schema.string({ trim: true }, [
      rules.alpha(),
      rules.minLength(3),
      rules.regex(/^[a-zA-Z]+$/i),
      rules.unique({ table: 'countries', column: 'name' }),
    ]),
    abbreviation: schema.string({ trim: true }, [
      rules.alpha(),
      rules.minLength(3),
      rules.regex(/^[a-zA-Z]+$/i),
      rules.unique({ table: 'countries', column: 'abbreviation' }),
    ]),
    bacen: schema.number([rules.unsigned(), rules.unique({ table: 'countries', column: 'bacen' })]),
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
    'name.required': 'name is required',
    'name.minLength': 'name must be {{ options.minLength }} characters',
    'name.unique': 'name not available',
    'abbreviation.required': 'abbreviation is required',
    'abbreviation.minLength': 'abbreviation must be {{ options.minLength }} characters',
    'abbreviation.unique': 'abbreviation not available',
  }
}
