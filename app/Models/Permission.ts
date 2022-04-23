import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

import User from './User'
import Role from './Role'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class Permission extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public slug: string

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public users: ManyToMany<typeof User>

  @manyToMany(() => Role, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public roles: ManyToMany<typeof Role>

  @beforeCreate()
  public static assignCuid(permission: Permission) {
    permission.id = cuid()
  }
}
