import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ProfileEnum from 'Contracts/enums/Profile'
import DocumentEnum from 'Contracts/enums/Document'

export default class CreateUserValidator {
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
    username: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({ trim: true }, [rules.minLength(8)]),
    fullName: schema.string.nullableAndOptional({ trim: true }, [rules.minLength(3)]),
    about: schema.string.nullableAndOptional({ trim: true }),
    document: schema.string.nullableAndOptional({ trim: true }),
    accountType: schema.enum(Object.values(ProfileEnum), [rules.required()]),
    documentType: schema.enum.nullableAndOptional(Object.values(DocumentEnum)),
    corporateName: schema.string.nullableAndOptional({ trim: true }, [rules.minLength(3)]),
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
    'email.required': 'email is required',
    'password.required': 'password is required',
    'email.email': 'email invalid',
    'email.unique': 'email not available',
    'username.unique': 'username not available',
  }
}
